// server/api/generate-quotation.post.ts

import { defineEventHandler, readBody, createError } from 'h3';
import { join } from 'path';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';

// --- Funciones de Utilidad ---

const formatNotesForHtml = (text: string | null | undefined): string => {
    if (!text || text.trim() === '') {
        return '';
    }
    // Reemplaza saltos de línea por <br> para HTML
    return text.replace(/\n/g, '<br>');
};

const formatCurrency = (value: number | null | undefined): string => {
    if (typeof value !== 'number' || isNaN(value)) return 'L 0.00';
    return new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: 'HNL',
        minimumFractionDigits: 2,
    }).format(value);
};

// FUNCIÓN DE GENERACIÓN DE ÍTEMS Y CÁLCULO DE TOTALES (Sin cambios funcionales aquí)
const generateQuotationItemsHtml = (items: any[]): {
    html: string,
    totals: {
        subtotal: number,
        descuento: number,
        importeExonerado: number,
        importeExento: number,
        impuesto: number,
        totalImpuesto: number,
        totalPagar: number
    }
} => {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return {
            html: `<tr><td colspan="5" style="text-align: center; padding: 10px;">No se han agregado ítems a la cotización.</td></tr>`,
            totals: { subtotal: 0, descuento: 0, importeExonerado: 0, importeExento: 0, impuesto: 0, totalImpuesto: 0, totalPagar: 0 }
        };
    }

    let itemsHtml = '';
    let subtotalGeneral = 0;
    const descuentoTotal = 0;
    let importeExonerado = 0;
    let importeExento = 0;
    const IVA_RATE = 0.15;


    items.forEach(item => {
        const itemQuantity = item.cantidad || 1;
        const itemPrecioUnitario = (item.manoDeObra || 0) + (item.valorRepuesto || 0);

        const subtotalItem = itemQuantity * itemPrecioUnitario;
        subtotalGeneral += subtotalItem;

        if (item.condicion === 'Servicio') {
            importeExonerado += subtotalItem;
        }

        const itemCode = item.codigo || 'N/A';
        const itemDescription = item.descripcion || 'Sin descripción';


        itemsHtml += `
            <tr>
                <td style="text-align: left;">${itemCode}</td>
                <td style="text-align: left;">${itemDescription}</td>
                <td>${itemQuantity}</td>
                <td style="text-align: right;">${formatCurrency(itemPrecioUnitario)}</td>
                <td style="text-align: right; font-weight: bold;">${formatCurrency(subtotalItem)}</td>
            </tr>
        `;
    });

    const subtotalNeto = subtotalGeneral - descuentoTotal;
    const baseImponible = subtotalNeto - importeExonerado - importeExento;
    const totalImpuesto = Math.max(0, baseImponible) * IVA_RATE;
    const totalPagar = subtotalNeto + totalImpuesto;

    return {
        html: itemsHtml,
        totals: {
            subtotal: subtotalGeneral,
            descuento: descuentoTotal,
            importeExonerado: importeExonerado,
            importeExento: importeExento,
            impuesto: IVA_RATE, // Tasa de Impuesto
            totalImpuesto: totalImpuesto,
            totalPagar: totalPagar
        }
    };
};

// --- Manejador Principal ---

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        // Extraemos quoteOrderDetails del body principal
        const { quoteData, client, car, quoteOrderDetails } = body;

        if (!quoteData || !client || !car || !quoteData.items) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faltan datos esenciales para generar la cotización (quoteData, client, car, items).',
            });
        }

        // ASIGNAMOS el objeto extraído a la variable `orden`
        const orden = quoteOrderDetails || {};

        const { html: itemsTableHtml, totals } = generateQuotationItemsHtml(quoteData.items);

        const baseTemplatePath = join(process.cwd(), 'server', 'templates');
        const templatePath = join(baseTemplatePath, 'quotation.html');
        const htmlTemplate = readFileSync(templatePath.replace(/^\//, ''), 'utf-8');
        let filledHtml = htmlTemplate;

        // --- INYECCIÓN DE DATOS ---

        // Rellenar datos de la cotización y totales
        filledHtml = filledHtml.replace(/{{quotationId}}/g, quoteData.id ?? 'N/A');
        filledHtml = filledHtml.replace(/{{itemsTable}}/g, itemsTableHtml);

        // REEMPLAZO DE TOTALES
        filledHtml = filledHtml.replace(/{{subtotalGeneral}}/g, formatCurrency(totals.subtotal));
        filledHtml = filledHtml.replace(/{{descuentoTotal}}/g, formatCurrency(totals.descuento));
        filledHtml = filledHtml.replace(/{{importeExonerado}}/g, formatCurrency(totals.importeExonerado));
        filledHtml = filledHtml.replace(/{{importeExento}}/g, formatCurrency(totals.importeExento));
        filledHtml = filledHtml.replace(/{{impuesto}}/g, `${(totals.impuesto * 100).toFixed(0)}%`);
        filledHtml = filledHtml.replace(/{{totalImpuesto}}/g, formatCurrency(totals.totalImpuesto));
        filledHtml = filledHtml.replace(/{{totalFinal}}/g, formatCurrency(totals.totalPagar));

        filledHtml = filledHtml.replace(/{{quoteComments}}/g, formatNotesForHtml(quoteData.comments) || 'N/A');

        // 🛑 FIX: Usamos orden.quoteAsesor, que contiene el nombre del técnico/asesor
        filledHtml = filledHtml.replace(/{{quoteTechnician}}/g, orden.quoteAsesor ?? 'N/A');

        // 🔑 DATOS DE LA ORDEN
        filledHtml = filledHtml.replace(/{{quoteAsesor}}/g, orden.quoteAsesor ?? 'N/A');
        filledHtml = filledHtml.replace(/{{quoteValidity}}/g, orden.quoteValidity ?? 'N/A');

        // ✅ Manejo de la fecha: La fecha ya viene formateada desde el store en `quoteCreationDate`
        filledHtml = filledHtml.replace(/{{quoteCreationDate}}/g, orden.quoteCreationDate ?? 'N/A');


        // Eliminamos estos que ya no se usan en el nuevo formato de totales
        filledHtml = filledHtml.replace(/{{totalManoDeObra}}/g, '');
        filledHtml = filledHtml.replace(/{{totalRepuestos}}/g, '');


        // Rellenar datos del cliente
        // ✅ FIX CLAVE: Buscamos en 'nombre' (Cliente Natural) o 'empresaNombre' (Cliente Jurídico)
        const clientDisplayName = client.nombre || client.empresaNombre || 'N/A';
        filledHtml = filledHtml.replace(/{{clientName}}/g, clientDisplayName);

        filledHtml = filledHtml.replace(/{{clientAddress}}/g, client.direccion ?? 'N/A');
        filledHtml = filledHtml.replace(/{{clientPhone}}/g, client.telefono ?? 'N/A');
        filledHtml = filledHtml.replace(/{{clientEmail}}/g, client.correo ?? 'N/A');
        filledHtml = filledHtml.replace(/{{clientRtn}}/g, client.rtn ?? 'N/A');


        // Rellenar datos del vehículo
        filledHtml = filledHtml.replace(/{{carBrand}}/g, car.marca ?? 'N/A');
        filledHtml = filledHtml.replace(/{{carModel}}/g, car.modelo ?? 'N/A');
        filledHtml = filledHtml.replace(/{{carYear}}/g, car.year?.toString() ?? 'N/A');
        filledHtml = filledHtml.replace(/{{carPlate}}/g, car.placa ?? 'N/A');
        filledHtml = filledHtml.replace(/{{carKilometraje}}/g, car.odometro?.toString() ?? car.kilometraje?.toString() ?? 'N/A');
        filledHtml = filledHtml.replace(/{{vinContent}}/g, car.vin ?? car.numeroChasis ?? 'N/A');

        // Fecha actual
        filledHtml = filledHtml.replace(/{{currentDate}}/g, new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }));

        // Generar PDF (código sin cambios)
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
        await page.setContent(filledHtml, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        });

        await browser.close();

        // Enviar el PDF
        event.node.res.setHeader('Content-Type', 'application/pdf');
        event.node.res.setHeader('Content-Disposition', `attachment; filename="cotizacion_${quoteData.id}.pdf"`);
        event.node.res.end(pdfBuffer);
    } catch (error) {
        console.error('Error generando la cotización PDF:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Hubo un problema al generar el documento PDF.',
        });
    }
});

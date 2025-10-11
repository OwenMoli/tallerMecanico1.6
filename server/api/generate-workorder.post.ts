// /server/api/generate-workorder.post.ts

import { defineEventHandler, readBody, createError } from 'h3';
import { join } from 'path';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';
import type { WorkOrder } from '~/types/workorder';

// --- Funciones de Utilidad ---
const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(value || 0);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-HN', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const generateItemsHtml = (items: any[]) => {
    if (!items || items.length === 0) return '<tr><td colspan="5" class="text-center">No hay ítems para esta orden de trabajo.</td></tr>';
    return items.map(item => `
        <tr>
            <td class="text-left">${item.codigo || 'N/A'}</td>
            <td class="text-left">${item.descripcion}</td>
            <td>${item.cantidad}</td>
            <td class="text-right">${formatCurrency((item.manoDeObra || 0) + (item.valorRepuesto || 0))}</td>
            <td class="text-right"><strong>${formatCurrency(((item.manoDeObra || 0) + (item.valorRepuesto || 0)) * (item.cantidad || 1))}</strong></td>
        </tr>
    `).join('');
};

// --- Manejador Principal ---
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { workOrder }: { workOrder: WorkOrder } = body;

        if (!workOrder) {
            throw createError({ statusCode: 400, statusMessage: 'Faltan datos de la Orden de Trabajo.' });
        }

        const itemsTableHtml = generateItemsHtml(workOrder.items);

        const templatePath = join(process.cwd(), 'server', 'templates', 'workorder.html');
        let filledHtml = readFileSync(templatePath, 'utf-8');

        // === INYECCIÓN DE DATOS ===
        filledHtml = filledHtml
            .replace(/{{workOrderId}}/g, workOrder.id.replace('OT-', ''))
            .replace(/{{quotationId}}/g, workOrder.quotationId)
            .replace(/{{creationDate}}/g, formatDate(workOrder.creationDate))
            .replace(/{{status}}/g, workOrder.status)
            .replace(/{{assignedMechanic}}/g, workOrder.assignedMechanic || 'Por asignar')
            .replace(/{{clientName}}/g, workOrder.client.name)
            .replace(/{{clientPhone}}/g, workOrder.client.phone)
            .replace(/{{clientRtn}}/g, workOrder.client.rtn || 'N/A')
            .replace(/{{clientEmail}}/g, workOrder.client.email || 'N/A')

            // ✅ CORRECCIÓN: Usar placeholders separados
            .replace(/{{carBrand}}/g, workOrder.vehicle.brand || 'N/A')
            .replace(/{{carModel}}/g, workOrder.vehicle.model || 'N/A')

            .replace(/{{carPlate}}/g, workOrder.plate)
            .replace(/{{carYear}}/g, workOrder.vehicle.year?.toString() || 'N/A')
            .replace(/{{carKilometraje}}/g, workOrder.vehicle.kilometraje?.toString() || 'N/A')
            .replace(/{{carVin}}/g, workOrder.vehicle.vin || 'N/A')
            .replace(/{{itemsTable}}/g, itemsTableHtml)
            .replace(/{{notes}}/g, workOrder.notes?.replace(/\n/g, '<br>') || 'Sin notas adicionales.')
            .replace(/{{totalPagar}}/g, formatCurrency(workOrder.total))
            .replace(/{{estimatedStartDate}}/g, 'A definir')
            .replace(/{{estimatedEndDate}}/g, 'A definir')
            .replace(/{{currentDate}}/g, formatDateTime(new Date()));

        // Generar PDF
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(filledHtml, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        });
        await browser.close();

        // Enviar PDF
        event.node.res.setHeader('Content-Type', 'application/pdf');
        event.node.res.setHeader('Content-Disposition', `inline; filename="orden_trabajo_${workOrder.id}.pdf"`);
        event.node.res.end(pdfBuffer);

    } catch (error: any) {
        console.error('Error generando el PDF de la Orden de Trabajo:', error);
        throw createError({ statusCode: 500, statusMessage: `Error interno: ${error.message || 'Desconocido'}` });
    }
});

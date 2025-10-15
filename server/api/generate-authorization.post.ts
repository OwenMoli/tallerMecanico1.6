// server/api/generate-authorization.post.ts

import { defineEventHandler, readBody, createError } from 'h3';
import { join } from 'path';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';

// Formatea las notas para HTML
const formatNotesForHtml = (text: string | null | undefined): string => {
    if (!text || text.trim() === '') {
        return '';
    }
    return text.replace(/\n/g, '<br>');
};

// Genera el HTML para los items del checklist con casillas de verificación
const generateChecklistHtml = (checklist: any[]): string => {
    if (!checklist || !Array.isArray(checklist) || checklist.length === 0) {
        return '<div style="grid-column: 1 / -1; text-align: center; padding: 10px;">No se realizaron chequeos para este vehículo.</div>';
    }

    let html = '';

    checklist.forEach(item => {
        const isOk = item.estado === 'ok' ? 'checked' : '';
        const isProblem = item.estado === 'problem' ? 'checked' : '';
        const isMissing = item.estado === 'missing' ? 'checked' : '';
        const isExclamation = item.estado === 'exclamation' ? 'checked' : '';

        html += `
            <div class="checklist-item-row">
                <span class="checklist-item-name">${item.nombre}</span>
                <div class="checklist-options">
                    <label class="checkbox-label">
                        <input type="checkbox" ${isOk}>
                        Bueno
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${isProblem}>
                        Malo
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${isMissing}>
                        Faltante
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${isExclamation}>
                        Por Diagnosticar
                    </label>
                </div>
            </div>
        `;
    });

    return html;
};

// Genera el HTML para las imágenes del vehículo con un layout de 2 por fila
const generateCarImagesHtml = (carImages: string[] | null | undefined): string => {
    if (!carImages || !Array.isArray(carImages) || carImages.length === 0) {
        return '<div style="text-align: center; padding: 10px;">No hay imágenes disponibles del vehículo.</div>';
    }

    let imagesHtml = '<div class="car-images-grid">';
    carImages.forEach(imageUrl => {
        imagesHtml += `<img src="${imageUrl}" alt="Imagen del vehículo" class="car-image-thumb"/>`;
    });
    imagesHtml += '</div>';
    return imagesHtml;
};

// 🎨 NUEVA FUNCIÓN: Genera el HTML para el mapa de daños (imagen pintada)
const generateCarPaintHtml = (base64Image: string | null | undefined): string => {
    if (!base64Image) {
        return '<div style="text-align: center; padding: 10px;">No hay daños marcados en el vehículo.</div>';
    }
    // La Base64 se inyecta directamente en el atributo src de la imagen
    return `<div style="text-align: center;"><img src="${base64Image}" alt="Mapa de daños" class="car-image-thumb" style="width: 450px; height: 250px; object-fit: contain;"/></div>`;
};

// NUEVA FUNCIÓN para generar el HTML del VIN
const generateVinHtml = (vin: string | null | undefined, vinImageUrl: string | null | undefined): string => {
    if (vinImageUrl) {
        return `<div class="vin-image-container"><img src="${vinImageUrl}" alt="Imagen del VIN" class="vin-image"/></div>`;
    }
    if (vin) {
        return `<strong>${vin}</strong>`;
    }
    return 'N/A';
};

export default defineEventHandler(async (event) => {
    try {
        const {
            client,
            car,
            checklist,
            customerNotes,
            serviceAdvisorNotes,
            carImages,
            vin,
            vinImageUrl,
        } = await readBody(event);

        const paintDiagramBase64 = car.paintDiagram;

        if (!client || !car) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faltan datos de cliente o vehículo.',
            });
        }

        const baseTemplatePath = join(process.cwd(), 'server', 'templates');
        const templatePath = join(baseTemplatePath, 'authorization.html');
        const htmlTemplate = readFileSync(templatePath.replace(/^\//, ''), 'utf-8');
        let filledHtml = htmlTemplate;

        // Rellenar datos del cliente
        filledHtml = filledHtml.replace(/{{clientName}}/g, client.nombre ?? 'N/A');
        filledHtml = filledHtml.replace(/{{clientAddress}}/g, client.direccion ?? 'N/A');
        filledHtml = filledHtml.replace(/{{clientPhone}}/g, client.telefono ?? 'N/A');
        filledHtml = filledHtml.replace(/{{clientEmail}}/g, client.email ?? 'N/A');

        // Rellenar datos del vehículo
        filledHtml = filledHtml.replace(/{{carBrand}}/g, car.marca ?? 'N/A');
        filledHtml = filledHtml.replace(/{{carModel}}/g, car.modelo ?? 'N/A');
        filledHtml = filledHtml.replace(/{{carYear}}/g, car.year?.toString() ?? 'N/A');

        const carColors = (car.colorPrimarioNombre ?? 'N/A') + (car.colorSecundarioNombre ? ` y ${car.colorSecundarioNombre}` : '');
        filledHtml = filledHtml.replace(/{{carColor}}/g, carColors);
        filledHtml = filledHtml.replace(/{{carPlate}}/g, car.placa ?? 'N/A');
        filledHtml = filledHtml.replace(/{{carKilometraje}}/g, car.kilometraje?.toString() ?? 'N/A');
        filledHtml = filledHtml.replace(/{{carFuel}}/g, `${car.porcentajeGasolina?.toString() ?? 'N/A'}`);

        // NUEVO: Rellenar el VIN
        const vinContentHtml = generateVinHtml(vin, vinImageUrl);
        filledHtml = filledHtml.replace(/{{vinContent}}/g, vinContentHtml);

        // Rellenar notas
        const customerNotesFormatted = formatNotesForHtml(customerNotes);
        const serviceAdvisorNotesFormatted = formatNotesForHtml(serviceAdvisorNotes);
        filledHtml = filledHtml.replace(/{{customerNotes}}/g, customerNotesFormatted);
        filledHtml = filledHtml.replace(/{{serviceAdvisorNotes}}/g, serviceAdvisorNotesFormatted);

        // Fecha actual
        filledHtml = filledHtml.replace(/{{currentDate}}/g, new Date().toLocaleDateString('es-ES'));

        // Checklist
        const checklistHtml = generateChecklistHtml(checklist);
        filledHtml = filledHtml.replace(/{{checklistItems}}/g, checklistHtml);

        // Imágenes
        const carImagesHtml = generateCarImagesHtml(carImages);
        filledHtml = filledHtml.replace(/{{carImages}}/g, carImagesHtml);

        // 🎨 NUEVO: Rellenar la imagen pintada (mapa de daños)
        const carPaintHtml = generateCarPaintHtml(paintDiagramBase64); 
        filledHtml = filledHtml.replace(/{{carImagePaint}}/g, carPaintHtml); // <--- ¡AÑADE ESTO!



        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(filledHtml, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        event.node.res.setHeader('Content-Type', 'application/pdf');
        event.node.res.setHeader('Content-Disposition', 'attachment; filename="orden_de_servicio.pdf"');
        event.node.res.end(pdfBuffer);
    } catch (error) {
        console.error('Error generando el documento:', error);
        return {
            error: 'Hubo un problema al generar el documento. Por favor, intente de nuevo.',
        };
    }
});

import { defineStore } from 'pinia';

// --- ESTRUCTURA DE DATOS INICIALES (SIMULACIÓN) ---
// (Misma estructura que proporcionaste, necesaria para la DataGrid)
const initialProducts = [
    {
        id: '1a2b3c',
        esServicio: false,
        condicion: 'Nuevo',
        duracionServicio: null,
        generalidades: {
            codigo: 'PROD-10001',
            codigoBarra: '1234567890',
            nombre: 'Laptop Empresarial X1',
            descripcion: 'Potente laptop para profesionales.',
            referencia: 'Modelo X1 Gen 9',
            tipoProducto: 'Producto',
        },
        precios: {
            aplicaImpuesto: true,
            editarPrecio: true,
            impuesto: 'ISV 15%',
            costo1: 850.00,
            precio1: 1043.48, // Precio Neto
            porcentajeUtilidad1: 22.76,
            precioConImpuesto1: 1200.00, // Precio con Impuesto
            precioVentaNeto: 1043.48,
            precio2: 900.00, // Añadido para completar la data
            porcentajeUtilidad2: 5, // Añadido para completar la data
            precio3: 850.00, // Añadido para completar la data
            porcentajeUtilidad3: 0, // Añadido para completar la data
            precio4: 800.00, // Añadido para completar la data
            porcentajeUtilidad4: -5, // Añadido para completar la data
        },
        compatibilidades: [],
        stock: { existenciasIniciales: 15 },
        inventario: { almacenId: 1, binId: 101 },
        notas: 'Notas internas.',
        imagen: null,
    },
    {
        id: '4d5e6f',
        esServicio: true,
        condicion: 'Usado',
        duracionServicio: 2.0,
        generalidades: {
            codigo: 'SERV-4000',
            codigoBarra: null,
            nombre: 'Mantenimiento Preventivo',
            descripcion: 'Revisión y ajustes mayores.',
            referencia: 'Servicio Tipo A',
            tipoProducto: 'Servicio',
        },
        precios: {
            aplicaImpuesto: true,
            editarPrecio: true,
            impuesto: 'ISV 15%',
            costo1: 500.00,
            precio1: 750.00, // Precio Neto
            porcentajeUtilidad1: 50.00,
            precioConImpuesto1: 862.50, // Precio con Impuesto
            precioVentaNeto: 750.00,
            precio2: 700.00,
            porcentajeUtilidad2: 40.00,
            precio3: 650.00,
            porcentajeUtilidad3: 30.00,
            precio4: 600.00,
            porcentajeUtilidad4: 20.00,
        },
        compatibilidades: [],
        stock: { existenciasIniciales: 0 },
        inventario: { almacenId: 1, binId: 101 },
        notas: 'Tiempo estimado de 2 horas.',
        imagen: null,
    }
];
// -------------------------------------------------------------------------


export const useProductStore = defineStore('product', {
    state: () => ({
        products: initialProducts,
    }),

    getters: {
        allProducts: (state) => state.products,
    },

    actions: {
        // 🔑 CLAVE AÑADIDA: Esta acción es la que faltaba.
        async loadAllProducts() {
            // En un entorno real, aquí harías tu llamada 'fetch' o 'axios' a la API.
            // Dado que ya tienes la data en el state, solo confirmamos la carga.
            console.log("🏪 Pinia Action: loadAllProducts ejecutado. Data ya disponible en state.");
            // Si la data viniera de una API:
            // const apiProducts = await fetch('/api/products').then(res => res.json());
            // this.products = apiProducts;
            return this.products;
        },

        async saveOrUpdateProduct(productData, isEditing) {
            console.log("🏪 Pinia Action: Iniciando guardado/actualización del producto.");
            await new Promise(resolve => setTimeout(resolve, 500));

            const savedProduct = JSON.parse(JSON.stringify(productData));

            if (isEditing) {
                console.log(`✅ Producto/Servicio ID ${savedProduct.id} actualizado.`);
                this.updateProductInList(savedProduct);
            } else {
                savedProduct.id = Math.random().toString(36).substring(2, 9);
                console.log(`✅ Producto/Servicio nuevo ID ${savedProduct.id} creado.`);
                this.addProductToList(savedProduct);
            }
            return savedProduct;
        },

        addProductToList(product) {
            this.products.push(product);
        },

        updateProductInList(updatedProduct) {
            const index = this.products.findIndex(p => p.id === updatedProduct.id);
            if (index !== -1) {
                this.products[index] = updatedProduct;
            }
        },
    },
});

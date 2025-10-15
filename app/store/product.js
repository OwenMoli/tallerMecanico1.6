import { defineStore } from 'pinia';


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
            precio1: 1043.48, 
            porcentajeUtilidad1: 22.76,
            precioConImpuesto1: 1200.00, 
            precioVentaNeto: 1043.48,
            precio2: 900.00, 
            porcentajeUtilidad2: 5, 
            precio3: 850.00, 
            porcentajeUtilidad3: 0, 
            precio4: 800.00, 
            porcentajeUtilidad4: -5, 
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
            precio1: 750.00, 
            porcentajeUtilidad1: 50.00,
            precioConImpuesto1: 862.50, 
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



export const useProductStore = defineStore('product', {
    state: () => ({
        products: initialProducts,
    }),

    getters: {
        allProducts: (state) => state.products,
    },

    actions: {
       
        async loadAllProducts() {

            console.log("🏪 Pinia Action: loadAllProducts ejecutado. Data ya disponible en state.");

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

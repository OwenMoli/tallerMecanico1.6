import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const dummyProducts = [
    {
        id: 'prod_001',
        esServicio: false,
        condicion: 'Nuevo',
        duracionServicio: null,
        tipoInventario: 'Producto',
        generalidades: {
            codigo: 'FA-TY-01',
            descripcion: 'Filtro de Aceite para Motor 1.8L',
            nombre: 'Filtro de Aceite para Motor 1.8L',
            codigoBarra: '789123456',
            referencia: 'OEM-12345',
            tipoProducto: 'Producto',
        },
        compatibilidades: [
            { id: 1, marca: 'Toyota', modelo: 'Corolla', anio: 2020, descripcion: 'Motor 1.8L' },
            { id: 2, marca: 'Toyota', modelo: 'Corolla', anio: 2021, descripcion: 'Motor 1.8L' },
            { id: 3, marca: 'Toyota', modelo: 'RAV4', anio: 2019, descripcion: 'Motor 2.0L' },
        ],
        precios: { aplicaImpuesto: true, editarPrecio: true, impuesto: 'ISV 15%', costo1: 150, precio1: 220, porcentajeUtilidad1: 46.67, precioConImpuesto1: 253, costo2: 0, precio2: 210, porcentajeUtilidad2: 0, costo3: 0, precio3: 200, porcentajeUtilidad3: 0, costo4: 0, precio4: 0, porcentajeUtilidad4: 0, precioVentaNeto: 220, precioVentaConImpuesto: 253 },
        stock: { existenciasIniciales: 50 },
        inventario: { almacenId: 1, binId: 101 },
        notas: '',
        imagen: null,
    },
    {
        id: 'prod_002',
        esServicio: false,
        condicion: 'Nuevo',
        duracionServicio: null,
        tipoInventario: 'Producto',
        generalidades: {
            codigo: 'PF-HN-01',
            descripcion: 'Pastillas de Freno Delanteras Cerámicas',
            nombre: 'Pastillas de Freno Delanteras Cerámicas',
            codigoBarra: '789654321',
            referencia: 'OEM-67890',
            tipoProducto: 'Producto',
        },
        compatibilidades: [
            { id: 4, marca: 'Honda', modelo: 'Civic', anio: 2022, descripcion: 'Todas las versiones' },
            { id: 5, marca: 'Honda', modelo: 'CR-V', anio: 2021, descripcion: '' },
        ],
        precios: { aplicaImpuesto: true, editarPrecio: true, impuesto: 'ISV 15%', costo1: 800, precio1: 1200, porcentajeUtilidad1: 50, precioConImpuesto1: 1380, costo2: 0, precio2: 0, porcentajeUtilidad2: 0, costo3: 0, precio3: 0, porcentajeUtilidad3: 0, costo4: 0, precio4: 0, porcentajeUtilidad4: 0, precioVentaNeto: 1200, precioVentaConImpuesto: 1380 },
        stock: { existenciasIniciales: 30 },
        inventario: { almacenId: 2, binId: 201 },
        notas: 'Revisar compatibilidad con modelos Si.',
        imagen: null,
    },
    {
        id: 'serv_001',
        esServicio: true,
        condicion: 'Nuevo',
        duracionServicio: 2.5,
        tipoInventario: 'Servicio',
        generalidades: {
            codigo: 'SERV-01',
            descripcion: 'Servicio de Mantenimiento Básico',
            nombre: 'Servicio de Mantenimiento Básico',
            codigoBarra: '',
            referencia: '',
            tipoProducto: 'Servicio',
        },
        compatibilidades: [],
        precios: { aplicaImpuesto: true, editarPrecio: true, impuesto: 'ISV 15%', costo1: 500, precio1: 900, porcentajeUtilidad1: 80, precioConImpuesto1: 1035, costo2: 0, precio2: 0, porcentajeUtilidad2: 0, costo3: 0, precio3: 0, porcentajeUtilidad3: 0, costo4: 0, precio4: 0, porcentajeUtilidad4: 0, precioVentaNeto: 900, precioVentaConImpuesto: 1035 },
        stock: { existenciasIniciales: 0 },
        inventario: { almacenId: '', binId: '' },
        notas: 'Incluye cambio de aceite y revisión de 10 puntos.',
        imagen: null,
    }
];

export const useProductStore = defineStore('product', () => {

    const products = ref([]);
    const isLoading = ref(false);


    const allProducts = computed(() => products.value);

    async function fetchAllProducts() {
        console.log("🏪 Store: Obteniendo todos los productos...");
        isLoading.value = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            products.value = dummyProducts;
            console.log(`🏪 Store: Se cargaron ${products.value.length} productos.`);
        } catch (error) {
            console.error("🏪 Store: Error al obtener los productos:", error);
            products.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    async function saveOrUpdateProduct(productData, isEditing) {
        console.log("🏪 Store: Iniciando guardado/actualización...");
        await new Promise(resolve => setTimeout(resolve, 500));
        const savedProduct = JSON.parse(JSON.stringify(productData));
        if (isEditing) {
            const index = products.value.findIndex(p => p.id === savedProduct.id);
            if (index !== -1) {
                products.value[index] = savedProduct;
                console.log(`✅ Store: Producto ID ${savedProduct.id} actualizado.`);
            }
        } else {
            savedProduct.id = `prod_${Math.random().toString(36).substring(2, 9)}`;
            products.value.push(savedProduct);
            console.log(`✅ Store: Nuevo producto ID ${savedProduct.id} creado.`);
        }
        return savedProduct;
    }


    return {
        products,
        isLoading,
        fetchAllProducts,
        saveOrUpdateProduct,

        allProducts,
    };
});

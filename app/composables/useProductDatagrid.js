// composables/useProductDatagrid.js
import { ref, computed } from 'vue';
import { useDataGrid } from '~/composables/useDataGrid'; // Asegúrate de la ruta correcta a tu composable

// Simulación de los datos iniciales (con EsActivo requerido por useDataGrid)
const initialProducts = [
    { id: 101, codigo: 'COD-101', descripcion: 'Filtro de Aceite Sintético', condicion: 'Nuevo', precio_neto_principal: 15.50, existencias_iniciales: 150, esServicio: false, EsActivo: true },
    { id: 102, codigo: 'COD-102', descripcion: 'Diagnóstico de Motor (1 hr)', condicion: 'Nuevo', precio_neto_principal: 50.00, existencias_iniciales: 0, esServicio: true, EsActivo: true },
    { id: 103, codigo: 'COD-103', descripcion: 'Llanta Usada R16', condicion: 'Usado', precio_neto_principal: 25.00, existencias_iniciales: 10, esServicio: false, EsActivo: false },
];

export default function useProductDatagrid() {
    // Usamos tu composable reutilizable para gestionar la data y el filtrado
    const {
        data: products, // El array de datos completo (Ref)
        showAll,
        currentDataSource, // La fuente de datos filtrada/completa para el DataGrid
        softDeleteItem,
        activateItem
    } = useDataGrid(ref(initialProducts), 'id');

    // Estado del Modal
    const isModalOpen = ref(false);

    // Producto que se está editando o creando (para pasarlo al useProductForm)
    const currentProduct = ref(null);

    // Métodos de Control del Modal
    const openAddModal = () => {
        currentProduct.value = null; // Para crear un nuevo registro
        isModalOpen.value = true;
    };

    const openEditModal = (productData) => {
        // Clonamos los datos para no modificar el registro original directamente
        currentProduct.value = JSON.parse(JSON.stringify(productData));
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        currentProduct.value = null;
    };

    // Método para manejar el guardado del formulario
    const handleSave = (savedData) => {
        if (!savedData) return;

        // Mapear los campos del formulario (del useProductForm) a la estructura del Datagrid
        const datagridItem = {
            id: savedData.id,
            codigo: savedData.generalidades.codigo,
            descripcion: savedData.generalidades.descripcion,
            // Precio principal y existencias requeridos en la tabla base:
            precio_neto_principal: parseFloat(savedData.precios.precio1),
            existencias_iniciales: savedData.stock.existenciasIniciales,
            esServicio: savedData.esServicio,
            EsActivo: true,
        };

        if (currentProduct.value) {
             // EDICIÓN: Actualizamos el array base
             const index = products.value.findIndex(p => p.id === datagridItem.id);
             if (index !== -1) {
                 products.value[index] = datagridItem;
             }
        } else {
            // NUEVO: Agregamos con un nuevo ID simulado
            const newId = Math.max(...products.value.map(p => p.id)) + 1;
            products.value.push({ ...datagridItem, id: newId });
        }

        closeModal();
    };

    return {
        products,
        isModalOpen,
        currentProduct,
        showAll,
        currentDataSource,
        openAddModal,
        openEditModal,
        closeModal,
        handleSave,
        softDeleteItem,
        activateItem
    };
}

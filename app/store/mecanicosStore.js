import { defineStore } from 'pinia';
import { initialMecanicosData } from '../data/mecanicosData'; // Ajusta la ruta si es necesario

export const useMecanicosStore = defineStore('mecanicos', {
  state: () => ({
    // El estado inicial se carga desde el archivo de datos estáticos
    categoriasMecanicos: initialMecanicosData,
  }),

  getters: {
    // Un getter simple para obtener el estado (reactivo) de los mecánicos
    getMecanicosData: (state) => state.categoriasMecanicos,

    // Getter para obtener una lista plana de todos los nombres de mecánicos
    allMecanicoNames: (state) => {
      return state.categoriasMecanicos.flatMap(categoria => 
        categoria.mecanicos.map(mecanico => mecanico.nombre)
      );
    },

  },

  actions: {

  }
});
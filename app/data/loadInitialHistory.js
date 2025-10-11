// ~/data/initialHistory.js

/**
 * Los datos iniciales que simulan los movimientos en el historial
 */
export const initialHistory = [
  {
    id: 1,
    usuario: "Martin Salazar",
    rol: "Mecanico - A",
    evento: "Petición Pausar Orden",
    comentario: "Los Escaners están dañados",
    orden: "R001",
    estado: "Diagnostico",
    pausado: false,
    fecha: "2025-09-18 13:08",
  },
  {
    id: 2,
    usuario: "Orlando Mendez",
    rol: "Jefe Mecanico",
    evento: "Orden Pausada",
    comentario: "Los Escaners están dañados",
    orden: "R001",
    estado: "Diagnostico",
    pausado: true,
    fecha: "2025-09-18 13:15",
  },
  {
    id: 3,
    usuario: "Orlando Mendez",
    rol: "Jefe Mecanico",
    evento: "Notificación a Martin Salazar +A",
    comentario: "Pasar a oficina por los nuevos escaners",
    orden: "R001",
    estado: "Diagnostico",
    pausado: true,
    fecha: "2025-09-18 16:25",
  },
  {
    id: 4,
    usuario: "Martin Salazar",
    rol: "Mecanico - A",
    evento: "Petición Reanudar Orden",
    comentario: "Scanner recogidos habilitarme la orden porfavor",
    orden: "R001",
    estado: "Diagnostico",
    pausado: true,
    fecha: "2025-09-18 13:08",
  },
  {
    id: 5,
    usuario: "Orlando Mendez",
    rol: "Jefe Mecanico",
    evento: "Orden Reanudada",
    comentario: "",
    orden: "R001",
    estado: "Diagnostico",
    pausado: false,
    fecha: "2025-09-18 13:15",
  },
  // Puedes añadir datos de otra orden para probar el filtrado:
  {
    id: 6,
    usuario: "Orlando Mendez",
    rol: "Jefe Mecanico",
    evento: "Orden de Prueba Iniciada",
    comentario: "Inicio del diagnóstico.",
    orden: "R002",
    estado: "Diagnostico",
    pausado: false,
    fecha: "2025-10-01 10:00",
  },
];
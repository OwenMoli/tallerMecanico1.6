export const initialOrders = [
  {
        // ➡️ CAMPOS DE IDENTIFICACIÓN Y ESTADO
        id: 'R051',
        recepcion: 'Normal',
        cliente: 'Luis Mendoza',
        placa: 'JKL-654',
        coche: 'Mazda 3',
        marca: 'Mazda',
        modelo: '3',
        anio: 2019,
        fecha: '2025-09-10T10:30:00', // Fecha de recepción
        mecanicoAsignadoFecha: '2025-09-10T11:00:00',
        mecanico: 'Luis P.',
        status: 'En Espera', // Estado actual de la orden

        // ⚙️ GESTIÓN DE TIEMPOS GLOBAL (Para tu useOrderTimer)
        inicio: null,      // Cronómetro global detenido (null si no está en Taller/Diagnóstico)
        contador: 0,       // Contador de segundos en tiempo real (para la interfaz)
        acumulado: 0,      // Tiempo total de trabajo ya completado (segundos)

        // ✅ GESTIÓN DE TIEMPOS POR FASE (Propuesta de Trazabilidad)
        tiemposPorFase: { // 💡 Acumulador total de tiempo (en segundos) que la orden ha pasado en cada fase.
            'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, 
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: null, // 💡 Timestamp (ms) de inicio de la fase actual. Es null si la fase es de pausa.
        currentStageKey: 'En Espera', // 💡 El nombre de la clave en 'tiemposPorFase' que coincide con 'status'.

        // 📋 OTROS DETALLES
        checklist: ['Revisión general', 'Prueba de manejo'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Cliente dejó llaves en la recepción.',
        comentarioJefe: 'Cliente dejó llaves en la recepción.',
        priority: 'Normal',
    },
  {
    id: 'R040',
    recepcion:'Normal',
    cliente: 'Luis Mendoza',
    placa: 'JKL-654',
    coche: 'Mazda 3',
    marca: 'Mazda',
    modelo: '3',
    anio: 2019,
    fecha: '2025-09-10T10:30:00', // Formato String para Pinia
    mecanicoAsignadoFecha: '2025-09-10T11:00:00',
    mecanico: 'Luis P.',
    status: 'Denegado',
    
    inicio: null, // Añadido/corregido
    contador: 0, // Añadido/corregido
    acumulado: 0, // Añadido/corregido

    tiemposPorFase: {
      'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, // 'En Proceso' cambiado a 'Taller'
      'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
    },
    currentStageStartTime: null, // Añadido
    currentStageKey: 'Denegado', // Añadido (igual a status)

    checklist: ['Revisión general', 'Prueba de manejo'], // Movido/Corregido
    denegada: false, motivoDenegada: '',
    comentarioMecanico: 'Cliente dejó llaves en la recepción.',
    comentarioJefe: 'Cliente dejó llaves en la recepción.',
    priority: 'Normal',
  },
  {
    id: 'R004',
    recepcion:'Rapida',
    cliente: 'Ana Torres',
    placa: 'GHI-321',
    coche: 'Nissan Sentra',
    marca: 'Nissan',
    modelo: 'Sentra',
    anio: 2021,
    fecha: '2025-09-10T10:00:00',
    mecanicoAsignadoFecha: '2025-09-10T11:00:00',
    mecanico: 'Ana T.',
    status: 'Denegado',

    inicio: null, // Añadido/corregido
    contador: 0, // Añadido/corregido
    acumulado: 0, // Añadido/corregido

    tiemposPorFase: {
      'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, // 'En Proceso' cambiado a 'Taller'
      'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
    },
    currentStageStartTime: null, // Añadido
    currentStageKey: 'Denegado', // Añadido (igual a status)

    checklist: ['Inspección de suspensión', 'Amortiguadores', 'Alineación y balanceo'], // Movido/Corregido
    denegada: true, motivoDenegada: 'No se hizo el balanceo solicitado.',
    comentarioMecanico: 'Cliente dejó llaves en la recepción.',
    comentarioJefe: 'Cliente dejó llaves en la recepción.',
    priority: 'Normal',
  },
  {
    id: 'R002',
    recepcion:'Rapida',
    cliente: 'María Gómez',
    placa: 'XYZ-789',
    coche: 'Honda Civic',
    marca: 'Honda',
    modelo: 'Civic',
    anio: 2020,
    fecha: '2025-09-10T09:00:00',
    mecanicoAsignadoFecha: null, 
    mecanico: null,
    status: 'Pendiente',

    inicio: null, // Añadido/corregido
    contador: 0, // Añadido/corregido
    acumulado: 0, // Añadido/corregido

    tiemposPorFase: {
      'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, // 'En Proceso' cambiado a 'Taller', 'Diagnostico' a 'Diagnóstico'
      'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
    },
    currentStageStartTime: null, // Añadido
    currentStageKey: 'En Cola', // Añadido (Asumiendo que 'Pendiente' se relaciona con 'En Cola' o 'Diagnóstico')

    checklist: ['Cambio de aceite', 'Revisión de filtros', 'Inspección de frenos'], // Movido/Corregido
    denegada: false, motivoDenegada: '',
    comentarioMecanico: 'Cliente dejó llaves en la recepción.',
    comentarioJefe: 'Cliente dejó llaves en la recepción.',
    priority: 'PRIORITARIO',
  },
  {
    id: 'R005',
    recepcion:'Normal',
    cliente: 'Luis Mendoza',
    placa: 'JKL-654',
    coche: 'Mazda 3',
    marca: 'Mazda',
    modelo: '3',
    anio: 2019,
    fecha: '2025-09-10T10:30:00',
    mecanicoAsignadoFecha: '2025-09-10T11:00:00',
    mecanico: 'Luis P.',
    status: 'En Espera',
    
    inicio: null, // Añadido/corregido
    contador: 0, // Añadido/corregido
    acumulado: 0, // Añadido/corregido

    tiemposPorFase: {
      'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, // 'En Proceso' cambiado a 'Taller'
      'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
    },
    currentStageStartTime: null, // Añadido
    currentStageKey: 'En Espera', // Añadido (Asumiendo que 'En Espera' es la clave de fase)

    checklist: ['Revisión general', 'Prueba de manejo'], // Movido/Corregido
    denegada: false, motivoDenegada: '',
    comentarioMecanico: 'Cliente dejó llaves en la recepción.',
    comentarioJefe: 'Cliente dejó llaves en la recepción.',
    priority: 'Normal',
  },
  {
    id: 'R001',
    recepcion:'Rapida',
    cliente: 'Juan Martínez',
    placa: 'ABC-123',
    coche: 'Toyota Corolla',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2018,
    fecha: '2025-09-10T08:30:00',
    mecanicoAsignadoFecha: '2025-09-10T11:00:00',
    mecanico: 'Luis P.',
    status: 'En Espera',

    inicio: null, // Añadido/corregido
    contador: 0, // Añadido/corregido
    acumulado: 0, // Añadido/corregido

    tiemposPorFase: {
      'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, // 'En Proceso' cambiado a 'Taller'
      'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
    },
    currentStageStartTime: null, // Añadido
    currentStageKey: 'En Espera', // Añadido (Asumiendo que 'En Espera' es la clave de fase)

    checklist: ['Revisión de motor', 'Nivel de fluidos', 'Estado de frenos', 'Inspección de luces'], // Movido/Corregido
    denegada: false, motivoDenegada: '',
    comentarioMecanico: 'Cliente dejó llaves en la recepción.',
    comentarioJefe: 'Cliente dejó llaves en la recepción.',
    priority: 'URGENTE',
  },
  {
    id: 'R025',
    recepcion:'Rapida',
    cliente: 'Luis Mendoza',
    placa: 'JKL-654',
    coche: 'Mazda 3',
    marca: 'Mazda',
    modelo: '3',
    anio: 2019,
    fecha: '2025-09-10T10:30:00',
    mecanicoAsignadoFecha: '2025-09-10T11:00:00',
    mecanico: 'Luis P.',
    status: 'En Espera',

    inicio: null, // Añadido/corregido
    contador: 0, // Añadido/corregido
    acumulado: 0, // Añadido/corregido

    tiemposPorFase: {
      'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, // 'En Proceso' cambiado a 'Taller'
      'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
    },
    currentStageStartTime: null, // Añadido
    currentStageKey: 'En Espera', // Añadido (Asumiendo que 'En Espera' es la clave de fase)

    checklist: ['Revisión general', 'Prueba de manejo'], // Movido/Corregido
    denegada: false, motivoDenegada: '',
    comentarioMecanico: 'Cliente dejó llaves en la recepción.',
    comentarioJefe: 'Cliente dejó llaves en la recepción.',
    priority: 'Normal',
  },
  {
    id: 'PD01',
    recepcion:'Rapida',
    cliente: 'Luis Mendoza',
    placa: 'JKL-999',
    coche: 'Mazda 3',
    marca: 'Mazda',
    modelo: '3',
    anio: 2018,
    fecha: '2025-09-04T15:00:00',
    mecanicoAsignadoFecha: '2025-09-10T11:00:00',
    mecanico: 'Ana T.',
    status: 'Completado',

    inicio: null, // Añadido/corregido
    contador: 0, // Añadido/corregido
    acumulado: 0, // Añadido/corregido

    tiemposPorFase: {
      'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, // 'En Proceso' cambiado a 'Taller'
      'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
    },
    currentStageStartTime: null, // Añadido
    currentStageKey: 'Completado', // Añadido (igual a status)

    checklist: ['Revisión de motor y transmisión'], // Movido/Corregido
    denegada: false, motivoDenegada: '',
    comentarioMecanico: 'Cliente dejó llaves en la recepción.',
    comentarioJefe: 'Cliente dejó llaves en la recepción.',
    priority: 'URGENTE',
  },
  {
    id: 'PD65',
    recepcion:'Rapida',
    cliente: 'Luis Mendoza',
    placa: 'JKL-999',
    coche: 'Mazda 3',
    marca: 'Mazda',
    modelo: '3',
    anio: 2018,
    fecha: '2025-09-04T15:00:00',
    mecanicoAsignadoFecha: '2025-09-10T11:00:00',
    mecanico: 'Ana T.',
    status: 'Cotizando',

    inicio: null, // Añadido/corregido
    contador: 0, // Añadido/corregido
    acumulado: 0, // Añadido/corregido

    tiemposPorFase: {
      'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, // 'En Proceso' cambiado a 'Taller'
      'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
    },
    currentStageStartTime: null, // Añadido
    currentStageKey: 'Cotizando', // Añadido (igual a status)

    checklist: ['Revisión de motor y transmisión'], // Movido/Corregido
    denegada: false, motivoDenegada: '',
    comentarioMecanico: 'Cliente dejó llaves en la recepción.',
    comentarioJefe: 'Cliente dejó llaves en la recepción.',
    priority: 'URGENTE',
  },
  {
        id: 'R061',
        recepcion: 'Normal',
        cliente: 'Roberto Pérez',
        placa: 'LMN-789',
        coche: 'Ford Escape',
        marca: 'Ford',
        modelo: 'Escape',
        anio: 2022,
        fecha: '2025-10-06T08:45:00',
        mecanicoAsignadoFecha: '2025-10-06T09:15:00',
        mecanico: 'Luis P.', 
        status: 'Diagnóstico', 
        inicio: 1678886400000, // Simula cronómetro iniciado (timestamp)
        contador: 3600, // 1 hora corriendo
        acumulado: 7200, // 2 horas acumuladas
        tiemposPorFase: {
            'En Cola': 600, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: 1678886400000, 
        currentStageKey: 'Diagnóstico',
        checklist: ['Revisar luces y fusibles', 'Escaneo de códigos'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Falla intermitente en sistema eléctrico.',
        comentarioJefe: 'Dar prioridad media.',
        priority: 'Normal',
    },
    // 2. Asignado a Categoría A (Ana T.) - Estado: Taller
    {
        id: 'R062',
        recepcion: 'Rapida',
        cliente: 'Claudia Soto',
        placa: 'OUE-101',
        coche: 'BMW X3',
        marca: 'BMW',
        modelo: 'X3',
        anio: 2023,
        fecha: '2025-10-06T09:00:00',
        mecanicoAsignadoFecha: '2025-10-06T09:30:00',
        mecanico: 'Ana T.', 
        status: 'Taller', 
        inicio: 1678888000000,
        contador: 1800, 
        acumulado: 10800, 
        tiemposPorFase: {
            'En Cola': 0, 'Diagnóstico': 3600, 'Taller': 0, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: 1678888000000,
        currentStageKey: 'Taller',
        checklist: ['Cambio de pastillas delanteras', 'Cambio de disco'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Se requiere rectificación de discos traseros.',
        comentarioJefe: 'Avisar a cliente sobre costo extra.',
        priority: 'URGENTE',
    },
    // 3. Asignado a Categoría B (Carlos Gomez) - Estado: Pausado
    {
        id: 'R063',
        recepcion: 'Normal',
        cliente: 'Javier Ramos',
        placa: 'PQR-222',
        coche: 'Audi A4',
        marca: 'Audi',
        modelo: 'A4',
        anio: 2017,
        fecha: '2025-10-07T10:00:00',
        mecanicoAsignadoFecha: '2025-10-07T10:30:00',
        mecanico: 'Carlos Gomez', 
        status: 'Pausado', 
        inicio: null, 
        contador: 0,
        acumulado: 5400, 
        tiemposPorFase: {
            'En Cola': 300, 'Diagnóstico': 3000, 'Taller': 2100, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: null, 
        currentStageKey: 'Pausado',
        checklist: ['Reemplazo de bomba de agua'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Se solicitó pieza original, llega en 48h.',
        comentarioJefe: 'Reportar a inventario.',
        priority: 'Normal',
    },
    // 4. Asignado a Categoría B (Ana Mendoza) - Estado: Pruebas
    {
        id: 'R064',
        recepcion: 'Rapida',
        cliente: 'Diana Castro',
        placa: 'TUV-333',
        coche: 'Kia Sportage',
        marca: 'Kia',
        modelo: 'Sportage',
        anio: 2020,
        fecha: '2025-10-07T11:30:00',
        mecanicoAsignadoFecha: '2025-10-07T12:00:00',
        mecanico: 'Ana Mendoza', 
        status: 'Pruebas', 
        inicio: 1678972800000, 
        contador: 600, 
        acumulado: 9000, 
        tiemposPorFase: {
            'En Cola': 600, 'Diagnóstico': 3600, 'Taller': 4800, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: 1678972800000,
        currentStageKey: 'Pruebas',
        checklist: ['Prueba de manejo post-reparación', 'Chequeo de fugas'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Se reemplazó la junta de culata. Motor suena estable.',
        comentarioJefe: 'Listo para facturar.',
        priority: 'PRIORITARIO',
    },
    // 5. Asignado a Categoría C (Pedro Garcia) - Estado: Rechazado
    {
        id: 'R065',
        recepcion: 'Normal',
        cliente: 'Emilio Flores',
        placa: 'WXY-444',
        coche: 'Hyundai Accent',
        marca: 'Hyundai',
        modelo: 'Accent',
        anio: 2015,
        fecha: '2025-10-08T08:00:00',
        mecanicoAsignadoFecha: '2025-10-08T08:30:00',
        mecanico: 'Pedro Garcia', 
        status: 'Rechazado', 
        inicio: null,
        contador: 0,
        acumulado: 1800, 
        tiemposPorFase: {
            'En Cola': 300, 'Diagnóstico': 1500, 'Taller': 0, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: null,
        currentStageKey: 'Rechazado',
        checklist: ['Inspección de tren delantero'],
        denegada: false, motivoDenegada: 'Presupuesto de reparación muy alto.',
        comentarioMecanico: 'El cliente no aceptó el presupuesto por los repuestos.',
        comentarioJefe: 'Cobrar solo el diagnóstico.',
        priority: 'Normal',
    },
    // 6. Sin Asignar - Estado: Pendiente
    {
        id: 'R066',
        recepcion: 'Normal',
        cliente: 'Fernanda G.',
        placa: 'ZAB-555',
        coche: 'Chevrolet Spark',
        marca: 'Chevrolet',
        modelo: 'Spark',
        anio: 2016,
        fecha: '2025-10-08T09:15:00',
        mecanicoAsignadoFecha: null,
        mecanico: null, 
        status: 'Pendiente', 
        inicio: null,
        contador: 0,
        acumulado: 0,
        tiemposPorFase: {
            'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: null,
        currentStageKey: 'En Cola', 
        checklist: ['Cambio de aceite y filtro'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Cliente espera en la sala.',
        comentarioJefe: 'Asignar al primer mecánico disponible.',
        priority: 'Normal',
    },
    // 7. Asignado a Categoría A (Luis P.) - Estado: Completado
    {
        id: 'PD03',
        recepcion: 'Rapida',
        cliente: 'Gustavo H.',
        placa: 'CDE-666',
        coche: 'Mercedes-Benz C300',
        marca: 'Mercedes-Benz',
        modelo: 'C300',
        anio: 2019,
        fecha: '2025-09-20T14:00:00',
        mecanicoAsignadoFecha: '2025-09-20T14:30:00',
        mecanico: 'Luis P.', 
        status: 'Completado', 
        inicio: null,
        contador: 0,
        acumulado: 14400, 
        tiemposPorFase: {
            'En Cola': 600, 'Diagnóstico': 3600, 'Taller': 9000, 'Pruebas': 1200,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: null,
        currentStageKey: 'Completado',
        checklist: ['Reemplazo de batería', 'Chequeo de alternador'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Cliente satisfecho. Se entregó el vehículo a las 18:00.',
        comentarioJefe: 'Factura cerrada.',
        priority: 'Normal',
    },
    // 8. Asignado a Categoría C (Sofia Torres) - Estado: Cotizando
    {
        id: 'R068',
        recepcion: 'Normal',
        cliente: 'Iván Ibarra',
        placa: 'FGH-777',
        coche: 'Volkswagen Jetta',
        marca: 'Volkswagen',
        modelo: 'Jetta',
        anio: 2021,
        fecha: '2025-10-09T09:45:00',
        mecanicoAsignadoFecha: '2025-10-09T10:15:00',
        mecanico: 'Sofia Torres', 
        status: 'Cotizando', 
        inicio: null,
        contador: 0,
        acumulado: 3600, 
        tiemposPorFase: {
            'En Cola': 900, 'Diagnóstico': 2700, 'Taller': 0, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: null,
        currentStageKey: 'Cotizando',
        checklist: ['Revisión de frenos traseros', 'Cotización de calipers'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Se envió cotización al cliente vía WhatsApp.',
        comentarioJefe: 'Hacer seguimiento en 2 horas.',
        priority: 'Normal',
    },
    // 9. Asignado a Categoría B (Carlos Gomez) - Estado: Denegado
    {
        id: 'R069',
        recepcion: 'Rapida',
        cliente: 'Laura J.',
        placa: 'HIJ-888',
        coche: 'Toyota Rav4',
        marca: 'Toyota',
        modelo: 'Rav4',
        anio: 2023,
        fecha: '2025-10-09T11:00:00',
        mecanicoAsignadoFecha: '2025-10-09T11:30:00',
        mecanico: 'Carlos Gomez', 
        status: 'Denegado', 
        inicio: null,
        contador: 0,
        acumulado: 1200,
        tiemposPorFase: {
            'En Cola': 300, 'Diagnóstico': 900, 'Taller': 0, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: null,
        currentStageKey: 'Denegado',
        checklist: ['Inspección de daños por colisión'],
        denegada: true, motivoDenegada: 'El trabajo es de pintura/carrocería, no manejamos eso.',
        comentarioMecanico: 'Daño mayor en carrocería, se refirió al taller asociado.',
        comentarioJefe: 'Actualizar status a Denegado (Taller).',
        priority: 'Normal',
    },
    // 10. Asignado a Categoría A (Ana T.) - Estado: En Espera (Asignado)
    {
        id: 'R070',
        recepcion: 'Normal',
        cliente: 'Marcos N.',
        placa: 'KLO-999',
        coche: 'Nissan Rogue',
        marca: 'Nissan',
        modelo: 'Rogue',
        anio: 2018,
        fecha: '2025-10-10T08:30:00',
        mecanicoAsignadoFecha: '2025-10-10T09:00:00',
        mecanico: 'Ana T.', 
        status: 'En Espera', 
        inicio: null,
        contador: 0,
        acumulado: 0,
        tiemposPorFase: {
            'En Cola': 1800, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0,
            'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0,
        },
        currentStageStartTime: null,
        currentStageKey: 'En Espera',
        checklist: ['Revisión general de 50.000km'],
        denegada: false, motivoDenegada: '',
        comentarioMecanico: 'Esperando que elevador #3 esté libre.',
        comentarioJefe: 'Pasa a Taller cuando el elevador esté libre.',
        priority: 'Normal',
    },
];
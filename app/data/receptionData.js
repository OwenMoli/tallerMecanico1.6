export const initialReception = [
  {
    id: 'R003',
    fechaIngreso: new Date('2024-10-15T08:45:00.000Z'), // Usando el tipo Date
    cliente: {
      id: 1,
      nombre: 'Arthur',
      apellido: 'Miller',
      telefono: '555-4321',
      correo: 'arthur.miller@ejemplo.com',
      direccion: 'Avenida Siempre Viva 742',
      rtn: '05011980123456'
    },
    vehiculo: {
      id_cliente: 1,
      placa: 'XYZ-123',
      modelo: 'Corolla',
      marca: 'Toyota',
      year: 2021,
      estilo: 'Turismo',
      transmision: 'Automática',
      traccion: 'Delantera (FWD)',
      combustible: 'Gasolina',
      colorPrimario: '#FFFFFF',
      colorSecundario: '#C0C0C0',
      colorPrimarioNombre: 'Blanco Polar',
      colorSecundarioNombre: 'Gris Plata',
      kilometraje: 55000,
      porcentajeGasolina: 75,
      porcentajeTemperatura: 50,
      porcentajeAceite: 90,
      numeroChasis: '1HFUD13E2L0000000',
      numeroMotor: '2TR-FE-12345',
      tipoAceite: 'Sintético 5W-30',
      marcaFiltroAceite: 'Mann-Filter',
      activoFlotilla: 'activo',
      aseguradora: {
        nombre: 'Seguros La Fe',
        contacto: 'Ana García',
        poliza: '123456789',
        nombreAsegurado: 'Arthur Miller',
        numeroAviso: 'A123-456'
      },
      imageUrl: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg',
      paintDiagram: null,
      vin: '1HFUD13E2L0000000'
    },
    checklist: [
      { id: 1, nombre: 'Luces frontales', estado: 'ok' },
      { id: 2, nombre: 'Nivel de refrigerante', estado: 'problem' },
      { id: 3, nombre: 'Estado de neumáticos', estado: 'ok' }
    ],



  },
];
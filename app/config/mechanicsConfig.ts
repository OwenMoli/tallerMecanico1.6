// src/config/mechanicsConfig.ts

export interface Mechanic {
  ID_Mecanico: number;
  Nombre: string;
  Apellido: string;
  Fotografia?: string;
  FechaNacimiento?: string;
  TelefonoContacto?: string;
  CorreoElectronico?: string;
  Direccion?: string;
  FechaIngreso?: string;
  Rol?: 'Aprendiz' | 'Mecánico General' | 'Mecánico Especialista' | 'Jefe de Taller';
  Especialidad?: string;
  NivelExperiencia?: 'Básico' | 'Intermedio' | 'Avanzado';
  EsActivo: boolean;
}

export const initialMechanicsData: Mechanic[] = [
  {
    ID_Mecanico: 1,
    Nombre: 'Juan',
    Apellido: 'Pérez',
    Fotografia: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
    FechaNacimiento: '1985-05-10',
    TelefonoContacto: '9988-1122',
    CorreoElectronico: 'juan.perez@taller.com',
    Direccion: 'Colonia Kennedy',
    FechaIngreso: '2010-03-15',
    Rol: 'Jefe de Taller',
    Especialidad: 'Motor',
    NivelExperiencia: 'Avanzado',
    EsActivo: true,
  },
  {
    ID_Mecanico: 2,
    Nombre: 'Ana',
    Apellido: 'García',
    Fotografia: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
    FechaNacimiento: '1992-11-20',
    TelefonoContacto: '8877-3344',
    CorreoElectronico: 'ana.garcia@taller.com',
    Direccion: 'Barrio La Granja',
    FechaIngreso: '2015-08-01',
    Rol: 'Mecánico Especialista',
    Especialidad: 'Frenos',
    NivelExperiencia: 'Avanzado',
    EsActivo: true,
  },
  {
    ID_Mecanico: 3,
    Nombre: 'Luis',
    Apellido: 'López',
    Fotografia: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
    FechaNacimiento: '1998-02-28',
    TelefonoContacto: '3344-5566',
    CorreoElectronico: 'luis.lopez@taller.com',
    Direccion: 'Zona Comercial',
    FechaIngreso: '2020-05-10',
    Rol: 'Mecánico General',
    Especialidad: 'Electricidad',
    NivelExperiencia: 'Intermedio',
    EsActivo: true,
  },
  {
    ID_Mecanico: 4,
    Nombre: 'Sofía',
    Apellido: 'Martínez',
    Fotografia: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
    FechaNacimiento: '2002-09-05',
    TelefonoContacto: '7766-9900',
    CorreoElectronico: 'sofia.martinez@taller.com',
    Direccion: 'Residencial El Roble',
    FechaIngreso: '2023-01-20',
    Rol: 'Aprendiz',
    Especialidad: 'Suspensión',
    NivelExperiencia: 'Básico',
    EsActivo: false,
  },
];

export const mechanicsColumns = [
  { dataField: 'ID_Mecanico', caption: 'ID', width: 60 },
  {
    caption: 'Mecánico',
    calculateCellValue: (data: Mechanic) => `${data.Nombre} ${data.Apellido}`,
    width: 200,
  },
  { dataField: 'Nombre', caption: 'Nombre', visible: false },
  { dataField: 'Apellido', caption: 'Apellido', visible: false },
  { dataField: 'TelefonoContacto', caption: 'Teléfono', width: 120 },
  { dataField: 'CorreoElectronico', caption: 'Email' },
  { dataField: 'Direccion', caption: 'Dirección' },
  { dataField: 'Rol', caption: 'Rol', width: 150 },
  { dataField: 'Especialidad', caption: 'Especialidad', width: 150 },
  { dataField: 'NivelExperiencia', caption: 'Nivel Exp.', width: 100 },
  { dataField: 'FechaIngreso', caption: 'Fecha de Ingreso', dataType: 'date' },
  {
    type: 'buttons',
    caption: 'Acciones',
    width: 150,
    buttons: [
      { hint: 'Ver Detalles', icon: 'search', visible: (e: any) => e.row.data.EsActivo, onClick: (e: any) => e.component.props.onViewClick(e.row.data) },
      { hint: 'Editar', icon: 'edit', visible: (e: any) => e.row.data.EsActivo, onClick: (e: any) => e.component.props.onEditClick(e.row.data) },
      { hint: 'Desactivar', icon: 'trash', visible: (e: any) => e.row.data.EsActivo, onClick: (e: any) => e.component.props.onDeleteClick(e.row.data) },
      { hint: 'Activar', icon: 'check', visible: (e: any) => !e.row.data.EsActivo, onClick: (e: any) => e.component.props.onActivateClick(e.row.data) },
    ]
  },
];

export const mechanicsFormItems = [
  { dataField: 'Nombre', caption: 'Nombre', colSpan: 1, validationRules: [{ type: 'required', message: 'El nombre es obligatorio.' }] },
  { dataField: 'Apellido', caption: 'Apellido', colSpan: 1, validationRules: [{ type: 'required', message: 'El apellido es obligatorio.' }] },
  { dataField: 'Fotografia', caption: 'URL de Fotografía', colSpan: 1 },
  { dataField: 'FechaNacimiento', caption: 'Fecha de Nacimiento', colSpan: 1, editorType: 'dxDateBox', editorOptions: { displayFormat: 'dd/MM/yyyy' } },
  { dataField: 'TelefonoContacto', caption: 'Teléfono', colSpan: 1, validationRules: [{ type: 'required', message: 'El teléfono es obligatorio.' }] },
  { dataField: 'CorreoElectronico', caption: 'Email', colSpan: 1, validationRules: [{ type: 'email', message: 'Email no válido.' }] },
  { dataField: 'Direccion', caption: 'Dirección', colSpan: 3 },
  { dataField: 'FechaIngreso', caption: 'Fecha de Ingreso', colSpan: 1, editorType: 'dxDateBox', editorOptions: { displayFormat: 'dd/MM/yyyy' }, validationRules: [{ type: 'required', message: 'La fecha de ingreso es obligatoria.' }] },
  {
    dataField: 'Rol',
    caption: 'Rol',
    colSpan: 1,
    editorType: 'dxSelectBox',
    editorOptions: { items: ['Aprendiz', 'Mecánico General', 'Mecánico Especialista', 'Jefe de Taller'] },
    validationRules: [{ type: 'required', message: 'El rol es obligatorio.' }]
  },
  {
    dataField: 'Especialidad',
    caption: 'Especialidad',
    colSpan: 1,
    editorType: 'dxSelectBox',
    editorOptions: { items: ['Motor', 'Suspensión', 'Frenos', 'Electricidad', 'Aire Acondicionado'] },
    validationRules: [{ type: 'required', message: 'La especialidad es obligatoria.' }]
  },
  {
    dataField: 'NivelExperiencia',
    caption: 'Nivel de Experiencia',
    colSpan: 1,
    editorType: 'dxSelectBox',
    editorOptions: { items: ['Básico', 'Intermedio', 'Avanzado'] },
    validationRules: [{ type: 'required', message: 'El nivel de experiencia es obligatorio.' }]
  },
];

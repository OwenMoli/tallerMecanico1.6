const categories = [
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Herramientas manuales',
    order: 1,
    status: 'visible'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Herramientas eléctricas',
    order: 2,
    status: 'hidden'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Consumibles y materiales',
    order: 3,
    status: 'visible'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Lubricantes y químicos',
    order: 4,
    status: 'visible'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Repuestos y piezas',
    order: 5,
    status: 'visible'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Equipos de seguridad',
    order: 6,
    status: 'visible'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Pinturas y recubrimientos',
    order: 7,
    status: 'visible'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Equipos de medición y diagnóstico',
    order: 8,
    status: 'visible'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Máquinas y equipos mayores',
    order: 9,
    status: 'visible'
  },
  {
    uuid: 'aaaa-aaaa-aaaa-aaaa',
    description: 'Accesorios y componentes eléctricos',
    order: 10,
    status: 'visible'
  }
]

export default eventHandler(async () => {
  return categories
})

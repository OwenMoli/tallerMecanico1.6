export const initialNotifications = [
    // Ejemplo de Petición de Pausar (Fecha de hace 1 hora)
    { 
        id: 1, 
        orderId: 'R040', 
        mechanicName: 'Luiz P.',
        carModel: 'Mazda 3', 
        Type: 'Petición de Pausar', 
        comment: 'Necesitamos el filtro de aceite y las bujías para continuar.',
        timestamp: new Date(Date.now() - 3600000).toISOString(), 
        read: false,
    },
    // Ejemplo de Petición de Repuesto (Fecha de hace 3 horas)
    { 
        id: 2, 
        orderId: 'R005', 
        mechanicName: 'Luis P.',
        carModel: 'Mazda 3', 
        Type: 'Petición de Repuesto', 
        comment: 'Necesitamos el filtro de aceite y las bujías para continuar.',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), 
        read: false,
    },
    { 
        id: 3, 
        orderId: 'R004', 
        mechanicName: 'Ana T.',
        carModel: 'Mazda 3', 
        Type: 'Petición de Repuesto', 
        comment: 'Necesitamos el filtro de aceite y las bujías para continuar.',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), 
        read: false,
    },

];
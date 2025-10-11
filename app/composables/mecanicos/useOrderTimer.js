import { ref, onMounted, onUnmounted } from 'vue'

export function useOrderTimer(orderLists) {
  const interval = ref(null)

  // Inicia el temporizador
  const startTimer = () => {
    if (interval.value) return
    interval.value = setInterval(() => {
      orderLists.forEach((list) => {
        list.value.forEach((order) => {
          if (order.inicio) {
            const segundos = Math.floor((Date.now() - new Date(order.inicio)) / 1000)
            order.contador = order.acumulado + segundos

            // ⏱️ Actualizar la fase activa
            if (order.status && order.tiemposPorFase?.[order.status] !== undefined) {
              order.tiemposPorFase[order.status] = order.acumulado + segundos
            }
          } else {
            order.contador = order.acumulado
          }
        })
      })
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(interval.value)
    interval.value = null
  }

  const pauseOrder = (order) => {
    if (order.inicio) {
      const elapsed = Math.floor((Date.now() - new Date(order.inicio)) / 1000)
      order.acumulado += elapsed
      if (order.status && order.tiemposPorFase?.[order.status] !== undefined) {
        order.tiemposPorFase[order.status] += elapsed
      }
      order.inicio = null
    }
  }

  const resumeOrder = (order) => {
    if (!order.inicio) {
      order.inicio = Date.now()
    }
  }

  const finishOrder = (order) => {
    if (order.inicio) {
      const elapsed = Math.floor((Date.now() - new Date(order.inicio)) / 1000)
      order.acumulado += elapsed
      if (order.status && order.tiemposPorFase?.[order.status] !== undefined) {
        order.tiemposPorFase[order.status] += elapsed
      }
      order.inicio = null
    }
  }

  onMounted(startTimer)
  onUnmounted(stopTimer)

  return {
    startTimer,
    stopTimer,
    pauseOrder,
    resumeOrder,
    finishOrder,
  }
}

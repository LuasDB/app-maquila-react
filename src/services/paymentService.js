import apiServices from '@/api/apiServices.js' 

const paymentService = {
  // Obtener todos los pagos
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams() 
      
      if (filters.saleId) params.append('saleId', filters.saleId) 
      if (filters.customerId) params.append('customerId', filters.customerId) 
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod) 
      if (filters.startDate) params.append('startDate', filters.startDate) 
      if (filters.endDate) params.append('endDate', filters.endDate) 

      const response = await apiServices.get(`/payments?${params.toString()}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
    }
  },

  // Obtener pago por ID
  async getById(id) {
    try {
      const response = await apiServices.get(`/payments/${id}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
    }
  },

  // Obtener pagos por venta
  async getBySaleId(saleId) {
    try {
      const response = await apiServices.get(`/payments/sale/${saleId}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
    }
  },

  // Obtener pagos por cliente
  async getByCustomerId(customerId) {
    try {
      const response = await apiServices.get(`/payments/customer/${customerId}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
    }
  },

  // Obtener estadísticas
  async getStats(filters = {}) {
    try {
      const params = new URLSearchParams() 
      
      if (filters.customerId) params.append('customerId', filters.customerId) 
      if (filters.startDate) params.append('startDate', filters.startDate) 
      if (filters.endDate) params.append('endDate', filters.endDate) 

      const response = await apiServices.get(`/payments/stats?${params.toString()}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
    }
  },

  // Crear pago
  async create(paymentData) {
    try {
      const response = await apiServices.post('/payments', paymentData) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
    }
  },

  // Eliminar pago (revertir)
  async delete(id) {
    try {
      const response = await apiServices.delete(`/payments/${id}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
    }
  }
} 

export default paymentService 
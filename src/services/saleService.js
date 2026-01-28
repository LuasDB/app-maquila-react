import apiServices from '@/api/apiServices' 

const saleService = {
  // Obtener todas las ventas
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams() 
      
      if (filters.customerId) params.append('customerId', filters.customerId) 
      if (filters.status) params.append('status', filters.status) 
      if (filters.paymentType) params.append('paymentType', filters.paymentType) 
      if (filters.startDate) params.append('startDate', filters.startDate) 
      if (filters.endDate) params.append('endDate', filters.endDate) 
      if (filters.withBalance) params.append('withBalance', filters.withBalance) 

      const response = await apiServices.get(`/sales?${params.toString()}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al Obtener todas las ventas '
            throw new Error(message)
    }
  },

  // Obtener venta por ID
  async getById(id) {
    try {
      const response = await apiServices.get(`/sales/${id}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al Obtener venta por ID '
            throw new Error(message)
    }
  },

  // Obtener ventas por cliente
  async getByCustomerId(customerId) {
    try {
      const response = await apiServices.get(`/sales/customer/${customerId}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al Obtener ventas por cliente '
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

      const response = await apiServices.get(`/sales/stats?${params.toString()}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al Obtener estadísticas '
            throw new Error(message)
    }
  },

  // Crear venta
  async create(saleData) {
    try {
      const response = await apiServices.post('/sales', saleData) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al Crear venta '
            throw new Error(message)
    }
  },

  // Actualizar venta
  async update(id, saleData) {
    try {
      const response = await apiServices.put(`/sales/${id}`, saleData) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al Actualizar venta '
            throw new Error(message)
    }
  },

  // Eliminar venta
  async delete(id) {
    try {
      const response = await apiServices.delete(`/sales/${id}`) 
      return response.data 
    } catch (error) {
      const message = error.response?.data?.message ||
            'Error al Eliminar venta '
            throw new Error(message)
    }
  }
} 

export default saleService 
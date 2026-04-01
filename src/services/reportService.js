import apiServices from "@/api/apiServices"

const reportService = {
  async getSalesReport(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)
      const { data } = await apiServices.get("/reports/sales?" + params.toString())
      if (data.success) return data.data
    } catch (error) {
      const message = error.response?.data?.message || "Error al obtener reporte de ventas"
      throw new Error(message)
    }
  },
  async getProductionReport(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)
      const { data } = await apiServices.get("/reports/production?" + params.toString())
      if (data.success) return data.data
    } catch (error) {
      const message = error.response?.data?.message || "Error al obtener reporte de produccion"
      throw new Error(message)
    }
  }
}

export default reportService
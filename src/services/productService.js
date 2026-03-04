import apiServices from "@/api/apiServices"

const productService = {
    async getAll(filters = {}) {
        try {
        const params = new URLSearchParams()
        if (filters.active !== undefined) params.append("active", filters.active)
        if (filters.category) params.append("category", filters.category)
        if (filters.search) params.append("search", filters.search)
        const { data } = await apiServices.get("/products?" + params.toString())
        if (data.success) return data.data
        } catch (error) {
        const message = error.response?.data?.message || "Error al obtener productos"
        throw new Error(message)
        }
    },
    async getById(id) {
        try {
        const { data } = await apiServices.get("/products/" + id)
        if (data.success) return data.data
        } catch (error) {
        const message = error.response?.data?.message || "Error al obtener el producto"
        throw new Error(message)
        }
    },
    async getStats() {
        try {
        const { data } = await apiServices.get("/products/stats")
        if (data.success) return data.data
        } catch (error) {
        const message = error.response?.data?.message || "Error al obtener estadisticas"
        throw new Error(message)
        }
    },
    async create(productData) {
        try {
        const { data } = await apiServices.post("/products", productData)
        if (data.success) return data
        } catch (error) {
        const message = error.response?.data?.message || "Error al crear el producto"
        throw new Error(message)
        }
    },
    async update(id, productData) {
        try {
        const { data } = await apiServices.patch("/products/" + id, productData)
        if (data.success) return data
        } catch (error) {
        const message = error.response?.data?.message || "Error al actualizar el producto"
        throw new Error(message)
        }
    },
    async delete(id) {
        try {
        const { data } = await apiServices.delete("/products/" + id)
        if (data.success) return data
        } catch (error) {
        const message = error.response?.data?.message || "Error al eliminar el producto"
        throw new Error(message)
        }
    }
}

export default productService
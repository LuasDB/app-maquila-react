import apiServices from "@/api/apiServices"

const sizeService = {
    async getAll(filters = {}) {
        try {
        const params = new URLSearchParams()
        if (filters.active !== undefined) params.append("active", filters.active)
        const { data } = await apiServices.get("/sizes?" + params.toString())
        if (data.success) return data.data
        } catch (error) {
        const message = error.response?.data?.message || "Error al obtener tallas"
        throw new Error(message)
        }
    },
    async create(sizeData) {
        try {
        const { data } = await apiServices.post("/sizes", sizeData)
        if (data.success) return data
        } catch (error) {
        const message = error.response?.data?.message || "Error al crear la talla"
        throw new Error(message)
        }
    },
    async createMany(sizes) {
        try {
        const { data } = await apiServices.post("/sizes/batch", { sizes })
        if (data.success) return data
        } catch (error) {
        const message = error.response?.data?.message || "Error al crear tallas"
        throw new Error(message)
        }
    },
    async update(id, sizeData) {
        try {
        const { data } = await apiServices.patch("/sizes/" + id, sizeData)
        if (data.success) return data
        } catch (error) {
        const message = error.response?.data?.message || "Error al actualizar la talla"
        throw new Error(message)
        }
    },
    async delete(id) {
        try {
        const { data } = await apiServices.delete("/sizes/" + id)
        if (data.success) return data
        } catch (error) {
        const message = error.response?.data?.message || "Error al eliminar la talla"
        throw new Error(message)
        }
    }
}

export default sizeService
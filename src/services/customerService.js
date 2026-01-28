import apiServices from '@/api/apiServices.js'

const customerService  = {
    
    async getAll(filters={}){
        try {
            const params = new URLSearchParams()

            if (filters.state) params.append('state', filters.state) 
            if (filters.active !== undefined) params.append('active', filters.active) 
            if (filters.search) params.append('search', filters.search) 
            if (filters.highBalance) params.append('highBalance', filters.highBalance) 

            const { data } = await apiServices.get(`/customers?${params}`)
            if(data.success){
                return data.data
            }
        } catch (error) {
            const message = error.response?.data?.message ||
            'Error al traer todos los usuarios'
            throw new Error(message)
        }
    },
    async getOneById(id){
        try {
            const { data } = await apiServices.get(`/customers/${id}`)
            if(data.success){
                return data.data
            }
        } catch (error) {
            const message = error.response?.data?.message ||
            'Error al cargar el elemento'
            throw new Error(message)
        }
    },
    async getStats(){
        try {
            const { data } = await apiServices.get(`/customers/all/stats`)
            if(data.success){
                return data.data
            }
        } catch (error) {
            const message = error.response?.data?.message ||
            'Error al traer las estadisticas'
            throw new Error(message)
        }
    },
    async create(customerData){
        try {
            const { data } = await apiServices.post(`/customers`,customerData)
            if(data.success){
                return data
            }
        } catch (error) {
            const message = error.response?.data?.message ||
            'Error al crear el nuevo registro'
            throw new Error(message)
        }
    },
    async update(id, customerData){
        try {
            const { data } = await apiServices.patch(`/customers/${id}`,customerData)
            if(data.success){
                return data
            }
        } catch (error) {
            const message = error.response?.data?.message ||
            'Error al modificar el registro'
            throw new Error(message)
        }
    },
    async delete(id){
        try {
            const { data } = await apiServices.delete(`/customers/${id}`)
            if(data.success){
                return data
            }
        } catch (error) {
            const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
        }
    }

    
}

export default customerService


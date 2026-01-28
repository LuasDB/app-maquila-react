import apiServices from '@/api/apiServices'

const userService = {
    async create(newUser){
        try {
            const { data } = await apiServices.post('/auth/register', newUser)
            if(data.success){
                return data
            }
        } catch (error) {
            const message = error.response?.data?.message || 
            'Error al obtener usuarios'
            throw new Error(message)
        }
    },
    async getAll(filters={}){
        try {
            const params = new URLSearchParams()

            if(filters.role) params.append('role',filters.role)
            if(filters.active !== undefined ) params.append('active',filters.active)
            if(filters.search) params.append('search',filters.search)
            
            const { data } = await apiServices.get(`/users?${params.toString()}`)

            if(data.success){
                return data
            }
        } catch (error) {
            const message = error.response?.data?.message || 
            'Error al obtener usuarios'
            throw new Error(message)
        }
    },
    async getById(id){
        try {
            const { data } = await apiServices.get(`/users/${id}`)
            return data
        } catch (error) {
            const message = error.response?.data?.message ||
            'Error al traer el usuario'
            throw new Error(message)
        }
    },
    async update(id, userData) {
    try {
        const {data} = await apiServices.patch(`/users/${id}`, userData)
        return data
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al actualizar el usuario'
        throw new Error(message)
        }
    },
    async delete(id) {
    try {
        const {data} = await apiServices.delete(`/users/${id}`);
        return data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al eliminar el usuario'
        throw new Error(message)
        }
    }
        
}

export default userService
import apiServices from '../api/axiosConfig';

const productionService = {
    // Obtener todos los rollos
    async getAll(filters = {}) {
        try {
        const params = new URLSearchParams();
        
        if (filters.productType) params.append('productType', filters.productType);
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.search) params.append('search', filters.search);

        const response = await apiServices.get(`/production?${params.toString()}`);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al Traer todos '
            throw new Error(message)
        }
    },

    // Obtener rollo por ID
    async getById(id) {
        try {
        const response = await apiServices.get(`/production/${id}`);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al traer el registro '
            throw new Error(message)
        }
    },

    // Obtener estadísticas
    async getStats(filters = {}) {
        try {
        const params = new URLSearchParams();
        
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await apiServices.get(`/production/stats?${params.toString()}`);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al traer las estadisticas '
            throw new Error(message)
        }
    },

    // Crear rollo
    async create(rollData) {
        try {
        const response = await apiServices.post('/production', rollData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al crear el registro '
            throw new Error(message)
        }
    },

    // Actualizar rollo
    async update(id, rollData) {
        try {
        const response = await apiServices.put(`/production/${id}`, rollData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al intentar actualizar, intente de nuevo mas tarde '
            throw new Error(message)
        }
    },

    // Eliminar rollo
    async delete(id) {
        try {
        const response = await apiServices.delete(`/production/${id}`);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al eliminar '
            throw new Error(message)
        }
    },

    // Registrar corte
    async registerCutting(id, cuttingData) {
        try {
        const response = await apiServices.post(`/production/${id}/cutting`, cuttingData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al registrar el corte '
            throw new Error(message)
        }
    },

    // Registrar salida a maquila
    async registerSewing(id, sewingData) {
        try {
        const response = await apiServices.post(`/production/${id}/sewing`, sewingData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al registrar la salida de la maquila '
            throw new Error(message)
        }
    },

    // Registrar entrega de maquila
    async registerSewingReturn(id, returnData) {
        try {
        const response = await apiServices.post(`/production/${id}/sewing/return`, returnData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al Registrar entrega de maquila '
            throw new Error(message)
        }
    },

    // Registrar salida a lavandería
    async registerLaundry(id, laundryData) {
        try {
        const response = await apiServices.post(`/production/${id}/laundry`, laundryData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al Registrar salida a lavandería '
            throw new Error(message)
        }
    },

    // Registrar entrega de lavandería
    async registerLaundryReturn(id, returnData) {
        try {
        const response = await apiServices.post(`/production/${id}/laundry/return`, returnData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al Registrar entrega de lavandería '
            throw new Error(message)
        }
    },

    // Registrar salida a terminado
    async registerFinishing(id, finishingData) {
        try {
        const response = await apiServices.post(`/production/${id}/finishing`, finishingData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al Registrar salida a terminado '
            throw new Error(message)
        }
    },

    // Registrar entrega de terminado
    async registerFinishingReturn(id, returnData) {
        try {
        const response = await apiServices.post(`/production/${id}/finishing/return`, returnData);
        return response.data;
        } catch (error) {
        const message = error.response?.data?.message ||
            'Error al Registrar entrega de terminado '
            throw new Error(message)
        }
    }
};

export default productionService;
import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, X, Eye, Building2, Phone, Mail, MapPin, CreditCard, TrendingUp, AlertCircle } from 'lucide-react' 
import customerService from '@/services/customerService'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import CustomerForm from '../CustomerForm'
import CustomerDetail from '../CustomerDetail'
import CustomerDetailPhase2 from '../CustomerDetailPhase2' 

const CustomersList = () => {
    const [customers, setCustomers] = useState([]) 
    const [filteredCustomers, setFilteredCustomers] = useState([]) 
    const [stats, setStats] = useState({ total: 0, active: 0, totalBalance: 0, highBalance: 0 })
    const [searchTerm, setSearchTerm] = useState('') 
    const [isModalOpen, setIsModalOpen] = useState(false) 
    const [isDetailOpen, setIsDetailOpen] = useState(false) 
    const [selectedCustomer, setSelectedCustomer] = useState(null) 
    const [loading, setLoading] = useState(true) 
    const [filterStatus, setFilterStatus] = useState('') 
    const [error, setError] = useState('')

    useEffect(() => {
        loadCustomers() 
        // loadStats()
    }, []) 

    useEffect(() => {
        filterCustomers() 
    }, [customers, searchTerm, filterStatus]) 

    const loadCustomers = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await customerService.getAll()
            setCustomers(response)
        } catch (error) {
            setError(error.message)
            
        }finally{setLoading(false)}
    } 

    const loadStats = async()=>{
        try {
            const response = await customerService.getStats()
            setStats(response)
        } catch (error) {
            setError(error.message)
        }
    }

    const filterCustomers = () => {
        let filtered = [...customers] 

        if (searchTerm) {
        filtered = filtered.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.city.toLowerCase().includes(searchTerm.toLowerCase())
        ) 
        }

        if (filterStatus === 'active') {
        filtered = filtered.filter(c => c.active) 
        } else if (filterStatus === 'inactive') {
        filtered = filtered.filter(c => !c.active) 
        } else if (filterStatus === 'high-balance') {
        filtered = filtered.filter(c => c.currentBalace > c.creditLimit * 0.7) 
        }

        setFilteredCustomers(filtered) 
    } 

    const handleCreate = () => {
        setSelectedCustomer(null) 
        setIsModalOpen(true) 
    } 

    const handleEdit = (customer) => {
        setSelectedCustomer(customer) 
        setIsDetailOpen(false) 
        setIsModalOpen(true) 
    } 

    const handleView = (customer) => {
        setSelectedCustomer(customer) 
        setIsDetailOpen(true) 
    } 

    const handleDelete = async (id, currentBalace) => {
        if (currentBalace > 0) {
        alert('No se puede eliminar un cliente con saldo pendiente') 
        return 
        }

        if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return 
        try {
            await customerService.delete(id) 
            await loadCustomers() 
            // await loadStats() 
        } catch (error) {
        alert('Error al eliminar cliente: ' + error.message) 
        }


    } 

    const handleSubmit = async (formData) => {
        if (selectedCustomer) {
        await customerService.update(selectedCustomer._id, formData) 
        } else {
        await customerService.create(formData) 
        }
        setIsModalOpen(false) 
        loadCustomers() 
    } 

    const getCreditStatus = (customer) => {
        const usage = (customer.currentBalace / customer.creditLimit) * 100 
        if (usage > 80) return { color: 'red', label: 'Crítico' } 
        if (usage > 60) return { color: 'yellow', label: 'Alerta' } 
        return { color: 'green', label: 'Normal' } 
    } 

    const totalBalance = customers.reduce((sum, c) => sum + c.currentBalace, 0) 
    const activeCustomers = customers.filter(c => c.active).length 
    const highBalanceCustomers = customers.filter(c => 
        c.currentBalace > c.creditLimit * 0.7
    ).length 

    if (loading) {
        return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Cargando clientes...</div>
        </div>
        ) 
    }

    if (error) {
        return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <div>
                <p className="text-red-600 font-medium">Error: {error}</p>
                <button 
                onClick={loadCustomers}
                className="mt-2 text-sm text-red-700 underline"
                >
                Intentar de nuevo
                </button>
            </div>
            </div>
        </div>
        ) 
    }

    return (
        <div className="space-y-4">
        {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Clientes</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Clientes Activos</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Saldo Total</div>
            <div className="text-2xl font-bold text-blue-600">
                ${Number(stats.totalBalance).toLocaleString('es-MX')}
            </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Crédito Alto</div>
            <div className="text-2xl font-bold text-red-600">{stats.highBalance}</div>
            </div>
        </div>

        {/* Header con búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o ciudad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="high-balance">Saldo Alto</option>
                </select>

                <Button variant="primary" onClick={handleCreate} className="w-full sm:w-auto">
                <Plus className="w-5 h-5 mr-2 inline" />
                Nuevo Cliente
                </Button>
            </div>
            </div>
        </div>

        {/* Tabla de clientes */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crédito
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                    <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron clientes
                    </td>
                    </tr>
                ) : (
                    filteredCustomers.map((customer) => {
                    const creditStatus = getCreditStatus(customer) 
                    return (
                        <tr key={customer._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.city}, {customer.state}</div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{customer.phone}</div>
                            {customer.email && (
                            <div className="text-sm text-gray-500">{customer.email}</div>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                            ${Number(customer.creditLimit).toLocaleString('es-MX')}
                            </div>
                            <div className="text-xs text-gray-500">{customer.creditDays} días</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                            ${Number(customer.currentBalace).toLocaleString('es-MX')}
                            </div>
                            <span className={`
                            inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                            ${creditStatus.color === 'red' ? 'bg-red-100 text-red-800' : 
                                creditStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}
                            `}>
                            {creditStatus.label}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`
                            px-2 py-1 text-xs font-semibold rounded-full
                            ${customer.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            `}>
                            {customer.active ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                            <button
                            onClick={() => handleView(customer)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalle"
                            >
                            <Eye className="w-4 h-4 inline" />
                            </button>
                            <button
                            onClick={() => handleEdit(customer)}
                            className="text-green-600 hover:text-green-900"
                            title="Editar"
                            >
                            <Edit2 className="w-4 h-4 inline" />
                            </button>
                            <button
                            onClick={() => handleDelete(customer._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                            >
                            <Trash2 className="w-4 h-4 inline" />
                            </button>
                        </td>
                        </tr>
                    ) 
                    })
                )}
                </tbody>
            </table>
            </div>
        </div>
        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
            {filteredCustomers.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                No se encontraron clientes
                </div>
            ) : (
                filteredCustomers.map(customer => {
                const creditStatus = getCreditStatus(customer) 

                return (
                    <div
                    key={customer._id}
                    className="bg-white rounded-lg shadow p-4 space-y-3"
                    >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-gray-500">
                            {customer.city}, {customer.state}
                        </p>
                        </div>

                        <span className={`px-2 py-1 text-xs rounded-full
                        ${customer.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'}
                        `}>
                        {customer.active ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="text-sm space-y-1">
                        <p><strong>Tel:</strong> {customer.phone}</p>
                        {customer.email && <p>{customer.email}</p>}
                        <p>
                        <strong>Saldo:</strong>{' '}
                        <span className="font-semibold">
                            $ {Number(customer.currentBalace).toLocaleString('es-MX')}
                        </span>
                        </p>
                    </div>

                    {/* Crédito */}
                    <span className={`inline-block px-2 py-0.5 rounded text-xs
                        ${creditStatus.color === 'red'
                        ? 'bg-red-100 text-red-800'
                        : creditStatus.color === 'yellow'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'}
                    `}>
                        {creditStatus.label}
                    </span>

                    {/* Acciones */}
                    <div className="flex justify-center gap-2 pt-2">
                        <Button size="sm" onClick={() => handleView(customer)}>
                        Ver
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(customer)}>
                        Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(customer)}>
                        Eliminar
                        </Button>
                    </div>
                    </div>
                ) 
                })
            )}
        </div>


        {/* Modal Formulario */}
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
            size="lg"
        >
            <CustomerForm
            customer={selectedCustomer}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            />
        </Modal>

        {/* Modal Detalle */}
        <Modal
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            title="Detalle del Cliente"
            size="xl"
        >
            {selectedCustomer && (
            <CustomerDetail
                customer={selectedCustomer}
                onClose={() => setIsDetailOpen(false)}
                onEdit={handleEdit}
            />
            )}
        </Modal>
        </div>
    ) 
} 

export default CustomersList 
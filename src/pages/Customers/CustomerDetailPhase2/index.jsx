import React, { useState, useEffect } from 'react' 
import { Search, Plus, Edit2, Trash2, X, Eye, Building2, Phone, Mail, MapPin, CreditCard, TrendingUp, AlertCircle, DollarSign, Receipt, Calendar, FileText, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react' 
import customerService from '@/services/customerService' 
import saleService from '@/services/saleService' 
import paymentService from '@/services/paymentService' 
import Button from '@/components/common/Button' 
import Modal from '@/components/common/Modal' 
import SaleForm from '@/pages/Customers/SaleForm' 
import PaymentForm from '@/pages/Customers/PaymentForm' 

const CustomerDetailPhase2 = ({ customerData }) => {
    const [customer, setCustomer] = useState(null) 
    const [sales, setSales] = useState([]) 
    const [payments, setPayments] = useState([]) 
    const [activeTab, setActiveTab] = useState('sales') 
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false) 
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false) 
    const [selectedSale, setSelectedSale] = useState(null) 
    const [loading, setLoading] = useState(true) 
    const [error, setError] = useState('') 

    useEffect(() => {
        loadData() 
    }, [customerData]) 

    const loadData = async () => {
        try {
        setLoading(true) 
        setError('') 
        
        // Cargar datos en paralelo
        const [customerResponse, salesResponse, paymentsResponse] = await Promise.all([
            customerService.getOneById(customerData._id),
            saleService.getByCustomerId(customerData._id),
            paymentService.getByCustomerId(customerData._id)
        ]) 
        console.log(customerResponse, salesResponse, paymentsResponse)
        setCustomer({
            ...customerResponse,
            creditLimit: customerResponse.creditLimit ?? 0,
            currentBalance: customerResponse.currentBalance ?? 0
        }) 
        setSales(salesResponse.data) 
        setPayments(paymentsResponse.data) 
        } catch (error) {
        setError(error.message) 
        console.error('Error al cargar datos:', error) 
        } finally {
        setLoading(false) 
        }
    } 

    const handleCreateSale = async (saleData) => {
        try {
        await saleService.create(saleData) 
        setIsSaleModalOpen(false) 
        await loadData()  // Recargar todos los datos
        } catch (error) {
        alert('Error al crear venta: ' + error.message) 
        }
    } 

    const handleCreatePayment = async (paymentData) => {
        try {
        await paymentService.create(paymentData) 
        setIsPaymentModalOpen(false) 
        setSelectedSale(null) 
        await loadData()  // Recargar todos los datos
        } catch (error) {
        alert('Error al registrar pago: ' + error.message) 
        }
    } 

    const handleRegisterPayment = (sale) => {
        setSelectedSale(sale) 
        setIsPaymentModalOpen(true) 
    } 

    const getSaleStatusBadge = (sale) => {
        const today = new Date() 
        const dueDate = new Date(sale.dueDate) 
        
        let status = sale.status 
        if (sale.balance > 0 && today > dueDate) {
        status = 'overdue' 
        }

        const badges = {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pendiente' },
        partial: { bg: 'bg-blue-100', text: 'text-blue-800', icon: DollarSign, label: 'Pago Parcial' },
        paid: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Pagada' },
        overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle, label: 'Vencida' }
        } 

        const badge = badges[status] 
        const Icon = badge.icon 

        return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}>
            <Icon className="w-3 h-3 mr-1" />
            {badge.label}
        </span>
        ) 
    } 

    const getPaymentMethodLabel = (method) => {
        const methods = {
        cash: 'Efectivo',
        transfer: 'Transferencia',
        check: 'Cheque',
        card: 'Tarjeta'
        } 
        return methods[method] || method 
    } 

        if (loading) {
            return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Cargando información...</div>
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
                    onClick={loadData}
                    className="mt-2 text-sm text-red-700 underline"
                    >
                    Intentar de nuevo
                    </button>
                </div>
                </div>
            </div>
            ) 
        }

        if (!customer) {
            return (
                <>
                <div className="text-center text-gray-600">Cliente no encontrado</div>
                    
                </>
            
            
            ) 
        }   

    const creditUsage = customer.creditLimit > 0
    ? (customer.currentBalance / customer.creditLimit) * 100
    : 0
    const availableCredit = customer.creditLimit - customer.currentBalance 
    const totalSales = sales.reduce((sum, s) => sum + s?.total, 0) 
    const totalPaid = sales.reduce((sum, s) => sum + s?.amountPaid, 0) 
    const pendingSales = sales.filter(s => s?.balance > 0) 
    const overdueSales = sales.filter(s => {
        const today = new Date() 
        const dueDate = new Date(s?.dueDate) 
        return s?.balance > 0 && today > dueDate 
    }) 

    return (
        <div className="space-y-6">
        {sales.length === 0 && (
            <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                Este cliente aún no tiene ventas registradas
                </p>
                <Button variant="primary" onClick={() => setIsSaleModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2 inline" />
                Crear primera venta
                </Button>
            </div>
            )}
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-start">
            <div>
            <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
            {customer.businessName && (
                <p className="text-gray-600">{customer.businessName}</p>
            )}
            </div>
            <Button variant="primary" className="w-full md:w-auto" onClick={() => setIsSaleModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2 inline" />
            Nueva Venta
            </Button>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-blue-600 font-medium">Límite de Crédito</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                    ${customer.creditLimit.toLocaleString('es-MX')}
                </p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
            </div>

            <div className={`rounded-lg p-4 border ${
            creditUsage > 80 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
            <div className="flex items-center justify-between">
                <div>
                <p className={`text-sm font-medium ${
                    creditUsage > 80 ? 'text-red-600' : 'text-yellow-600'
                }`}>Saldo Actual</p>
                <p className={`text-2xl font-bold mt-1 ${
                    creditUsage > 80 ? 'text-red-900' : 'text-yellow-900'
                }`}>
                    ${customer.currentBalance.toLocaleString('es-MX')}
                </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${
                creditUsage > 80 ? 'text-red-500' : 'text-yellow-500'
                }`} />
            </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-green-600 font-medium">Crédito Disponible</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                    ${availableCredit.toLocaleString('es-MX')}
                </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-purple-600 font-medium">Total Ventas</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                    ${totalSales.toLocaleString('es-MX')}
                </p>
                </div>
                <Receipt className="w-8 h-8 text-purple-500" />
            </div>
            </div>
        </div>

        {/* Alertas */}
        {overdueSales.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                <p className="text-sm font-medium text-red-800">
                    {overdueSales.length} {overdueSales.length === 1 ? 'venta vencida' : 'ventas vencidas'}
                </p>
                <p className="text-sm text-red-700 mt-1">
                    Saldo vencido: ${overdueSales.reduce((sum, s) => sum + s.balance, 0).toLocaleString('es-MX')}
                </p>
                </div>
            </div>
            </div>
        )}

        {/* Barra de uso de crédito */}
        <div>
            <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Uso de Crédito</span>
            <span className="text-sm font-semibold text-gray-900">{creditUsage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
                className={`h-3 rounded-full transition-all ${
                creditUsage > 80 ? 'bg-red-500' : creditUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(creditUsage, 100)}%` }}
            ></div>
            </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
            <button
                onClick={() => setActiveTab('sales')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sales'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                Ventas ({sales.length})
            </button>
            <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                Pagos ({payments.length})
            </button>
            <button
                onClick={() => setActiveTab('statement')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statement'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                Estado de Cuenta
            </button>
            </nav>
        </div>

        {/* Contenido de tabs */}
        <div>
           {activeTab === 'sales' && (
                <>
                    {/* MOBILE - Cards */}
                    <div className="space-y-4 md:hidden">
                    {sales.length === 0 ? (
                        <div className="text-center text-gray-500 py-6">
                        No hay ventas registradas
                        </div>
                    ) : (
                        sales.map((sale) => (
                        <div
                            key={sale._id}
                            className="bg-white rounded-lg border shadow-sm p-4 space-y-2"
                        >
                            <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">{sale.folio}</span>
                            {getSaleStatusBadge(sale)}
                            </div>

                            <div className="text-sm text-gray-600">
                            Fecha: {new Date(sale.date).toLocaleDateString('es-MX')}
                            </div>

                            <div className="flex justify-between text-sm">
                            <span>Total</span>
                            <span className="font-semibold">
                                ${sale.total.toLocaleString('es-MX')}
                            </span>
                            </div>

                            <div className="flex justify-between text-sm text-green-600">
                            <span>Pagado</span>
                            <span>${sale.amountPaid.toLocaleString('es-MX')}</span>
                            </div>

                            <div className="flex justify-between text-sm text-red-600 font-semibold">
                            <span>Saldo</span>
                            <span>${sale.balance.toLocaleString('es-MX')}</span>
                            </div>

                            {sale.balance > 0 && (
                            <Button
                                variant="success"
                                className="w-full mt-2"
                                onClick={() => handleRegisterPayment(sale)}
                            >
                                Registrar Pago
                            </Button>
                            )}
                        </div>
                        ))
                    )}
                    </div>

                    {/* DESKTOP - Tabla */}
                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagado</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th> <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {sales.length === 0 ? ( <tr> <td colSpan="8" className="px-6 py-8 text-center text-gray-500"> No hay ventas registradas </td> </tr> ) : ( sales.map((sale) => ( <tr key={sale._id} className="hover:bg-gray-50"> <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.folio}</td> <td className="px-6 py-4 text-sm text-gray-600"> {new Date(sale.date).toLocaleDateString('es-MX')} </td> <td className="px-6 py-4 text-sm text-gray-600"> {new Date(sale.dueDate).toLocaleDateString('es-MX')} </td> <td className="px-6 py-4 text-sm font-semibold text-gray-900"> ${sale.total.toLocaleString('es-MX')} </td> <td className="px-6 py-4 text-sm text-green-600"> ${sale.amountPaid.toLocaleString('es-MX')} </td> <td className="px-6 py-4 text-sm font-semibold text-red-600"> ${sale.balance.toLocaleString('es-MX')} </td> <td className="px-6 py-4"> {getSaleStatusBadge(sale)} </td> <td className="px-6 py-4 text-right text-sm"> {sale.balance > 0 && ( <Button variant="success" onClick={() => handleRegisterPayment(sale)} className="text-xs py-1 px-3" > Registrar Pago </Button> )} </td> </tr> )) )} </tbody>
                        </table>
                    </div>
                    </div>
                </>
            )}


            {activeTab === 'payments' && (
                <>
                    {/* MOBILE */}
                    <div className="space-y-4 md:hidden">
                    {payments.length === 0 ? (
                        <div className="text-center text-gray-500 py-6">
                        No hay pagos registrados
                        </div>
                    ) : (
                        payments.map((payment) => (
                        <div
                            key={payment._id}
                            className="bg-white rounded-lg border shadow-sm p-4 space-y-2"
                        >
                            <div className="flex justify-between">
                            <span className="font-semibold">{payment.folio}</span>
                            <span className="text-green-600 font-semibold">
                                ${payment.amount.toLocaleString('es-MX')}
                            </span>
                            </div>

                            <div className="text-sm text-gray-600">
                            Venta: {payment.saleFolio}
                            </div>

                            <div className="text-sm text-gray-600">
                            Fecha: {new Date(payment.paymentDate).toLocaleDateString('es-MX')}
                            </div>

                            <div className="text-sm">
                            Método: {getPaymentMethodLabel(payment.paymentMethod)}
                            </div>

                            {payment.reference && (
                            <div className="text-xs text-gray-500">
                                Ref: {payment.reference}
                            </div>
                            )}
                        </div>
                        ))
                    )}
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio Pago</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio Venta</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referencia</th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {payments.length === 0 ? ( <tr> <td colSpan="6" className="px-6 py-8 text-center text-gray-500"> No hay pagos registrados </td> </tr> ) : ( payments.map((payment) => ( <tr key={payment._id} className="hover:bg-gray-50"> <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.folio}</td> <td className="px-6 py-4 text-sm text-blue-600">{payment.saleFolio}</td> <td className="px-6 py-4 text-sm text-gray-600"> {new Date(payment.paymentDate).toLocaleDateString('es-MX')} </td> <td className="px-6 py-4 text-sm font-semibold text-green-600"> ${payment.amount.toLocaleString('es-MX')} </td> <td className="px-6 py-4 text-sm text-gray-600"> {getPaymentMethodLabel(payment.paymentMethod)} </td> <td className="px-6 py-4 text-sm text-gray-600"> {payment.reference || '-'} </td> </tr> )) )} </tbody>
                        </table>
                    </div>
                    </div>
                </>
            )}


            {activeTab === 'statement' && (
            <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Estado de Cuenta</h3>
                    <Button variant="outline">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Descargar PDF
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">Total Facturado</p>
                    <p className="text-2xl font-bold text-blue-900">${totalSales.toLocaleString('es-MX')}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-1">Total Pagado</p>
                    <p className="text-2xl font-bold text-green-900">${totalPaid.toLocaleString('es-MX')}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600 mb-1">Saldo Pendiente</p>
                    <p className="text-2xl font-bold text-red-900">${customer.currentBalance.toLocaleString('es-MX')}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Resumen de Ventas Pendientes</h4>
                    <div className="space-y-2">
                    {pendingSales.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hay ventas pendientes</p>
                    ) : (
                        pendingSales.map((sale) => {
                        const isOverdue = new Date(sale.dueDate) < new Date() 
                        return (
                            <div key={sale._id} className={`flex justify-between items-center p-3 rounded-lg ${
                            isOverdue ? 'bg-red-50' : 'bg-gray-50'
                            }`}>
                            <div>
                                <p className="font-medium text-gray-900">{sale.folio}</p>
                                <p className="text-sm text-gray-600">
                                Vence: {new Date(sale.dueDate).toLocaleDateString('es-MX')}
                                {isOverdue && <span className="text-red-600 ml-2 font-semibold">VENCIDA</span>}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">${sale.balance.toLocaleString('es-MX')}</p>
                                <p className="text-sm text-gray-600">de ${sale.total.toLocaleString('es-MX')}</p>
                            </div>
                            </div>
                        ) 
                        })
                    )}
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>

        {/* Modales */}
        <Modal
            isOpen={isSaleModalOpen}
            onClose={() => setIsSaleModalOpen(false)}
            title="Nueva Venta"
            size="xl"
            
            
        >
            <SaleForm
            customer={customer}
            onSubmit={handleCreateSale}
            onCancel={() => setIsSaleModalOpen(false)}
            />
        </Modal>

        <Modal
            isOpen={isPaymentModalOpen}
            onClose={() => {
            setIsPaymentModalOpen(false) 
            setSelectedSale(null) 
            }}
            title="Registrar Pago"
            size="md"
        >
            {selectedSale && (
            <PaymentForm
                sale={selectedSale}
                customer={customer}
                onSubmit={handleCreatePayment}
                onCancel={() => {
                setIsPaymentModalOpen(false) 
                setSelectedSale(null) 
                }}
            />
            )}
        </Modal>
        </div>
    ) 
} 

export default CustomerDetailPhase2 
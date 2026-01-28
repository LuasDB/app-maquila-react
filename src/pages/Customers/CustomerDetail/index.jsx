import { Edit2, Building2, Phone, Mail, MapPin, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button'
import CustomerDetailPhase2 from '../CustomerDetailPhase2';

const CustomerDetail = ({ customer, onClose, onEdit }) => {
    const creditUsage = (customer.currentBalance / customer.creditLimit) * 100 
    const availableCredit = customer.creditLimit - customer.currentBalance 
    return (
        <div className="overflow-y-auto">
        {/* Header con acciones */}
        <div className="flex justify-between items-start">
            <div>
            <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
            {customer.businessName && (
                <p className="text-gray-600">{customer.businessName}</p>
            )}
            </div>
            
        </div>

       

      

        {/* Información de contacto */}
        <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium">{customer.phone}</p>
                </div>
            </div>

            {customer.email && (
                <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                    <p className="text-sm text-gray-600">Correo</p>
                    <p className="font-medium">{customer.email}</p>
                </div>
                </div>
            )}

            <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-medium">{customer.address}</p>
                <p className="text-sm text-gray-600">{customer.city}, {customer.state}</p>
                </div>
            </div>

            {customer.rfc && (
                <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                    <p className="text-sm text-gray-600">RFC</p>
                    <p className="font-medium">{customer.rfc}</p>
                </div>
                </div>
            )}
            </div>
        </div>

        {/* Términos de crédito */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Términos de Crédito</h3>
            <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm text-blue-600">Días de crédito</p>
                <p className="text-xl font-bold text-blue-900">{customer.creditDays} días</p>
            </div>
            <div>
                <p className="text-sm text-blue-600">Fecha de registro</p>
                <p className="text-lg font-semibold text-blue-900">
                {new Date(customer.createdAt).toLocaleDateString('es-MX')}
                </p>
            </div>
            </div>
        </div>

       
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-10">
            <div className="flex items-start space-x-3">
            <CustomerDetailPhase2 customerData={customer} />
            </div>
        </div>
        </div>
    ) 
} 

export default CustomerDetail
import React, { useState } from 'react' 
import { AlertCircle } from 'lucide-react' 
import Button from '@/components/common/Button' 
import Input from '@/components/common/Input' 
import Select from '@/components/common/Select' 

const PaymentForm = ({ sale, customer, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        saleId: sale._id,
        amount: '',
        paymentMethod: 'cash',
        reference: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ''
    }) 

    const [errors, setErrors] = useState({}) 

    const paymentMethodOptions = [
        { value: 'cash', label: 'Efectivo' },
        { value: 'transfer', label: 'Transferencia' },
        { value: 'check', label: 'Cheque' },
        { value: 'card', label: 'Tarjeta' }
    ] 

    const handleChange = (e) => {
        const { name, value } = e.target 
        setFormData(prev => ({
        ...prev,
        [name]: value
        })) 
        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' })) 
        }
    } 

    const validate = () => {
        const newErrors = {} 
        const amount = parseFloat(formData.amount) 

        if (!formData.amount || amount <= 0) {
        newErrors.amount = 'El monto debe ser mayor a 0' 
        } else if (amount > sale.balance) {
        newErrors.amount = `El monto no puede exceder el saldo pendiente: $${sale.balance.toFixed(2)}` 
        }

        if (!formData.paymentMethod) {
        newErrors.paymentMethod = 'El método de pago es requerido' 
        }

        if (!formData.paymentDate) {
        newErrors.paymentDate = 'La fecha de pago es requerida' 
        } else {
        const paymentDate = new Date(formData.paymentDate) 
        const today = new Date() 
        today.setHours(23, 59, 59, 999) 
        
        if (paymentDate > today) {
            newErrors.paymentDate = 'La fecha de pago no puede ser futura' 
        }
        }

        // Validar referencia para transferencias y cheques
        if ((formData.paymentMethod === 'transfer' || formData.paymentMethod === 'check') 
            && !formData.reference.trim()) {
        newErrors.reference = 'La referencia es requerida para este método de pago' 
        }

        setErrors(newErrors) 
        return Object.keys(newErrors).length === 0 
    } 

    const handleSubmit = () => {
        if (validate()) {
        const submitData = {
            ...formData,
            amount: parseFloat(formData.amount),
            createdAt: new Date(),
            updatedAt: new Date()
        } 
        onSubmit(submitData) 
        }
    } 

    const handlePayFull = () => {
        setFormData(prev => ({
        ...prev,
        amount: sale.balance.toString()
        })) 
        if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: '' })) 
        }
    } 

    const amount = parseFloat(formData.amount) || 0 
    const newBalance = sale.balance - amount 

    return (
        <div>
        {/* Información de la venta */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Información de la Venta</h4>
            <div className="space-y-1 text-sm">
            <div className="flex justify-between">
                <span className="text-blue-700">Folio:</span>
                <span className="font-medium text-blue-900">{sale.folio}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-blue-700">Cliente:</span>
                <span className="font-medium text-blue-900">{customer.name}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-blue-700">Total:</span>
                <span className="font-medium text-blue-900">
                ${sale.total.toLocaleString('es-MX')}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-blue-700">Pagado:</span>
                <span className="font-medium text-green-700">
                ${sale.amountPaid.toLocaleString('es-MX')}
                </span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-1 mt-1">
                <span className="text-blue-700 font-semibold">Saldo Pendiente:</span>
                <span className="font-bold text-red-700">
                ${sale.balance.toLocaleString('es-MX')}
                </span>
            </div>
            </div>
        </div>

        {/* Monto del pago */}
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
                Monto del Pago <span className="text-red-500">*</span>
            </label>
            <button
                type="button"
                onClick={handlePayFull}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
                Pagar Total
            </button>
            </div>
            <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
            step="0.01"
            />
            {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
            
            {/* Mostrar saldo restante */}
            {amount > 0 && amount <= sale.balance && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                <div className="flex justify-between">
                <span className="text-green-700">Saldo después del pago:</span>
                <span className="font-semibold text-green-900">
                    ${newBalance.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                </div>
                {newBalance === 0 && (
                <p className="text-green-600 text-xs mt-1">✓ La venta quedará completamente pagada</p>
                )}
            </div>
            )}
        </div>

        {/* Método de pago */}
        <Select
            label="Método de Pago"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            options={paymentMethodOptions}
            error={errors.paymentMethod}
            required
        />

        {/* Referencia (solo para transferencia y cheque) */}
        {(formData.paymentMethod === 'transfer' || formData.paymentMethod === 'check') && (
            <Input
            label={formData.paymentMethod === 'transfer' ? 'Referencia de Transferencia' : 'Número de Cheque'}
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            error={errors.reference}
            required
            placeholder={formData.paymentMethod === 'transfer' ? 'TRF123456' : 'CHQ123456'}
            />
        )}

        {/* Fecha de pago */}
        <Input
            label="Fecha de Pago"
            name="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={handleChange}
            error={errors.paymentDate}
            required
        />

        {/* Notas */}
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas / Observaciones
            </label>
            <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Observaciones sobre el pago..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Alerta informativa */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
            Al registrar este pago, se actualizará automáticamente el saldo de la venta y del cliente.
            </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
            Cancelar
            </Button>
            <Button variant="success" onClick={handleSubmit}>
            Registrar Pago
            </Button>
        </div>
        </div>
    ) 
} 

export default PaymentForm 
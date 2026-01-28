import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';

const SaleForm = ({ customer, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        customerId: customer._id,
        date: new Date().toISOString().split('T')[0],
        paymentType: 'credit',
        notes: '',
        items: [
        { description: '', quantity: '', unitPrice: '' }
        ]
    });

    const [errors, setErrors] = useState({});

    const paymentTypeOptions = [
        { value: 'cash', label: 'Contado' },
        { value: 'credit', label: 'Crédito' }
    ];

    // Calcular totales
    const calculateTotals = () => {
        const subtotal = formData.items.reduce((sum, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        return sum + (quantity * unitPrice);
        }, 0);

        const tax = subtotal * 0.16; // IVA 16%
        const total = subtotal + tax;

        return { subtotal, tax, total };
    };

    const { subtotal, tax, total } = calculateTotals();

    // Calcular crédito disponible
    const availableCredit = customer.creditLimit - customer.currentBalance;
    const exceedsCredit = formData.paymentType === 'credit' && total > availableCredit;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData(prev => ({
        ...prev,
        items: newItems
        }));
        
        // Limpiar errores del item
        if (errors[`item_${index}_${field}`]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`item_${index}_${field}`];
            return newErrors;
        });
        }
    };

    const addItem = () => {
        setFormData(prev => ({
        ...prev,
        items: [...prev.items, { description: '', quantity: '', unitPrice: '' }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            items: newItems
        }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.date) {
        newErrors.date = 'La fecha es requerida';
        }

        if (!formData.paymentType) {
        newErrors.paymentType = 'El tipo de pago es requerido';
        }

        // Validar items
        let hasValidItem = false;
        formData.items.forEach((item, index) => {
        if (item.description.trim() || item.quantity || item.unitPrice) {
            hasValidItem = true;
            
            if (!item.description.trim()) {
            newErrors[`item_${index}_description`] = 'Descripción requerida';
            }
            if (!item.quantity || parseFloat(item.quantity) <= 0) {
            newErrors[`item_${index}_quantity`] = 'Cantidad inválida';
            }
            if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
            newErrors[`item_${index}_unitPrice`] = 'Precio inválido';
            }
        }
        });

        if (!hasValidItem) {
        newErrors.items = 'Debe agregar al menos un artículo';
        }

        if (exceedsCredit) {
        newErrors.credit = 'La venta excede el crédito disponible';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
        // Filtrar items vacíos
        const validItems = formData.items.filter(item => 
            item.description.trim() && item.quantity && item.unitPrice
        );

        const submitData = {
            ...formData,
            items: validItems,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        onSubmit(submitData);
        }
    };

    return (
        <div>
        {/* Información del cliente */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Información del Cliente</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
                <span className="text-blue-700">Cliente:</span>
                <span className="ml-2 font-medium text-blue-900">{customer.name}</span>
            </div>
            <div>
                <span className="text-blue-700">Límite de Crédito:</span>
                <span className="ml-2 font-medium text-blue-900">
                ${customer.creditLimit.toLocaleString('es-MX')}
                </span>
            </div>
            <div>
                <span className="text-blue-700">Saldo Actual:</span>
                <span className="ml-2 font-medium text-blue-900">
                ${customer.currentBalance.toLocaleString('es-MX')}
                </span>
            </div>
            <div>
                <span className="text-blue-700">Crédito Disponible:</span>
                <span className="ml-2 font-medium text-green-700">
                ${availableCredit.toLocaleString('es-MX')}
                </span>
            </div>
            </div>
        </div>

        {/* Alerta de crédito excedido */}
        {exceedsCredit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-red-800">Crédito insuficiente</p>
                <p className="text-sm text-red-700">
                La venta excede el crédito disponible. Ajuste los montos o seleccione pago de contado.
                </p>
            </div>
            </div>
        )}

        {/* Fecha y Tipo de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
            label="Fecha de Venta"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
            />

            <Select
            label="Tipo de Pago"
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            options={paymentTypeOptions}
            error={errors.paymentType}
            required
            />
        </div>

        {/* Items */}
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
                Artículos <span className="text-red-500">*</span>
            </label>
            <Button variant="outline" onClick={addItem} className="text-xs py-1 px-2">
                <Plus className="w-3 h-3 mr-1 inline" />
                Agregar Artículo
            </Button>
            </div>

            {errors.items && (
            <p className="text-red-500 text-sm mb-2">{errors.items}</p>
            )}

            <div className="space-y-3">
            {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">Artículo {index + 1}</span>
                    {formData.items.length > 1 && (
                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    )}
                </div>

                <div className="space-y-2">
                    <div>
                    <input
                        type="text"
                        placeholder="Descripción del artículo"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`item_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors[`item_${index}_description`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_description`]}</p>
                    )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                    <div>
                        <input
                        type="number"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        step="1"
                        />
                        {errors[`item_${index}_quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                        )}
                    </div>

                    <div>
                        <input
                        type="number"
                        placeholder="Precio Unitario"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.01"
                        />
                        {errors[`item_${index}_unitPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
                        )}
                    </div>
                    </div>

                    {item.quantity && item.unitPrice && (
                    <div className="text-right text-sm">
                        <span className="text-gray-600">Subtotal: </span>
                        <span className="font-semibold text-gray-900">
                        ${(parseFloat(item.quantity) * parseFloat(item.unitPrice)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    )}
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Totales */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (16%):</span>
                <span className="font-semibold text-gray-900">
                ${tax.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            <div className="flex justify-between text-lg border-t pt-2">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-blue-600">
                ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            </div>
        </div>

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
            placeholder="Observaciones adicionales sobre la venta..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={exceedsCredit}>
            Crear Venta
            </Button>
        </div>
        </div>
    );
};

export default SaleForm;
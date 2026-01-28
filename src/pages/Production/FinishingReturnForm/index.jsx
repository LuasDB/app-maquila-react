import React, { useState } from 'react' 
import { CheckCircle } from 'lucide-react' 
import Button from '@/components/common/Button' 
import Input from '@/components/common/Input' 

const FinishingReturnForm = ({ roll, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        pieces: '',
        notes: ''
    }) 

    const [errors, setErrors] = useState({}) 

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

        if (!formData.date) {
        newErrors.date = 'La fecha es requerida' 
        }

        if (!formData.pieces || parseInt(formData.pieces) <= 0) {
        newErrors.pieces = 'Las piezas deben ser mayores a 0' 
        }

        const maxPieces = roll.finishing.piecesPending 
        if (parseInt(formData.pieces) > maxPieces) {
        newErrors.pieces = `No puede recibir más de ${maxPieces} piezas pendientes` 
        }

        setErrors(newErrors) 
        return Object.keys(newErrors).length === 0 
    } 

    const handleSubmit = () => {
        if (validate()) {
        onSubmit(formData) 
        }
    } 

    const handleReceiveAll = () => {
        setFormData(prev => ({
        ...prev,
        pieces: roll.finishing.piecesPending.toString()
        })) 
        if (errors.pieces) {
        setErrors(prev => ({ ...prev, pieces: '' })) 
        }
    } 

    const newPiecesReturned = roll.finishing.piecesReturned + (parseInt(formData.pieces) || 0) 
    const newPiecesPending = roll.finishing.piecesPending - (parseInt(formData.pieces) || 0) 
    
    // Cálculos finales
    const totalPieces = newPiecesReturned 
    const piecesLost = roll.cutting.pieces - totalPieces 
    const costPerPiece = totalPieces > 0 ? roll.summary.totalInvested / totalPieces : 0 
    const efficiency = roll.cutting.pieces > 0 ? (totalPieces / roll.cutting.pieces) * 100 : 0 

    return (
        <div>
        {/* Información del Terminado */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-orange-900 mb-2">Estado de Terminado</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
                <span className="text-orange-700">Terminador:</span>
                <span className="ml-2 font-medium text-orange-900">{roll.finishing.finisherName}</span>
            </div>
            <div>
                <span className="text-orange-700">Entregadas:</span>
                <span className="ml-2 font-medium text-orange-900">{roll.finishing.piecesDelivered}</span>
            </div>
            <div>
                <span className="text-orange-700">Recibidas:</span>
                <span className="ml-2 font-medium text-green-700">{roll.finishing.piecesReturned}</span>
            </div>
            <div>
                <span className="text-orange-700">Pendientes:</span>
                <span className="ml-2 font-medium text-orange-700">{roll.finishing.piecesPending}</span>
            </div>
            </div>
        </div>

        {/* Historial de Entregas */}
        {roll.finishing.returns && roll.finishing.returns.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Entregas Anteriores</h4>
            <div className="space-y-2">
                {roll.finishing.returns.map((ret, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                    {new Date(ret.date).toLocaleDateString('es-MX')}
                    </span>
                    <span className="font-semibold text-gray-900">{ret.pieces} piezas</span>
                </div>
                ))}
            </div>
            </div>
        )}

        <div className="space-y-4">
            <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                Piezas Recibidas <span className="text-red-500">*</span>
                </label>
                <button
                type="button"
                onClick={handleReceiveAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                Recibir Todas ({roll.finishing.piecesPending})
                </button>
            </div>
            <input
                type="number"
                name="pieces"
                value={formData.pieces}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.pieces ? 'border-red-500' : 'border-gray-300'
                }`}
                min="1"
                max={roll.finishing.piecesPending}
            />
            {errors.pieces && (
                <p className="text-red-500 text-sm mt-1">{errors.pieces}</p>
            )}
            </div>

            <Input
            label="Fecha de Recepción"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
            />

            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas / Observaciones
            </label>
            <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Observaciones sobre la entrega (defectos, pérdidas, etc.)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Resumen Actualizado */}
            {formData.pieces && parseInt(formData.pieces) > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-900 mb-2">Después de esta Entrega</p>
                <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-green-700">Total Recibidas:</span>
                    <span className="font-semibold text-green-900">{newPiecesReturned}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-green-700">Pendientes:</span>
                    <span className="font-semibold text-orange-700">{newPiecesPending}</span>
                </div>
                {newPiecesPending === 0 && (
                    <div className="mt-2 pt-2 border-t border-green-300">
                    <p className="text-green-600 text-xs font-medium flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Terminado completado - Proceso finalizado
                    </p>
                    </div>
                )}
                </div>
            </div>
            )}

            {/* Resumen Final del Proceso Completo */}
            {formData.pieces && parseInt(formData.pieces) > 0 && newPiecesPending === 0 && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-blue-900">Resumen Final del Rollo</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded p-2">
                    <p className="text-xs text-blue-700 mb-1">Piezas Cortadas</p>
                    <p className="text-lg font-bold text-blue-900">{roll.cutting.pieces}</p>
                </div>
                <div className="bg-white rounded p-2">
                    <p className="text-xs text-green-700 mb-1">Piezas Finales</p>
                    <p className="text-lg font-bold text-green-900">{totalPieces}</p>
                </div>
                <div className="bg-white rounded p-2">
                    <p className="text-xs text-red-700 mb-1">Piezas Perdidas</p>
                    <p className="text-lg font-bold text-red-600">{piecesLost}</p>
                </div>
                <div className="bg-white rounded p-2">
                    <p className="text-xs text-blue-700 mb-1">Eficiencia</p>
                    <p className="text-lg font-bold text-blue-900">{efficiency.toFixed(1)}%</p>
                </div>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-300">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700">Costo por Pieza:</span>
                    <span className="text-xl font-bold text-blue-900">
                    ${costPerPiece.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-medium text-blue-700">Inversión Total:</span>
                    <span className="text-xl font-bold text-blue-900">
                    ${roll.summary.totalInvested.toLocaleString('es-MX')}
                    </span>
                </div>
                </div>
            </div>
            )}

            {/* Advertencia de pérdidas */}
            {formData.pieces && parseInt(formData.pieces) > 0 && piecesLost > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                ⚠️ <strong>Atención:</strong> Se perdieron {piecesLost} pieza(s) durante el proceso. 
                Asegúrate de documentar la razón en las notas.
                </p>
            </div>
            )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
            Cancelar
            </Button>
            <Button variant="success" onClick={handleSubmit}>
            {newPiecesPending === 0 ? 'Finalizar Proceso' : 'Registrar Entrega'}
            </Button>
        </div>
        </div>
    ) 
} 

export default FinishingReturnForm 
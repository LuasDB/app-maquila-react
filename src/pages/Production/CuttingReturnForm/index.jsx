import { useState } from "react"
import { AlertCircle } from "lucide-react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"

const CuttingReturnForm = ({ roll, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    pieces: "",
    notes: ""
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.date) newErrors.date = "La fecha es requerida"
    if (!formData.pieces || parseInt(formData.pieces) <= 0) newErrors.pieces = "Las piezas deben ser mayores a 0"
    const maxPieces = roll.cutting.piecesPending
    if (parseInt(formData.pieces) > maxPieces) newErrors.pieces = "No puede recibir mas de " + maxPieces + " piezas pendientes"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    console.log(formData)
    if (validate()) onSubmit(formData)
  }

  const handleReceiveAll = () => {
    setFormData(prev => ({ ...prev, pieces: roll.cutting.piecesPending.toString() }))
    if (errors.pieces) setErrors(prev => ({ ...prev, pieces: "" }))
  }

  const newPiecesReturned = roll.cutting.piecesReturned + (parseInt(formData.pieces) || 0)
  const newPiecesPending = roll.cutting.piecesPending - (parseInt(formData.pieces) || 0)

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-2">Estado del Corte</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-blue-700">Cortador:</span><span className="ml-2 font-medium text-blue-900">{roll.cutting.cutterName || "-"}</span></div>
          <div><span className="text-blue-700">Producto:</span><span className="ml-2 font-medium text-blue-900">{roll.cutting.productName || roll.cutting.productType}</span></div>
          <div><span className="text-blue-700">Solicitadas:</span><span className="ml-2 font-medium text-blue-900">{roll.cutting.pieces || roll.cutting.piecesDelivered}</span></div>
          <div><span className="text-blue-700">Recibidas:</span><span className="ml-2 font-medium text-green-700">{roll.cutting.piecesReturned}</span></div>
          <div><span className="text-blue-700">Pendientes:</span><span className="ml-2 font-medium text-orange-700">{roll.cutting.piecesPending}</span></div>
          <div><span className="text-blue-700">Talla:</span><span className="ml-2 font-medium text-blue-900">{roll.cutting.size}</span></div>
        </div>
      </div>

      {roll.cutting.returns && roll.cutting.returns.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Entregas Anteriores</h4>
          <div className="space-y-2">
            {roll.cutting.returns.map((ret, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">{new Date(ret.date).toLocaleDateString("es-MX")}</span>
                <span className="font-semibold text-gray-900">{ret.pieces} piezas</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Piezas Recibidas <span className="text-red-500">*</span></label>
            <button type="button" onClick={handleReceiveAll} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Recibir Todas ({roll.cutting.piecesPending})</button>
          </div>
          <input type="number" name="pieces" value={formData.pieces} onChange={handleChange} placeholder="0" min="1" max={roll.cutting.piecesPending} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 " + (errors.pieces ? "border-red-500" : "border-gray-300")} />
          {errors.pieces && <p className="text-red-500 text-sm mt-1">{errors.pieces}</p>}
        </div>

        <Input label="Fecha de Recepcion" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Observaciones sobre la entrega..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {formData.pieces && parseInt(formData.pieces) > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900 mb-2">Despues de esta Entrega</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-green-700">Total Recibidas:</span><span className="font-semibold text-green-900">{newPiecesReturned}</span></div>
              <div className="flex justify-between"><span className="text-green-700">Pendientes:</span><span className="font-semibold text-orange-700">{newPiecesPending}</span></div>
              {newPiecesPending === 0 && (
                <div className="mt-2 pt-2 border-t border-green-300"><p className="text-green-600 text-xs font-medium">Corte completado</p></div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button variant="success" onClick={handleSubmit}>Registrar Entrega</Button>
      </div>
    </div>
  )
}

export default CuttingReturnForm
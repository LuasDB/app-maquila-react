import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import Button from "@/components/common/Button"

const CloseStageForm = ({ roll, stage, onSubmit, onCancel }) => {
  const process = roll[stage]

  const stageLabels = {
    cutting: "Corte",
    sewing: "Maquila",
    laundry: "Lavanderia",
    finishing: "Terminado"
  }

  const delivered = stage === "cutting" ? (process.piecesRequested || process.piecesDelivered) : process.piecesDelivered
  const maxLost = delivered - process.piecesReturned

  const [formData, setFormData] = useState({
    reason: "",
    piecesLost: maxLost.toString()
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.reason.trim()) newErrors.reason = "El motivo es obligatorio"
    const lost = parseInt(formData.piecesLost) || 0
    if (lost < 0) newErrors.piecesLost = "No puede ser negativo"
    if (lost > maxLost) newErrors.piecesLost = "No puede superar " + maxLost + " (piezas pendientes)"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onSubmit(formData)
  }

  const piecesLostNum = parseInt(formData.piecesLost) || 0
  const unaccounted = maxLost - piecesLostNum

  return (
    <div>
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4 flex items-start">
        <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-900">Cerrar etapa de {stageLabels[stage]} manualmente</p>
          <p className="text-sm text-amber-700 mt-1">Esta accion no se puede deshacer. Las piezas pendientes se registraran como perdidas y solo las piezas ya recibidas pasaran a la siguiente etapa.</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Estado actual de {stageLabels[stage]}</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Entregadas</p>
            <p className="text-xl font-bold text-gray-900">{delivered}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Recibidas</p>
            <p className="text-xl font-bold text-green-600">{process.piecesReturned}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pendientes</p>
            <p className="text-xl font-bold text-orange-600">{process.piecesPending}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Piezas perdidas <span className="text-red-500">*</span></label>
          <input type="number" name="piecesLost" value={formData.piecesLost} onChange={handleChange} min="0" max={maxLost} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 " + (errors.piecesLost ? "border-red-500" : "border-gray-300")} />
          {errors.piecesLost && <p className="text-red-500 text-sm mt-1">{errors.piecesLost}</p>}
          <p className="text-xs text-gray-400 mt-1">De las {maxLost} piezas pendientes, cuantas se consideran perdidas</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del cierre <span className="text-red-500">*</span></label>
          <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Explica por que se cierra la etapa sin completar todas las piezas..." className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 " + (errors.reason ? "border-red-500" : "border-gray-300")} />
          {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">Resultado del cierre</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-blue-700">Piezas que pasan a la siguiente etapa:</span><span className="font-bold text-green-700">{process.piecesReturned}</span></div>
            <div className="flex justify-between"><span className="text-blue-700">Piezas perdidas:</span><span className="font-bold text-red-600">{piecesLostNum}</span></div>
            {unaccounted > 0 && <div className="flex justify-between"><span className="text-blue-700">Sin contabilizar:</span><span className="font-bold text-amber-600">{unaccounted}</span></div>}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button variant="danger" onClick={handleSubmit}>Cerrar Etapa</Button>
      </div>
    </div>
  )
}

export default CloseStageForm
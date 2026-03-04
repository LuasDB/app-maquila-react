import { useState, useEffect } from "react"
import { Plus, Trash2, GripVertical, AlertCircle } from "lucide-react"
import sizeService from "@/services/sizeService"
import Button from "@/components/common/Button"

const SizeManager = ({ onClose }) => {
  const [sizes, setSizes] = useState([])
  const [newSize, setNewSize] = useState("")
  const [batchInput, setBatchInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mode, setMode] = useState("list")

  useEffect(() => { loadSizes() }, [])

  const loadSizes = async () => {
    try {
      setLoading(true)
      const data = await sizeService.getAll()
      setSizes(data)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const handleAddOne = async () => {
    if (!newSize.trim()) return
    try {
      setError("")
      await sizeService.create({ label: newSize.trim() })
      setNewSize("")
      await loadSizes()
    } catch (err) { setError(err.message) }
  }

  const handleBatchAdd = async () => {
    if (!batchInput.trim()) return
    try {
      setError("")
      const sizesArr = batchInput.split(",").map(s => s.trim()).filter(Boolean)
      await sizeService.createMany(sizesArr)
      setBatchInput("")
      setMode("list")
      await loadSizes()
    } catch (err) { setError(err.message) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar esta talla?")) return
    try {
      setError("")
      await sizeService.delete(id)
      await loadSizes()
    } catch (err) { setError(err.message) }
  }

  const handleToggleActive = async (size) => {
    try {
      setError("")
      await sizeService.update(size._id, { active: !size.active })
      await loadSizes()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Cargando tallas...</div>

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode("list")} className={"px-3 py-1 rounded text-sm " + (mode === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700")}>Lista</button>
        <button onClick={() => setMode("batch")} className={"px-3 py-1 rounded text-sm " + (mode === "batch" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700")}>Carga masiva</button>
      </div>

      {mode === "batch" ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Ingresa las tallas separadas por comas (ej: 28, 30, 32, 34, 36)</p>
          <textarea
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="28, 30, 32, 34, 36, 38, 40, 42"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <Button variant="primary" onClick={handleBatchAdd}>Agregar todas</Button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddOne()}
              placeholder="Nueva talla (ej: 28, M, XL)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="primary" onClick={handleAddOne}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {sizes.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No hay tallas registradas. Agrega la primera.</p>
          ) : (
            <div className="space-y-1">
              {sizes.map((size) => (
                <div key={size._id} className={"flex items-center justify-between px-3 py-2 rounded-lg " + (size.active ? "bg-gray-50" : "bg-gray-100 opacity-60")}>
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className={"font-medium " + (size.active ? "text-gray-900" : "text-gray-400 line-through")}>{size.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(size)}
                      className={"text-xs px-2 py-1 rounded " + (size.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500")}
                    >
                      {size.active ? "Activa" : "Inactiva"}
                    </button>
                    <button onClick={() => handleDelete(size._id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  )
}

export default SizeManager

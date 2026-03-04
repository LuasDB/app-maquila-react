import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import sizeService from "@/services/sizeService"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import Select from "@/components/common/Select"

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "general",
    basePrice: product?.basePrice?.toString() || "",
    baseCost: product?.baseCost?.toString() || "",
    active: product?.active !== undefined ? product.active : true,
  })

  const [selectedSizes, setSelectedSizes] = useState(
    product?.sizes?.map(s => ({ sizeId: s.sizeId, label: s.label, price: s.price?.toString() || "", cost: s.cost?.toString() || "" })) || []
  )

  const [availableSizes, setAvailableSizes] = useState([])
  const [errors, setErrors] = useState({})
  const [loadingSizes, setLoadingSizes] = useState(true)
  const [useSamePrice, setUseSamePrice] = useState(true)

  const categoryOptions = [
    { value: "general", label: "General" },
    { value: "mezclilla", label: "Mezclilla" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "cargo", label: "Cargo" },
  ]

  useEffect(() => { loadSizes() }, [])

  const loadSizes = async () => {
    try {
      const data = await sizeService.getAll({ active: true })
      setAvailableSizes(data)
    } catch (err) { console.error(err) }
    finally { setLoadingSizes(false) }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleSizeToggle = (size) => {
    const exists = selectedSizes.find(s => s.sizeId === size._id)
    if (exists) {
      setSelectedSizes(prev => prev.filter(s => s.sizeId !== size._id))
    } else {
      setSelectedSizes(prev => [...prev, { sizeId: size._id, label: size.label, price: formData.basePrice || "", cost: formData.baseCost || "" }])
    }
    if (errors.sizes) setErrors(prev => ({ ...prev, sizes: "" }))
  }

  const handleSizePriceChange = (sizeId, field, value) => {
    setSelectedSizes(prev => prev.map(s => s.sizeId === sizeId ? { ...s, [field]: value } : s))
  }

  const handleSelectAll = () => {
    if (selectedSizes.length === availableSizes.length) {
      setSelectedSizes([])
    } else {
      setSelectedSizes(availableSizes.map(s => ({ sizeId: s._id, label: s.label, price: formData.basePrice || "", cost: formData.baseCost || "" })))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) newErrors.basePrice = "El precio es requerido"
    if (!formData.baseCost || parseFloat(formData.baseCost) < 0) newErrors.baseCost = "El costo es requerido"
    if (selectedSizes.length === 0) newErrors.sizes = "Selecciona al menos una talla"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const sizesToSend = selectedSizes.map(s => ({
      sizeId: s.sizeId,
      price: useSamePrice ? parseFloat(formData.basePrice) : parseFloat(s.price || formData.basePrice),
      cost: useSamePrice ? parseFloat(formData.baseCost) : parseFloat(s.cost || formData.baseCost)
    }))
    onSubmit({ name: formData.name, description: formData.description, category: formData.category, basePrice: parseFloat(formData.basePrice), baseCost: parseFloat(formData.baseCost), active: formData.active, sizes: sizesToSend })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombre del Modelo" name="name" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="Ej: Slim Fit Mezclilla" />
        <Select label="Categoria" name="category" value={formData.category} onChange={handleChange} options={categoryOptions} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripcion del modelo..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Precio Base (venta)" name="basePrice" type="number" value={formData.basePrice} onChange={handleChange} error={errors.basePrice} required placeholder="0.00" />
        <Input label="Costo Base (produccion)" name="baseCost" type="number" value={formData.baseCost} onChange={handleChange} error={errors.baseCost} required placeholder="0.00" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Tallas disponibles <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" checked={useSamePrice} onChange={(e) => setUseSamePrice(e.target.checked)} className="w-3 h-3" />
              Mismo precio para todas
            </label>
            <button type="button" onClick={handleSelectAll} className="text-xs text-blue-600 hover:text-blue-800">
              {selectedSizes.length === availableSizes.length ? "Deseleccionar todas" : "Seleccionar todas"}
            </button>
          </div>
        </div>

        {errors.sizes && <p className="text-red-500 text-sm mb-2">{errors.sizes}</p>}

        {loadingSizes ? (
          <p className="text-gray-500 text-sm">Cargando tallas...</p>
        ) : availableSizes.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700">No hay tallas registradas. Ve a gestionar tallas primero.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => {
                const isSelected = selectedSizes.some(s => s.sizeId === size._id)
                return (
                  <button key={size._id} type="button" onClick={() => handleSizeToggle(size)}
                    className={"px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors " + (isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")}>
                    {size.label}
                  </button>
                )
              })}
            </div>

            {!useSamePrice && selectedSizes.length > 0 && (
              <div className="mt-3 border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Talla</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Precio</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Costo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedSizes.map(s => (
                      <tr key={s.sizeId}>
                        <td className="px-3 py-2 font-medium">{s.label}</td>
                        <td className="px-3 py-2"><input type="number" value={s.price} onChange={(e) => handleSizePriceChange(s.sizeId, "price", e.target.value)} className="w-24 px-2 py-1 border border-gray-300 rounded text-sm" placeholder={formData.basePrice} /></td>
                        <td className="px-3 py-2"><input type="number" value={s.cost} onChange={(e) => handleSizePriceChange(s.sizeId, "cost", e.target.value)} className="w-24 px-2 py-1 border border-gray-300 rounded text-sm" placeholder={formData.baseCost} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-xs text-gray-400">{selectedSizes.length} talla(s) seleccionada(s)</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <span className="text-sm text-gray-700">Producto activo</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>{product ? "Actualizar" : "Crear"} Producto</Button>
      </div>
    </div>
  )
}

export default ProductForm

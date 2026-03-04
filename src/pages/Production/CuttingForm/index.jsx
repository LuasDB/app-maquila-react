import { useState, useEffect } from "react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import productService from "@/services/productService"

const CuttingForm = ({ roll, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    cutterName: "",
    cutterCost: "",
    pieces: "",
    productId: "",
    productName: "",
    productType: "",
    size: "",
    notes: ""
  })

  const [errors, setErrors] = useState({})
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      const data = await productService.getAll({ active: true })
      setProducts(data)
    } catch (err) { console.error(err) }
    finally { setLoadingProducts(false) }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleProductChange = (productId) => {
    const prod = products.find(p => p._id === productId)
    setSelectedProduct(prod || null)
    setFormData(prev => ({
      ...prev,
      productId: productId,
      productName: prod ? prod.name : "",
      productType: prod ? prod.name : "",
      size: ""
    }))
    if (errors.productId) setErrors(prev => ({ ...prev, productId: "" }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.date) newErrors.date = "La fecha es requerida"
    if (!formData.cutterName.trim()) newErrors.cutterName = "El nombre del cortador es requerido"
    if (!formData.pieces || parseInt(formData.pieces) <= 0) newErrors.pieces = "Las piezas deben ser mayor a 0"
    if (!formData.productId) newErrors.productId = "Selecciona un producto"
    if (!formData.size) newErrors.size = "Selecciona una talla"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    console.log(formData)
    if (validate()) onSubmit({...formData,updatedAt: new Date().toISOString()})
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-2">Informacion del Rollo</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-blue-700">Folio:</span><span className="ml-2 font-medium text-blue-900">{roll.folio}</span></div>
          <div><span className="text-blue-700">Tipo de Tela:</span><span className="ml-2 font-medium text-blue-900">{roll.fabric.type}</span></div>
          <div><span className="text-blue-700">Metros:</span><span className="ml-2 font-medium text-blue-900">{roll.fabric.meters} m</span></div>
          <div><span className="text-blue-700">Costo:</span><span className="ml-2 font-medium text-blue-900">${roll.fabric.cost.toLocaleString("es-MX")}</span></div>
        </div>
      </div>

      <div className="space-y-4">
        <Input label="Fecha de Corte" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nombre del Cortador" name="cutterName" value={formData.cutterName} onChange={handleChange} error={errors.cutterName} required placeholder="Quien realiza el corte" />
          <Input label="Costo del Corte" name="cutterCost" type="number" value={formData.cutterCost} onChange={handleChange} error={errors.cutterCost} placeholder="0.00" />
        </div>

        <Input label="Piezas Solicitadas" name="pieces" type="number" value={formData.pieces} onChange={handleChange} error={errors.pieces} required placeholder="Cantidad de piezas a cortar" />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Producto <span className="text-red-500">*</span></label>
          <select value={formData.productId} onChange={(e) => handleProductChange(e.target.value)} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 " + (errors.productId ? "border-red-500" : "border-gray-300")}>
            <option value="">Seleccionar producto...</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.category})</option>)}
          </select>
          {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Talla <span className="text-red-500">*</span></label>
          <select name="size" value={formData.size} onChange={handleChange} disabled={!selectedProduct} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed " + (errors.size ? "border-red-500" : "border-gray-300")}>
            <option value="">Seleccionar talla...</option>
            {selectedProduct?.sizes?.map((s, i) => <option key={i} value={s.label}>{s.label}</option>)}
          </select>
          {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Observaciones sobre el corte..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Registrar Corte</Button>
      </div>
    </div>
  )
}

export default CuttingForm
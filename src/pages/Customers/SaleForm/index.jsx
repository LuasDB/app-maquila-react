import { useState, useEffect } from "react"
import { Plus, Trash2, AlertCircle, ChevronDown } from "lucide-react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import Select from "@/components/common/Select"
import productService from "@/services/productService"

const SaleForm = ({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: customer._id,
    date: new Date().toISOString().split("T")[0],
    paymentType: "credit",
    notes: "",
    items: []
  })

  const [errors, setErrors] = useState({})
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Estado para el selector de producto a agregar
  const [selectedProductId, setSelectedProductId] = useState("")
  const [selectedSizeIdx, setSelectedSizeIdx] = useState("")
  const [addQty, setAddQty] = useState("1")
  const [addPrice, setAddPrice] = useState("")

  const paymentTypeOptions = [
    { value: "cash", label: "Contado" },
    { value: "credit", label: "Credito" }
  ]

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      const data = await productService.getAll({ active: true })
      setProducts(data)
    } catch (err) { console.error(err) }
    finally { setLoadingProducts(false) }
  }

  const selectedProduct = products.find(p => p._id === selectedProductId)

  const handleProductChange = (productId) => {
    setSelectedProductId(productId)
    setSelectedSizeIdx("")
    const prod = products.find(p => p._id === productId)
    if (prod) {
      setAddPrice(prod.basePrice.toString())
    } else {
      setAddPrice("")
    }
  }

  const handleSizeChange = (idx) => {
    setSelectedSizeIdx(idx)
    if (selectedProduct && idx !== "") {
      const size = selectedProduct.sizes[parseInt(idx)]
      if (size && size.price) {
        setAddPrice(size.price.toString())
      }
    }
  }

  const addItem = () => {
    if (!selectedProductId || selectedSizeIdx === "" || !addQty || !addPrice) return
    const prod = products.find(p => p._id === selectedProductId)
    if (!prod) return
    const size = prod.sizes[parseInt(selectedSizeIdx)]
    if (!size) return

    const description = prod.name + " - Talla " + size.label
    const newItem = {
      productId: prod._id,
      productName: prod.name,
      sizeLabel: size.label,
      sizeId: size.sizeId,
      description,
      quantity: addQty,
      unitPrice: addPrice
    }

    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }))
    // Reset selector
    setSelectedProductId("")
    setSelectedSizeIdx("")
    setAddQty("1")
    setAddPrice("")
    if (errors.items) setErrors(prev => ({ ...prev, items: "" }))
  }

  const removeItem = (index) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))
  }

  const handleItemPriceChange = (index, value) => {
    const newItems = [...formData.items]
    newItems[index].unitPrice = value
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const handleItemQtyChange = (index, value) => {
    const newItems = [...formData.items]
    newItems[index].quantity = value
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0))
    }, 0)
    const tax = subtotal * 0.16
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const { subtotal, tax, total } = calculateTotals()
  const availableCredit = customer.creditLimit - (customer.currentBalance || customer.currentBalace || 0)
  const exceedsCredit = formData.paymentType === "credit" && total > availableCredit

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.date) newErrors.date = "La fecha es requerida"
    if (!formData.paymentType) newErrors.paymentType = "El tipo de pago es requerido"
    if (formData.items.length === 0) newErrors.items = "Debe agregar al menos un articulo"
    if (exceedsCredit) newErrors.credit = "La venta excede el credito disponible"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const submitData = {
      ...formData,
      items: formData.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    }
    onSubmit(submitData)
  }

  const fmt = (n) => Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-2">Informacion del Cliente</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-blue-700">Cliente:</span><span className="ml-2 font-medium text-blue-900">{customer.name}</span></div>
          <div><span className="text-blue-700">Limite de Credito:</span><span className="ml-2 font-medium text-blue-900">${fmt(customer.creditLimit)}</span></div>
          <div><span className="text-blue-700">Saldo Actual:</span><span className="ml-2 font-medium text-blue-900">${fmt(customer.currentBalance || customer.currentBalace || 0)}</span></div>
          <div><span className="text-blue-700">Credito Disponible:</span><span className="ml-2 font-medium text-green-700">${fmt(availableCredit)}</span></div>
        </div>
      </div>

      {exceedsCredit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Credito insuficiente</p>
            <p className="text-sm text-red-700">La venta excede el credito disponible. Ajuste los montos o seleccione pago de contado.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Fecha de Venta" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required />
        <Select label="Tipo de Pago" name="paymentType" value={formData.paymentType} onChange={handleChange} options={paymentTypeOptions} error={errors.paymentType} required />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Agregar Articulo</label>
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Producto</label>
              <select value={selectedProductId} onChange={(e) => handleProductChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Seleccionar producto...</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} - ${fmt(p.basePrice)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Talla</label>
              <select value={selectedSizeIdx} onChange={(e) => handleSizeChange(e.target.value)} disabled={!selectedProduct} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed">
                <option value="">Seleccionar talla...</option>
                {selectedProduct?.sizes?.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
              <input type="number" value={addQty} onChange={(e) => setAddQty(e.target.value)} min="1" step="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Precio Unitario <span className="text-gray-400">(editable)</span></label>
              <input type="number" value={addPrice} onChange={(e) => setAddPrice(e.target.value)} min="0" step="0.01" placeholder="0.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <Button variant="primary" onClick={addItem} disabled={!selectedProductId || selectedSizeIdx === "" || !addQty || !addPrice} className="w-full">
                <Plus className="w-4 h-4 mr-1 inline" />Agregar
              </Button>
            </div>
          </div>
          {selectedProduct && addPrice && parseFloat(addPrice) !== selectedProduct.basePrice && (
            <p className="text-xs text-amber-600">Precio modificado. Precio sugerido: ${fmt(selectedProduct.basePrice)}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Articulos de la venta <span className="text-red-500">*</span></label>
          <span className="text-xs text-gray-500">{formData.items.length} articulo(s)</span>
        </div>

        {errors.items && <p className="text-red-500 text-sm mb-2">{errors.items}</p>}

        {formData.items.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400 text-sm">Selecciona productos arriba para agregarlos a la venta</p>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                  </div>
                  <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 items-center">
                  <div>
                    <label className="block text-xs text-gray-400">Cantidad</label>
                    <input type="number" value={item.quantity} onChange={(e) => handleItemQtyChange(index, e.target.value)} min="1" className="w-full px-2 py-1 border border-gray-200 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Precio Unit.</label>
                    <input type="number" value={item.unitPrice} onChange={(e) => handleItemPriceChange(index, e.target.value)} min="0" step="0.01" className="w-full px-2 py-1 border border-gray-200 rounded text-sm" />
                  </div>
                  <div className="text-right">
                    <label className="block text-xs text-gray-400">Subtotal</label>
                    <span className="text-sm font-semibold text-gray-900">${fmt((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal:</span><span className="font-semibold text-gray-900">${fmt(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-600">IVA (16%):</span><span className="font-semibold text-gray-900">${fmt(tax)}</span></div>
          <div className="flex justify-between text-lg border-t pt-2"><span className="font-semibold text-gray-900">Total:</span><span className="font-bold text-blue-600">${fmt(total)}</span></div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Observaciones adicionales sobre la venta..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={exceedsCredit}>Crear Venta</Button>
      </div>
    </div>
  )
}

export default SaleForm
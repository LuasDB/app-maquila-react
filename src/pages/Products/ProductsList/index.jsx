import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, Eye, Package, AlertCircle, Ruler, Tag, DollarSign } from "lucide-react"
import productService from "@/services/productService"
import Button from "@/components/common/Button"
import Modal from "@/components/common/Modal"
import ProductForm from "../ProductForm"
import SizeManager from "../SizeManager"

const ProductsList = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => { loadProducts() }, [])

  useEffect(() => { filterProducts() }, [products, searchTerm, filterCategory])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const filterProducts = () => {
    let filtered = [...products]
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory)
    }
    setFilteredProducts(filtered)
  }

  const handleCreate = () => { setSelectedProduct(null); setIsModalOpen(true) }

  const handleEdit = (product) => { setSelectedProduct(product); setIsModalOpen(true) }

  const handleDelete = async (id) => {
    if (!window.confirm("Desactivar este producto?")) return
    try {
      await productService.delete(id)
      await loadProducts()
    } catch (err) { alert("Error: " + err.message) }
  }

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct._id, formData)
      } else {
        await productService.create(formData)
      }
      setIsModalOpen(false)
      await loadProducts()
    } catch (err) { alert("Error: " + err.message) }
  }

  const getCategoryBadge = (cat) => {
    const badges = { general: "bg-gray-100 text-gray-800", mezclilla: "bg-blue-100 text-blue-800", casual: "bg-green-100 text-green-800", formal: "bg-purple-100 text-purple-800", cargo: "bg-yellow-100 text-yellow-800" }
    const labels = { general: "General", mezclilla: "Mezclilla", casual: "Casual", formal: "Formal", cargo: "Cargo" }
    return <span className={"px-2 py-1 text-xs font-semibold rounded-full " + (badges[cat] || badges.general)}>{labels[cat] || cat}</span>
  }

  const activeProducts = products.filter(p => p.active).length
  const totalProducts = products.length

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-600">Cargando productos...</div></div>

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
        <div>
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button onClick={loadProducts} className="mt-2 text-sm text-red-700 underline">Intentar de nuevo</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Productos</div>
          <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Activos</div>
          <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Inactivos</div>
          <div className="text-2xl font-bold text-red-600">{totalProducts - activeProducts}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Buscar por nombre o folio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las categorias</option>
              <option value="mezclilla">Mezclilla</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="cargo">Cargo</option>
              <option value="general">General</option>
            </select>
            <Button variant="outline" onClick={() => setIsSizeModalOpen(true)}>
              <Ruler className="w-4 h-4 mr-2 inline" />Tallas
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              <Plus className="w-5 h-5 mr-2 inline" />Nuevo Producto
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tallas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No se encontraron productos</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.folio}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getCategoryBadge(product.category)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes?.slice(0, 5).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{s.label}</span>
                        ))}
                        {product.sizes?.length > 5 && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">+{product.sizes.length - 5}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${Number(product.basePrice).toLocaleString("es-MX")}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${Number(product.baseCost).toLocaleString("es-MX")}</td>
                    <td className="px-6 py-4">
                      <span className={"px-2 py-1 text-xs font-semibold rounded-full " + (product.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")}>
                        {product.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900"><Edit2 className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No se encontraron productos</div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.folio}</p>
                </div>
                {getCategoryBadge(product.category)}
              </div>
              <div className="flex flex-wrap gap-1">
                {product.sizes?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{s.label}</span>
                ))}
              </div>
              <div className="flex justify-between text-sm">
                <span><strong>Precio:</strong> ${Number(product.basePrice).toLocaleString("es-MX")}</span>
                <span><strong>Costo:</strong> ${Number(product.baseCost).toLocaleString("es-MX")}</span>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(product)}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(product._id)}>Eliminar</Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedProduct ? "Editar Producto" : "Nuevo Producto"} size="xl">
        <ProductForm product={selectedProduct} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isSizeModalOpen} onClose={() => setIsSizeModalOpen(false)} title="Gestionar Tallas" size="md">
        <SizeManager onClose={() => setIsSizeModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default ProductsList

import { useNavigate } from "react-router-dom"
import { X, Users, UserCircle, Package, ShoppingCart, FileText, LogOut, Home, Tag } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const Sidebar = ({ isOpen, toggleSidebar, activeModule }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "usuarios", label: "Usuarios", icon: Users, path: "/usuarios" },
    { id: "clientes", label: "Clientes", icon: UserCircle, path: "/clientes" },
    { id: "productos", label: "Productos", icon: Tag, path: "/productos" },
    { id: "maquila", label: "Maquila", icon: Package, path: "/maquila" },
    { id: "ventas", label: "Ventas", icon: ShoppingCart, path: "/ventas" },
    { id: "reportes", label: "Reportes", icon: FileText, path: "/reportes" },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    if (window.innerWidth < 1024) toggleSidebar()
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar} />}
      <aside className={"fixed top-0 left-0 h-full bg-gray-900 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out " + (isOpen ? "translate-x-0" : "-translate-x-full") + " lg:translate-x-0"}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-400" />
              <span className="font-bold text-lg">Maquila System</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-semibold">{user.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role || user.rol}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button key={item.id} onClick={() => handleNavigation(item.path)}
                  className={"w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors cursor-pointer " + (activeModule === item.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white")}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-2 rounded text-gray-300 hover:bg-red-600 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
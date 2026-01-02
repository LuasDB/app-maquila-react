import { UserCircle, Package, ShoppingCart, FileText } from 'lucide-react'

const Dashboard = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-blue-100 text-sm">Órdenes Activas</p>
                <p className="text-3xl font-bold mt-2">24</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
            </div>
        </div>
        
        <div className="bg-green-500 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-green-100 text-sm">Ventas del Mes</p>
                <p className="text-3xl font-bold mt-2">$125,500</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-green-200" />
            </div>
        </div>
        
        <div className="bg-yellow-500 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-yellow-100 text-sm">Por Cobrar</p>
                <p className="text-3xl font-bold mt-2">$45,200</p>
            </div>
            <FileText className="w-12 h-12 text-yellow-200" />
            </div>
        </div>
        
        <div className="bg-purple-500 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-purple-100 text-sm">Clientes Activos</p>
                <p className="text-3xl font-bold mt-2">48</p>
            </div>
            <UserCircle className="w-12 h-12 text-purple-200" />
            </div>
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Órdenes Recientes</h3>
            <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                    <p className="font-medium">Orden #{1000 + i}</p>
                    <p className="text-sm text-gray-600">Cliente Demo {i}</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    En Proceso
                </span>
                </div>
            ))}
            </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Procesos Activos</h3>
            <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Corte</span>
                <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <span className="text-sm font-medium">75%</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Maquila</span>
                <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <span className="text-sm font-medium">60%</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Lavandería</span>
                <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <span className="text-sm font-medium">45%</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Terminado</span>
                <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
                <span className="text-sm font-medium">30%</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
)

export default Dashboard
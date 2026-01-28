import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LogIn,AlertCircle } from 'lucide-react'

const Login = ()=>{
    const navigate = useNavigate()
    const { login } = useAuth()
    const [formData,setFormData]=useState({
        email:'',
        password:''
    })
    const [error,setError]=useState('')
    const [loading,setLoading] = useState(false)

    const handleChange = (e)=>{
        const { name,value} = e.target

        setFormData({...formData,
            [name]:value
        })
        setError('')
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(formData.email,formData.password)
            navigate('/dashboard')
        } catch (error) {
            setError(error.message || 'Error al iniciar sesión')
        }finally{
            setLoading(false)
        }
    }


    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Maquila System</h1>
                <p className="text-gray-600">Ingresa tus credenciales</p>
                </div>

                {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
                )}

                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                    </label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                    </label>
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                    <span>Cargando...</span>
                    ) : (
                    <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Iniciar Sesión
                    </>
                    )}
                </button>
                </div>
            </div>
        </div>
    )
}

export default Login
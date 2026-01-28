import React, { useState, useEffect } from 'react' 
import { Scissors, Shirt, Droplet, Sparkles, CheckCircle, Clock, Package, AlertCircle, Calendar } from 'lucide-react' 
import productionService from '@/services/productionService' 
import Button from '@/components/common/Button' 
import Modal from '@/components/common/Modal' 
import CuttingForm from '../CuttingForm' 
import SewingForm from '../SewingForm' 
import SewingReturnForm from '../SewingReturnForm' 
import LaundryForm from '../LaundryForm' 
import LaundryReturnForm from '../LaundryReturnForm' 
import FinishingForm from '../FinishingForm' 
import FinishingReturnForm from '../FinishingReturnForm' 

const RollDetail = ({ rollId, onClose, onUpdate }) => {
    const [roll, setRoll] = useState(null) 
    const [loading, setLoading] = useState(true) 
    const [activeModal, setActiveModal] = useState(null) 

    useEffect(() => {
        loadRoll() 
    }, [rollId]) 

    const loadRoll = async () => {
        try {
        setLoading(true) 
        const response = await productionService.getById(rollId) 
        setRoll(response.data) 
        } catch (error) {
        console.error('Error al cargar rollo:', error) 
        } finally {
        setLoading(false) 
        }
    } 

    const handleProcessSubmit = async (processType, data) => {
        try {
        switch (processType) {
            case 'cutting':
            await productionService.registerCutting(rollId, data) 
            break 
            case 'sewing':
            await productionService.registerSewing(rollId, data) 
            break 
            case 'sewingReturn':
            await productionService.registerSewingReturn(rollId, data) 
            break 
            case 'laundry':
            await productionService.registerLaundry(rollId, data) 
            break 
            case 'laundryReturn':
            await productionService.registerLaundryReturn(rollId, data) 
            break 
            case 'finishing':
            await productionService.registerFinishing(rollId, data) 
            break 
            case 'finishingReturn':
            await productionService.registerFinishingReturn(rollId, data) 
            break 
            default:
            break 
        }
        setActiveModal(null) 
        await loadRoll() 
        onUpdate() 
        } catch (error) {
        alert('Error: ' + error.message) 
        }
    } 

    if (loading || !roll) {
        return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Cargando...</div>
        </div>
        ) 
    }

    const getProcessStatus = (process) => {
        if (process.completed) return 'completed' 
        if (process.piecesDelivered > 0) return 'in_progress' 
        return 'pending' 
    } 

    const ProcessCard = ({ icon: Icon, title, process, processType, canStart, onAction }) => {
        const status = getProcessStatus(process) 
        
        const statusColors = {
        pending: 'bg-gray-100 border-gray-300',
        in_progress: 'bg-blue-50 border-blue-300',
        completed: 'bg-green-50 border-green-300'
        } 

        const statusIcons = {
        pending: Clock,
        in_progress: Clock,
        completed: CheckCircle
        } 

        const StatusIcon = statusIcons[status] 

        return (
        <div className={`border-2 rounded-lg p-4 ${statusColors[status]}`}>
            <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
                <Icon className={`w-6 h-6 ${
                status === 'completed' ? 'text-green-600' : 
                status === 'in_progress' ? 'text-blue-600' : 
                'text-gray-400'
                }`} />
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <StatusIcon className={`w-5 h-5 ${
                status === 'completed' ? 'text-green-600' : 
                status === 'in_progress' ? 'text-blue-600' : 
                'text-gray-400'
            }`} />
            </div>

            {status === 'pending' ? (
            <div className="text-sm text-gray-600 mb-3">
                Sin iniciar
            </div>
            ) : (
            <div className="space-y-2 text-sm mb-3">
                {processType === 'cutting' && process.completed && (
                <>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Piezas:</span>
                    <span className="font-semibold text-gray-900">{process.pieces}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Producto:</span>
                    <span className="font-semibold text-gray-900">{process.productType}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Talla:</span>
                    <span className="font-semibold text-gray-900">{process.size}</span>
                    </div>
                </>
                )}

                {processType !== 'cutting' && process.piecesDelivered > 0 && (
                <>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Proveedor:</span>
                    <span className="font-semibold text-gray-900 text-xs">
                        {process.seamstress || process.laundryName || process.finisherName}
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Entregadas:</span>
                    <span className="font-semibold text-gray-900">{process.piecesDelivered}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Recibidas:</span>
                    <span className={`font-semibold ${
                        process.completed ? 'text-green-600' : 'text-blue-600'
                    }`}>
                        {process.piecesReturned}
                    </span>
                    </div>
                    {process.piecesPending > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Pendientes:</span>
                        <span className="font-semibold text-orange-600">{process.piecesPending}</span>
                    </div>
                    )}
                    <div className="flex justify-between">
                    <span className="text-gray-600">Costo:</span>
                    <span className="font-semibold text-gray-900">
                        ${process.totalCost.toLocaleString('es-MX')}
                    </span>
                    </div>
                </>
                )}
            </div>
            )}

            {onAction && canStart && (
            <Button
                variant={status === 'pending' ? 'primary' : status === 'in_progress' ? 'success' : 'outline'}
                onClick={onAction}
                className="w-full text-sm"
            >
                {status === 'pending' 
                ? 'Iniciar Proceso' 
                : status === 'in_progress' 
                    ? 'Registrar Entrega' 
                    : 'Ver Detalles'
                }
            </Button>
            )}

            {/* Mostrar entregas parciales */}
            {processType !== 'cutting' && process.returns && process.returns.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs font-medium text-gray-700 mb-2">Entregas:</p>
                <div className="space-y-1">
                {process.returns.map((ret, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-600">
                        {new Date(ret.date).toLocaleDateString('es-MX')}
                    </span>
                    <span className="font-semibold text-gray-900">{ret.pieces} pzas</span>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
        ) 
    } 

    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold">{roll.folio}</h2>
                <p className="text-blue-100 mt-1">{roll.fabric.type}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-blue-100">Inversión Total</p>
                <p className="text-3xl font-bold">${roll.summary.totalInvested.toLocaleString('es-MX')}</p>
            </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
                <p className="text-xs text-blue-100">Metros</p>
                <p className="text-lg font-semibold">{roll.fabric.meters} m</p>
            </div>
            <div>
                <p className="text-xs text-blue-100">Costo Rollo</p>
                <p className="text-lg font-semibold">${roll.fabric.cost.toLocaleString('es-MX')}</p>
            </div>
            <div>
                <p className="text-xs text-blue-100">Piezas Finales</p>
                <p className="text-lg font-semibold">{roll.summary.totalPieces || '-'}</p>
            </div>
            <div>
                <p className="text-xs text-blue-100">Costo/Pieza</p>
                <p className="text-lg font-semibold">
                {roll.summary.costPerPiece > 0 
                    ? `$${roll.summary.costPerPiece.toFixed(2)}`
                    : '-'
                }
                </p>
            </div>
            </div>
        </div>

        {/* Timeline de Procesos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProcessCard
            icon={Scissors}
            title="1. Corte"
            process={roll.cutting}
            processType="cutting"
            canStart={true}
            onAction={() => !roll.cutting.completed && setActiveModal('cutting')}
            />

            <ProcessCard
            icon={Shirt}
            title="2. Maquila"
            process={roll.sewing}
            processType="sewing"
            canStart={roll.cutting.completed}
            onAction={() => {
                if (roll.sewing.piecesDelivered === 0) {
                setActiveModal('sewing') 
                } else if (!roll.sewing.completed) {
                setActiveModal('sewingReturn') 
                }
            }}
            />

            <ProcessCard
            icon={Droplet}
            title="3. Lavandería"
            process={roll.laundry}
            processType="laundry"
            canStart={roll.sewing.completed}
            onAction={() => {
                if (roll.laundry.piecesDelivered === 0) {
                setActiveModal('laundry') 
                } else if (!roll.laundry.completed) {
                setActiveModal('laundryReturn') 
                }
            }}
            />

            <ProcessCard
            icon={Sparkles}
            title="4. Terminado"
            process={roll.finishing}
            processType="finishing"
            canStart={roll.laundry.completed}
            onAction={() => {
                if (roll.finishing.piecesDelivered === 0) {
                setActiveModal('finishing') 
                } else if (!roll.finishing.completed) {
                setActiveModal('finishingReturn') 
                }
            }}
            />
        </div>

        {/* Resumen Final */}
        {roll.summary.currentStatus === 'completed' && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-900">Proceso Completado</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                <p className="text-sm text-green-700">Piezas Cortadas</p>
                <p className="text-2xl font-bold text-green-900">{roll.cutting.pieces}</p>
                </div>
                <div>
                <p className="text-sm text-green-700">Piezas Finales</p>
                <p className="text-2xl font-bold text-green-900">{roll.summary.totalPieces}</p>
                </div>
                <div>
                <p className="text-sm text-green-700">Piezas Perdidas</p>
                <p className="text-2xl font-bold text-red-600">{roll.summary.piecesLost}</p>
                </div>
                <div>
                <p className="text-sm text-green-700">Eficiencia</p>
                <p className="text-2xl font-bold text-green-900">
                    {((roll.summary.totalPieces / roll.cutting.pieces) * 100).toFixed(1)}%
                </p>
                </div>
            </div>
            </div>
        )}

        {/* Información del Rollo */}
        <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Información del Rollo</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
                <span className="text-gray-600">Proveedor:</span>
                <span className="ml-2 font-medium text-gray-900">{roll.fabric.supplier || '-'}</span>
            </div>
            <div>
                <span className="text-gray-600">Fecha de Compra:</span>
                <span className="ml-2 font-medium text-gray-900">
                {new Date(roll.fabric.purchaseDate).toLocaleDateString('es-MX')}
                </span>
            </div>
            <div>
                <span className="text-gray-600">Estado Actual:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">
                {roll.summary.currentStatus}
                </span>
            </div>
            <div>
                <span className="text-gray-600">Ubicación:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">
                {roll.summary.currentLocation}
                </span>
            </div>
            </div>
        </div>

        {/* Modales de Procesos */}
        <Modal
            isOpen={activeModal === 'cutting'}
            onClose={() => setActiveModal(null)}
            title="Registrar Corte"
            size="md"
        >
            <CuttingForm
            roll={roll}
            onSubmit={(data) => handleProcessSubmit('cutting', data)}
            onCancel={() => setActiveModal(null)}
            />
        </Modal>

        <Modal
            isOpen={activeModal === 'sewing'}
            onClose={() => setActiveModal(null)}
            title="Registrar Salida a Maquila"
            size="md"
        >
            <SewingForm
            roll={roll}
            onSubmit={(data) => handleProcessSubmit('sewing', data)}
            onCancel={() => setActiveModal(null)}
            />
        </Modal>

        <Modal
            isOpen={activeModal === 'sewingReturn'}
            onClose={() => setActiveModal(null)}
            title="Registrar Entrega de Maquila"
            size="md"
        >
            <SewingReturnForm
            roll={roll}
            onSubmit={(data) => handleProcessSubmit('sewingReturn', data)}
            onCancel={() => setActiveModal(null)}
            />
        </Modal>

        <Modal
            isOpen={activeModal === 'laundry'}
            onClose={() => setActiveModal(null)}
            title="Registrar Salida a Lavandería"
            size="md"
        >
            <LaundryForm
            roll={roll}
            onSubmit={(data) => handleProcessSubmit('laundry', data)}
            onCancel={() => setActiveModal(null)}
            />
        </Modal>

        <Modal
            isOpen={activeModal === 'laundryReturn'}
            onClose={() => setActiveModal(null)}
            title="Registrar Entrega de Lavandería"
            size="md"
        >
            <LaundryReturnForm
            roll={roll}
            onSubmit={(data) => handleProcessSubmit('laundryReturn', data)}
            onCancel={() => setActiveModal(null)}
            />
        </Modal>

        <Modal
            isOpen={activeModal === 'finishing'}
            onClose={() => setActiveModal(null)}
            title="Registrar Salida a Terminado"
            size="md"
        >
            <FinishingForm
            roll={roll}
            onSubmit={(data) => handleProcessSubmit('finishing', data)}
            onCancel={() => setActiveModal(null)}
            />
        </Modal>

        <Modal
            isOpen={activeModal === 'finishingReturn'}
            onClose={() => setActiveModal(null)}
            title="Registrar Entrega de Terminado"
            size="md"
        >
            <FinishingReturnForm
            roll={roll}
            onSubmit={(data) => handleProcessSubmit('finishingReturn', data)}
            onCancel={() => setActiveModal(null)}
            />
        </Modal>
        </div>
    ) 
} 

export default RollDetail 
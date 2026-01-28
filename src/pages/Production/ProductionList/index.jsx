    import React, { useState, useEffect } from 'react';
    import { Search, Plus, Eye, Edit2, Trash2, Filter, TrendingUp, Package, DollarSign, Layers } from 'lucide-react';
    import productionService from '@/services/productionService';
    import Button from '@/components/common/Button';
    import Modal from '@/components/common/Modal';
    import RollForm from '../RollForm';
    import RollDetail from '../RollDetail';

    const ProductionList = () => {
    const [rolls, setRolls] = useState([]);
    const [filteredRolls, setFilteredRolls] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        totalInvestment: 0,
        totalPieces: 0,
        avgCostPerPiece: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterProductType, setFilterProductType] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRoll, setSelectedRoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRolls();
        loadStats();
    }, []);

    useEffect(() => {
        filterRolls();
    }, [rolls, searchTerm, filterStatus, filterProductType]);

    const loadRolls = async () => {
        try {
        setLoading(true);
        setError('');
        const response = await productionService.getAll();
        setRolls(response.data);
        } catch (error) {
        setError(error.message);
        console.error('Error al cargar rollos:', error);
        } finally {
        setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
        const response = await productionService.getStats();
        setStats(response.data);
        } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        }
    };

    const filterRolls = () => {
        let filtered = [...rolls];

        if (searchTerm) {
        filtered = filtered.filter(roll =>
            roll.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            roll.fabric.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        }

        if (filterStatus) {
        filtered = filtered.filter(roll => roll.summary.currentStatus === filterStatus);
        }

        if (filterProductType) {
        filtered = filtered.filter(roll => roll.cutting.productType === filterProductType);
        }

        setFilteredRolls(filtered);
    };

    const handleCreate = () => {
        setSelectedRoll(null);
        setIsCreateModalOpen(true);
    };

    const handleView = (roll) => {
        setSelectedRoll(roll);
        setIsDetailModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este rollo?')) return;

        try {
        await productionService.delete(id);
        await loadRolls();
        await loadStats();
        } catch (error) {
        alert('Error al eliminar rollo: ' + error.message);
        }
    };

    const handleSubmit = async (formData) => {
        try {
        if (selectedRoll) {
            await productionService.update(selectedRoll._id, formData);
        } else {
            await productionService.create(formData);
        }
        setIsCreateModalOpen(false);
        await loadRolls();
        await loadStats();
        } catch (error) {
        alert('Error: ' + error.message);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
        fabric: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Tela' },
        cutting: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Corte' },
        sewing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Maquila' },
        laundry: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Lavandería' },
        finishing: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Terminado' },
        completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completado' }
        };

        const badge = badges[status] || badges.fabric;

        return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
        </span>
        );
    };

    // Obtener tipos de producto únicos para el filtro
    const productTypes = [...new Set(rolls.map(r => r.cutting.productType).filter(Boolean))];

    if (loading) {
        return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Cargando rollos...</div>
        </div>
        );
    }

    return (
        <div className="space-y-4">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-600">Total Rollos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
            </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-600">Inversión Total</p>
                <p className="text-2xl font-bold text-green-600">
                    ${stats.totalInvestment.toLocaleString('es-MX')}
                </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-600">Piezas Totales</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalPieces}</p>
                </div>
                <Layers className="w-8 h-8 text-purple-500" />
            </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-600">Costo Promedio/Pieza</p>
                <p className="text-2xl font-bold text-orange-600">
                    ${stats.avgCostPerPiece.toFixed(2)}
                </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            </div>
        </div>

        {/* Header con búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por folio o tipo de tela..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Todos los estados</option>
                <option value="fabric">Tela</option>
                <option value="cutting">Corte</option>
                <option value="sewing">Maquila</option>
                <option value="laundry">Lavandería</option>
                <option value="finishing">Terminado</option>
                <option value="completed">Completado</option>
                </select>

                {productTypes.length > 0 && (
                <select
                    value={filterProductType}
                    onChange={(e) => setFilterProductType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todos los productos</option>
                    {productTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                )}

                <Button variant="primary" onClick={handleCreate}>
                <Plus className="w-5 h-5 mr-2 inline" />
                Nuevo Rollo
                </Button>
            </div>
            </div>
        </div>

        {/* Tabla de rollos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talla</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Corte</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Maquila</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lavandería</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Terminado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inversión</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo/Pza</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredRolls.length === 0 ? (
                    <tr>
                    <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron rollos
                    </td>
                    </tr>
                ) : (
                    filteredRolls.map((roll) => (
                    <tr key={roll._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {roll.folio}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                        {roll.cutting.productType || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                        {roll.cutting.size || '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                        {roll.cutting.completed ? (
                            <span className="text-green-600 font-semibold">{roll.cutting.pieces}</span>
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                        {roll.sewing.piecesDelivered > 0 ? (
                            <span className={`font-semibold ${
                            roll.sewing.completed ? 'text-green-600' : 'text-blue-600'
                            }`}>
                            {roll.sewing.piecesReturned}/{roll.sewing.piecesDelivered}
                            </span>
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                        {roll.laundry.piecesDelivered > 0 ? (
                            <span className={`font-semibold ${
                            roll.laundry.completed ? 'text-green-600' : 'text-blue-600'
                            }`}>
                            {roll.laundry.piecesReturned}/{roll.laundry.piecesDelivered}
                            </span>
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                        {roll.finishing.piecesDelivered > 0 ? (
                            <span className={`font-semibold ${
                            roll.finishing.completed ? 'text-green-600' : 'text-blue-600'
                            }`}>
                            {roll.finishing.piecesReturned}/{roll.finishing.piecesDelivered}
                            </span>
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${roll.summary.totalInvested.toLocaleString('es-MX')}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {roll.summary.costPerPiece > 0 
                            ? `$${roll.summary.costPerPiece.toFixed(2)}`
                            : '-'
                        }
                        </td>
                        <td className="px-6 py-4">
                        {getStatusBadge(roll.summary.currentStatus)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button
                            onClick={() => handleView(roll)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalle"
                        >
                            <Eye className="w-4 h-4 inline" />
                        </button>
                        <button
                            onClick={() => handleDelete(roll._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                        >
                            <Trash2 className="w-4 h-4 inline" />
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>

        {/* Modal Crear/Editar */}
        <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title={selectedRoll ? 'Editar Rollo' : 'Nuevo Rollo'}
            size="md"
        >
            <RollForm
            roll={selectedRoll}
            onSubmit={handleSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            />
        </Modal>

        {/* Modal Detalle */}
        <Modal
            isOpen={isDetailModalOpen}
            onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedRoll(null);
            }}
            title="Detalle del Rollo"
            size="xl"
        >
            {selectedRoll && (
            <RollDetail
                rollId={selectedRoll._id}
                onClose={() => {
                setIsDetailModalOpen(false);
                setSelectedRoll(null);
                }}
                onUpdate={async () => {
                await loadRolls();
                await loadStats();
                }}
            />
            )}
        </Modal>
        </div>
    );
    };

export default ProductionList;
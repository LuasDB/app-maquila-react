import { useState, useEffect, useCallback } from "react"
import { Calendar, TrendingUp, DollarSign, Package, AlertCircle, FileText, Users, CreditCard, Scissors, Shirt, Droplet, Sparkles, ArrowDown, ArrowUp, RefreshCw } from "lucide-react"
import reportService from "@/services/reportService"
import Button from "@/components/common/Button"

const fmt = (n) => Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtInt = (n) => Number(n || 0).toLocaleString("es-MX")

const StatCard = ({ icon: Icon, label, value, prefix = "$", color = "blue", subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className={"text-2xl font-bold mt-1 text-" + color + "-600"}>{prefix}{typeof value === "number" ? (prefix === "$" ? fmt(value) : fmtInt(value)) : value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={"p-2.5 rounded-lg bg-" + color + "-50"}>
        <Icon className={"w-5 h-5 text-" + color + "-500"} />
      </div>
    </div>
  </div>
)

const ProgressBar = ({ label, value, total, color = "blue" }) => {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">${fmt(value)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={"h-2.5 rounded-full bg-" + color + "-500 transition-all duration-500"} style={{ width: pct + "%" }} />
      </div>
    </div>
  )
}

const statusLabels = { pending: "Pendiente", partial: "Parcial", paid: "Pagada", overdue: "Vencida", fabric: "Tela", cutting: "Corte", sewing: "Maquila", laundry: "Lavanderia", finishing: "Terminado", completed: "Completado" }
const statusColors = { pending: "yellow", partial: "blue", paid: "green", overdue: "red", fabric: "gray", cutting: "orange", sewing: "purple", laundry: "cyan", finishing: "pink", completed: "green" }
const paymentMethodLabels = { cash: "Efectivo", transfer: "Transferencia", check: "Cheque", card: "Tarjeta" }

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales")
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(1); return d.toISOString().split("T")[0]
  })
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
  const [salesReport, setSalesReport] = useState(null)
  const [productionReport, setProductionReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadReport = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const filters = { startDate, endDate }
      if (activeTab === "sales") {
        const data = await reportService.getSalesReport(filters)
        setSalesReport(data)
      } else {
        const data = await reportService.getProductionReport(filters)
        setProductionReport(data)
      }
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }, [activeTab, startDate, endDate])

  useEffect(() => { loadReport() }, [loadReport])

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab("sales")} className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " + (activeTab === "sales" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900")}>Reporte de Ventas</button>
            <button onClick={() => setActiveTab("production")} className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " + (activeTab === "production" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900")}>Reporte de Maquila</button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-400 text-sm">a</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Button variant="primary" onClick={loadReport} className="text-sm">
              <RefreshCw className={"w-4 h-4 mr-1 inline " + (loading ? "animate-spin" : "")} />Consultar
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading && <div className="text-center py-12 text-gray-500">Generando reporte...</div>}

      {!loading && activeTab === "sales" && salesReport && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Total Ventas" value={salesReport.sales.totalSales} prefix="" color="blue" />
            <StatCard icon={DollarSign} label="Monto Total" value={salesReport.sales.totalAmount} color="green" />
            <StatCard icon={CreditCard} label="Por Cobrar" value={salesReport.receivables.totalReceivable} color="amber" subtitle={salesReport.receivables.count + " ventas pendientes"} />
            <StatCard icon={TrendingUp} label="Cobrado en Periodo" value={salesReport.collections.totalCollected} color="emerald" subtitle={salesReport.collections.totalPayments + " pagos recibidos"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className={"rounded-xl border p-5 " + (salesReport.overdue.count > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200")}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className={"w-5 h-5 " + (salesReport.overdue.count > 0 ? "text-red-500" : "text-green-500")} />
                <h3 className="font-semibold text-gray-900">Ventas Vencidas</h3>
              </div>
              <p className={"text-3xl font-bold " + (salesReport.overdue.count > 0 ? "text-red-600" : "text-green-600")}>{salesReport.overdue.count}</p>
              {salesReport.overdue.count > 0 && <p className="text-sm text-red-600 mt-1">Saldo vencido: ${fmt(salesReport.overdue.totalOverdue)}</p>}
              {salesReport.overdue.count === 0 && <p className="text-sm text-green-600 mt-1">Sin ventas vencidas</p>}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Por Tipo de Pago</h3>
              {salesReport.byPaymentType.map((pt) => (
                <div key={pt._id} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-sm mb-0.5">
                    <span className="text-gray-600">{pt._id === "credit" ? "Credito" : "Contado"}</span>
                    <span className="font-medium">{pt.count} ventas</span>
                  </div>
                  <ProgressBar label="" value={pt.total} total={salesReport.sales.totalAmount} color={pt._id === "credit" ? "amber" : "green"} />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Cobros por Metodo</h3>
              {salesReport.collections.byMethod.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">Sin cobros en el periodo</p>
              ) : (
                salesReport.collections.byMethod.map((m) => (
                  <div key={m._id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{paymentMethodLabels[m._id] || m._id}</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">${fmt(m.total)}</p>
                      <p className="text-xs text-gray-400">{m.count} pagos</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Ventas por Producto</h3>
            {salesReport.byProduct.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Sin datos de productos en el periodo</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Ingreso</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Precio Prom.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport.byProduct.map((p, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-gray-900">{p._id}</td>
                        <td className="py-2.5 px-3 text-right text-gray-700">{fmtInt(p.quantity)}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900">${fmt(p.totalRevenue)}</td>
                        <td className="py-2.5 px-3 text-right text-gray-600">${fmt(p.avgPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Ventas por Cliente</h3>
            {salesReport.byCustomer.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Sin datos de clientes en el periodo</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Ventas</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Pagado</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Por Cobrar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport.byCustomer.map((c, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-gray-900">{c.customerName}</td>
                        <td className="py-2.5 px-3 text-right text-gray-700">{c.count}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900">${fmt(c.total)}</td>
                        <td className="py-2.5 px-3 text-right text-green-600">${fmt(c.paid)}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-amber-600">${fmt(c.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeTab === "production" && productionReport && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={Package} label="Total Rollos" value={productionReport.general.totalRolls} prefix="" color="blue" />
            <StatCard icon={DollarSign} label="Inversion Total" value={productionReport.general.totalInvested} color="indigo" />
            <StatCard icon={Scissors} label="Piezas Producidas" value={productionReport.general.totalPieces} prefix="" color="green" />
            <StatCard icon={AlertCircle} label="Piezas Perdidas" value={productionReport.general.totalPiecesLost} prefix="" color="red" />
            <StatCard icon={TrendingUp} label="Costo Prom/Pieza" value={productionReport.general.avgCostPerPiece} color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Rollos por Etapa</h3>
              <div className="space-y-2">
                {productionReport.byStatus.map((s) => {
                  const total = productionReport.general.totalRolls
                  const pct = total > 0 ? ((s.count / total) * 100).toFixed(0) : 0
                  const colors = { fabric: "bg-gray-400", cutting: "bg-orange-400", sewing: "bg-purple-400", laundry: "bg-cyan-400", finishing: "bg-pink-400", completed: "bg-green-500" }
                  return (
                    <div key={s._id} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-600">{statusLabels[s._id] || s._id}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                        <div className={(colors[s._id] || "bg-blue-400") + " h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"} style={{ width: Math.max(pct, 8) + "%" }}>
                          <span className="text-xs text-white font-medium">{s.count}</span>
                        </div>
                      </div>
                      <div className="w-10 text-right text-xs text-gray-500">{pct}%</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Desglose de Costos</h3>
              {(() => {
                const cb = productionReport.costBreakdown
                const totalCost = (cb.fabric || 0) + (cb.cutting || 0) + (cb.sewing || 0) + (cb.laundry || 0) + (cb.finishing || 0)
                const items = [
                  { label: "Tela", value: cb.fabric, icon: Package, color: "gray" },
                  { label: "Corte", value: cb.cutting, icon: Scissors, color: "orange" },
                  { label: "Maquila", value: cb.sewing, icon: Shirt, color: "purple" },
                  { label: "Lavanderia", value: cb.laundry, icon: Droplet, color: "cyan" },
                  { label: "Terminado", value: cb.finishing, icon: Sparkles, color: "pink" }
                ]
                return (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const pct = totalCost > 0 ? ((item.value / totalCost) * 100).toFixed(1) : 0
                      return (
                        <div key={item.label} className="flex items-center gap-3">
                          <item.icon className={"w-4 h-4 text-" + item.color + "-500 flex-shrink-0"} />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-0.5">
                              <span className="text-gray-600">{item.label}</span>
                              <span className="font-semibold text-gray-900">${fmt(item.value)} <span className="text-xs text-gray-400">({pct}%)</span></span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className={"h-1.5 rounded-full bg-" + item.color + "-400"} style={{ width: pct + "%" }} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="pt-3 border-t border-gray-100 flex justify-between font-semibold text-sm">
                      <span className="text-gray-700">Total Invertido</span>
                      <span className="text-gray-900">${fmt(totalCost)}</span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Produccion por Producto</h3>
            {productionReport.byProduct.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Sin datos de productos en el periodo</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Rollos</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Piezas</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Inversion</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 uppercase">Perdidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productionReport.byProduct.map((p, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-gray-900">{p._id || "Sin asignar"}</td>
                        <td className="py-2.5 px-3 text-right text-gray-700">{p.count}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{fmtInt(p.totalPieces)}</td>
                        <td className="py-2.5 px-3 text-right text-gray-700">${fmt(p.totalInvested)}</td>
                        <td className="py-2.5 px-3 text-right text-red-600">{fmtInt(p.piecesLost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !error && ((activeTab === "sales" && !salesReport) || (activeTab === "production" && !productionReport)) && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Selecciona un periodo y haz clic en Consultar</p>
        </div>
      )}
    </div>
  )
}

export default Reports
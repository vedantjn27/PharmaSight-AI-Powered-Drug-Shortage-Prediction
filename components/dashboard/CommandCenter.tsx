'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getDrugs } from '@/utils/api'
import { EMERGENCY_DRUGS } from '@/utils/emergencyData'
import { formatCurrency, formatNumber } from '@/utils/format'
import CSVUploadZone from './CSVUploadZone'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

interface Drug {
  drug: string
  category: string
  risk_status: 'GREEN' | 'AMBER' | 'RED'
  latest_demand: number
  cost_volume: number
  cdsco_alerts: number
  trend: number[]
}

export default function CommandCenter() {
  const { emergencyMode, uploadedData } = useAppStore()
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'uploaded'>('live')

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setDrugs(EMERGENCY_DRUGS as Drug[])
        } else {
          const result = await getDrugs()
          setDrugs(result.drugs || [])
        }
      } catch (error) {
        console.error('Error fetching drugs:', error)
        setDrugs(EMERGENCY_DRUGS as Drug[])
      } finally {
        setLoading(false)
      }
    }

    fetchDrugs()
  }, [emergencyMode])

  const displayDrugs = dataSource === 'uploaded' && uploadedData ? uploadedData.triage : drugs
  const dataSourceLabel = dataSource === 'uploaded' && uploadedData ? `Uploaded (${uploadedData.filename})` : 'Live Data'

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'GREEN':
        return 'status-badge-green'
      case 'AMBER':
        return 'status-badge-amber'
      case 'RED':
        return 'status-badge-red'
      default:
        return 'status-badge-green'
    }
  }

  const getTrendChart = (trend: number[]) => {
    const data = (trend || []).map((v, i) => ({ index: i, value: v }))
    return (
      <ResponsiveContainer width={60} height={30}>
        <LineChart data={data}>
          <XAxis dataKey="index" hide={true} />
          <YAxis hide={true} domain={['dataMin', 'dataMax']} />
          <Tooltip cursor={false} contentStyle={{ display: 'none' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={
              Math.min(...trend) === trend[trend.length - 1]
                ? '#ff3b5c'
                : '#00e5a0'
            }
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6">
      {/* CSV Upload Zone - PRIMARY FEATURE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">CSV Intelligence Engine</h2>
          <p className="text-muted">Upload your raw procurement data for instant TFT inference predictions</p>
        </div>
        <CSVUploadZone />
      </motion.div>

      {/* Data Source Toggle */}
      {uploadedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <button
            onClick={() => setDataSource('live')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              dataSource === 'live'
                ? 'bg-primary-500 text-white'
                : 'glass border border-border hover:border-primary-500/50'
            }`}
          >
            Live Data
          </button>
          <button
            onClick={() => setDataSource('uploaded')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              dataSource === 'uploaded'
                ? 'bg-primary-500 text-white'
                : 'glass border border-border hover:border-primary-500/50'
            }`}
          >
            Uploaded Data
          </button>
        </motion.div>
      )}

      {/* Drug Triage Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl overflow-hidden border border-border"
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold">Drug Triage Table</h3>
          <p className="text-sm text-muted mt-1">Data Source: {dataSourceLabel}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-primary-500/5 border-b border-border">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Drug</th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Risk</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-foreground">CDSCO</th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-foreground">Demand</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Cost</th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted">
                    Loading data...
                  </td>
                </tr>
              ) : displayDrugs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted">
                    No data available
                  </td>
                </tr>
              ) : (
                displayDrugs.map((drug, i) => (
                  <motion.tr
                    key={drug.drug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-primary-500/5 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-4">
                      <span className="font-semibold text-foreground text-xs sm:text-sm">{drug.drug}</span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-muted">{drug.category}</td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`status-badge text-xs sm:text-sm ${getRiskColor(drug.risk_status)}`}>
                        {drug.risk_status}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center gap-2">
                        {drug.cdsco_alerts > 0 ? (
                          <AlertCircle className="w-4 h-4 text-status-amber" />
                        ) : null}
                        <span className="text-sm font-semibold">{drug.cdsco_alerts}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-sm font-semibold">{formatNumber(drug.latest_demand)}</td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold">{formatCurrency(drug.cost_volume)}</td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      {drug.trend && drug.trend.length > 0 ? (
                        getTrendChart(drug.trend)
                      ) : (
                        <span className="text-xs text-muted">N/A</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

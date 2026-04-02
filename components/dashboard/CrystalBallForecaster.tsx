'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getForecast } from '@/utils/api'
import { EMERGENCY_DRUGS, EMERGENCY_FORECAST } from '@/utils/emergencyData'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CrystalBallForecaster() {
  const { emergencyMode, selectedDrug, setSelectedDrug } = useAppStore()
  const [forecast, setForecast] = useState<any>(EMERGENCY_FORECAST)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const drug = selectedDrug || EMERGENCY_DRUGS[0]?.drug || 'Paracetamol'
    const fetchForecast = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setForecast(EMERGENCY_FORECAST)
        } else {
          const result = await getForecast(drug)
          setForecast(result)
        }
      } catch (error) {
        setForecast(EMERGENCY_FORECAST)
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [selectedDrug, emergencyMode])

  const chartData = (forecast.p50 || []).map((point: any, i: number) => ({
    date: point.date,
    p10: forecast.p10?.[i]?.value || 0,
    p50: point.value,
    p90: forecast.p90?.[i]?.value || 0,
  }))

  return (
    <div className="space-y-6">
      {/* Drug Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <label className="text-sm font-semibold text-muted block mb-3">Select Drug</label>
        <select
          value={selectedDrug || EMERGENCY_DRUGS[0]?.drug}
          onChange={(e) => setSelectedDrug(e.target.value)}
          className="input-field"
        >
          {EMERGENCY_DRUGS.map((drug: any) => (
            <option key={drug.drug} value={drug.drug}>
              {drug.drug} ({drug.category})
            </option>
          ))}
        </select>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-border"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold">30-Day Forecast</h3>
          <p className="text-sm text-muted mt-1">Probabilistic prediction with P10, P50, P90 confidence levels</p>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center text-muted">Loading forecast...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorP10" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c2ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00c2ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 14, 39, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="p10" stackId="1" stroke="#00c2ff" fill="url(#colorP10)" />
              <Area type="monotone" dataKey="p50" stackId="2" stroke="#a855f7" fill="url(#colorP50)" />
              <Area type="monotone" dataKey="p90" stackId="3" stroke="#ff3b5c" fill="url(#colorP90)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  )
}

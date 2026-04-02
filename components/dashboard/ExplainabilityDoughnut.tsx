'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getExplainability } from '@/utils/api'
import { EMERGENCY_DRUGS, EMERGENCY_EXPLAINABILITY } from '@/utils/emergencyData'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#00c2ff', '#ffb800', '#ff3b5c', '#00e5a0', '#a855f7']

export default function ExplainabilityDoughnut() {
  const { emergencyMode, selectedDrug, setSelectedDrug } = useAppStore()
  const [explainability, setExplainability] = useState<any>(EMERGENCY_EXPLAINABILITY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const drug = selectedDrug || EMERGENCY_DRUGS[0]?.drug || 'Paracetamol'
    const fetchExplainability = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setExplainability(EMERGENCY_EXPLAINABILITY)
        } else {
          const result = await getExplainability(drug)
          setExplainability(result)
        }
      } catch (error) {
        setExplainability(EMERGENCY_EXPLAINABILITY)
      } finally {
        setLoading(false)
      }
    }

    fetchExplainability()
  }, [selectedDrug, emergencyMode])

  const chartData = explainability.importances
    ? Object.entries(explainability.importances).map(([label, value]) => ({
        name: label,
        value: (value as number) * 100,
      }))
    : []

  return (
    <div className="space-y-6">
      {/* Drug Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <label className="text-sm font-semibold text-muted block mb-3">Select Drug</label>
        <select
          value={selectedDrug || EMERGENCY_DRUGS[0]?.drug}
          onChange={(e) => setSelectedDrug(e.target.value)}
          className="input-field"
        >
          {EMERGENCY_DRUGS.map((drug: any) => (
            <option key={drug.drug} value={drug.drug}>
              {drug.drug}
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
          <h3 className="text-lg font-bold">Neural Network Attention Weights</h3>
          <p className="text-sm text-muted mt-1">TFT feature importance for {explainability.drug}</p>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center text-muted">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-primary-500/20"
      >
        <h3 className="font-bold mb-4">Feature Explanations</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted">CDSCO Alerts (35%)</p>
            <p className="text-xs text-muted/70 mt-1">Regulatory actions have the strongest impact on shortage predictions</p>
          </div>
          <div>
            <p className="text-muted">Demand Lag-1 (25%)</p>
            <p className="text-xs text-muted/70 mt-1">Previous period demand is a significant predictor of current shortage</p>
          </div>
          <div>
            <p className="text-muted">Day of Week (18%)</p>
            <p className="text-xs text-muted/70 mt-1">Temporal patterns in prescription behavior influence predictions</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getNetwork, simulateDisruption } from '@/utils/api'
import { EMERGENCY_NETWORK } from '@/utils/emergencyData'
import { motion } from 'framer-motion'
import { RotateCcw, AlertTriangle } from 'lucide-react'

export default function SupplierGeoMap() {
  const { emergencyMode } = useAppStore()
  const [network, setNetwork] = useState<any>(EMERGENCY_NETWORK)
  const [offline, setOffline] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setNetwork(EMERGENCY_NETWORK)
        } else {
          const result = await getNetwork()
          setNetwork(result)
        }
      } catch (error) {
        setNetwork(EMERGENCY_NETWORK)
      } finally {
        setLoading(false)
      }
    }

    fetchNetwork()
  }, [emergencyMode])

  const handleNodeClick = async (nodeId: string) => {
    const newOffline = new Set(offline)
    if (newOffline.has(nodeId)) {
      newOffline.delete(nodeId)
    } else {
      newOffline.add(nodeId)
    }
    setOffline(newOffline)

    try {
      if (!emergencyMode) {
        await simulateDisruption(nodeId)
      }
    } catch (error) {
      console.error('Error simulating disruption:', error)
    }
  }

  const getNodeStatus = (nodeId: string) => {
    if (offline.has(nodeId)) return 'offline'
    return network.nodes?.find((n: any) => n.id === nodeId)?.status || 'green'
  }

  const affectedDrugs = offline.size > 0 ? 
    network.edges?.filter((e: any) => offline.has(e.source))
      .map((e: any) => network.nodes?.find((n: any) => n.id === e.target)?.name || '')
      .filter(Boolean) || []
    : []

  return (
    <div className="space-y-6">
      {/* Network Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-border"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold">Supply Chain Network</h3>
          <p className="text-sm text-muted mt-1">Click suppliers to simulate disruption</p>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center text-muted">Loading network...</div>
        ) : (
          <div className="relative h-96 bg-primary-500/5 rounded-lg p-6 flex items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {network.nodes?.map((node: any, i: number) => {
                const isOffline = offline.has(node.id)
                const statusColor = isOffline ? 'status-red' : node.status === 'green' ? 'status-green' : node.status === 'amber' ? 'status-amber' : 'status-red'
                
                return (
                  <motion.button
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isOffline
                        ? 'bg-status-red/20 border-status-red/50'
                        : 'glass border-border hover:border-primary-500/50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mb-2 ${statusColor === 'status-green' ? 'bg-status-green' : statusColor === 'status-amber' ? 'bg-status-amber' : 'bg-status-red'}`} />
                    <p className="font-semibold text-sm">{node.name}</p>
                    <p className="text-xs text-muted mt-1">Risk: {(node.risk_score * 100).toFixed(0)}%</p>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Impact Summary */}
      {offline.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-status-red/20 bg-status-red/5"
        >
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-status-red flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold mb-3">Disruption Impact</h3>
              <p className="text-sm text-muted mb-3">
                {offline.size} supplier(s) offline affecting {affectedDrugs.length} downstream nodes
              </p>
              {affectedDrugs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-status-amber">Affected Suppliers:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(offline).map((id) => {
                      const node = network.nodes?.find((n: any) => n.id === id)
                      return (
                        <span key={id} className="status-badge-red">
                          {node?.name || id}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Reset Button */}
      {offline.size > 0 && (
        <motion.button
          onClick={() => setOffline(new Set())}
          className="w-full button-secondary flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Network
        </motion.button>
      )}
    </div>
  )
}

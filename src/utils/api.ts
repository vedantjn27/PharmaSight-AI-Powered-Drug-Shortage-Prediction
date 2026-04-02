import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health', { timeout: 5000 })
    return response.status === 200
  } catch {
    return false
  }
}

export const getDrugs = async () => {
  try {
    const response = await api.get('/api/v1/drugs')
    return response.data
  } catch (error) {
    console.error('Error fetching drugs:', error)
    throw error
  }
}

export const uploadCSV = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error uploading CSV:', error)
    throw error
  }
}

export const getForecast = async (drugName: string) => {
  try {
    const response = await api.get(`/api/v1/forecast/${drugName}`)
    return response.data
  } catch (error) {
    console.error('Error fetching forecast:', error)
    throw error
  }
}

export const simulateForecast = async (drugName: string, alerts: number, delayDays: number, demandMultiplier: number) => {
  try {
    const response = await api.post('/api/v1/forecast/simulate', {
      drug: drugName,
      simulated_cdsco_alerts: alerts,
      supply_delay_days: delayDays,
      demand_surge_multiplier: demandMultiplier,
    })
    return response.data
  } catch (error) {
    console.error('Error simulating forecast:', error)
    throw error
  }
}

export const getExplainability = async (drugName: string) => {
  try {
    const response = await api.get(`/api/v1/explain/${drugName}`)
    return response.data
  } catch (error) {
    console.error('Error fetching explainability:', error)
    throw error
  }
}

export const getNetwork = async () => {
  try {
    const response = await api.get('/api/v1/network')
    return response.data
  } catch (error) {
    console.error('Error fetching network:', error)
    throw error
  }
}

export const simulateDisruption = async (supplierId: string) => {
  try {
    const response = await api.post('/api/v1/network/simulate_disruption', {
      supplier_id: supplierId,
    })
    return response.data
  } catch (error) {
    console.error('Error simulating disruption:', error)
    throw error
  }
}

export const getPurchaseOrders = async () => {
  try {
    const response = await api.get('/api/v1/purchase_orders')
    return response.data
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    throw error
  }
}

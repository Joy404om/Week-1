import { useEffect, useState } from 'react'
import { api, loadAuthToken } from '../lib/api'

export default function NearbySalons() {
  const [coords, setCoords] = useState(null)
  const [salons, setSalons] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAuthToken()
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lng: longitude })
      },
      (err) => {
        setError(err.message || 'Location permission denied')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  useEffect(() => {
    async function fetchNearby() {
      if (!coords) return
      try {
        const { data } = await api.get('/salons/nearby', { params: { lat: coords.lat, lng: coords.lng, radiusKm: 5 } })
        setSalons(data.results)
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load nearby salons')
      } finally {
        setLoading(false)
      }
    }
    fetchNearby()
  }, [coords])

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div>
      <h3>Salons near you (within 5 km)</h3>
      {salons.length === 0 && <div>No salons found nearby.</div>}
      <ul style={{ display: 'grid', gap: 12, padding: 0, listStyle: 'none' }}>
        {salons.map(s => (
          <li key={s.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
            <div style={{ fontWeight: 600 }}>{s.name}</div>
            {s.address && <div style={{ color: '#555' }}>{s.address}</div>}
            <div style={{ color: '#333' }}>{s.distanceKm.toFixed(2)} km away</div>
            {s.mapLink && <a href={s.mapLink} target="_blank" rel="noreferrer">Open in Maps</a>}
          </li>
        ))}
      </ul>
    </div>
  )
}
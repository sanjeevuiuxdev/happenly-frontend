import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listEvents } from '../api/eventApi'
import FilterBar from '../components/FilterBar'
import EventCard from '../components/EventCard'

export default function Events(){
  const [params] = useSearchParams()
  const [filters, setFilters] = useState({ q:'', department:'', type:'', sort:'startAt' })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const from = params.get('from'); const to = params.get('to')
    fetchList({ ...filters, from, to })
    // eslint-disable-next-line
  }, [filters, params])

  const fetchList = async (f) => {
    setLoading(true)
    try {
      const { data } = await listEvents(f)
      setItems(data.items || data)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2 className="mb-3">Upcoming Events</h2>
      <FilterBar filters={filters} setFilters={setFilters} />
      {loading && <div className="text-muted">Loading…</div>}
      {items.map(e=> <EventCard key={e._id} e={e} />)}
      {!loading && items.length===0 && <div className="text-muted">No events found.</div>}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listEvents } from '../api/eventApi'
import FilterBar from '../components/FilterBar'
import EventCard from '../components/EventCard'
import CreateEventModal from '../components/CreateEventModal'
import { Button } from 'react-bootstrap'

export default function Events(){
  const [params] = useSearchParams()
  const [filters, setFilters] = useState({ q:'', department:'', type:'', sort:'startAt' })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const isAdmin = (localStorage.getItem('role') || 'user') === 'admin'  // <— role gate

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Upcoming Events</h2>
        {isAdmin && <Button onClick={()=>setShowCreate(true)}>+ Add Event</Button>}
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />
      {loading && <div className="text-muted">Loading…</div>}
      {items.map(e=> <EventCard key={e._id} e={e} />)}
      {!loading && items.length===0 && <div className="text-muted">No events found.</div>}

      {/* Modal */}
      <CreateEventModal
        show={showCreate}
        onClose={()=>setShowCreate(false)}
        onCreated={()=>fetchList(filters)}
      />
    </div>
  )
}

import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

/**
 * props:
 *  - events: [{ title, start: Date, end: Date, resource?: any }]
 *  - onDateSelect?: (isoDateString) => void   // called when user clicks a day cell
 *  - onEventClick?: (event) => void
 */
export default function CalendarView({ events = [], onDateSelect, onEventClick }) {
  // Bootstrap-ish coloring for events
  const eventPropGetter = useMemo(
    () => () => ({ className: 'bg-primary text-white border-0 rounded-1 px-1' }),
    []
  );

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 520 }}
          selectable
          onSelectSlot={(slot) => {
            // slot.start is a Date for the clicked cell
            const iso = slot.start.toISOString().slice(0, 10);
            onDateSelect && onDateSelect(iso);
          }}
          onSelectEvent={(e) => onEventClick && onEventClick(e)}
          popup
          eventPropGetter={eventPropGetter}
        />
      </div>
    </div>
  );
}

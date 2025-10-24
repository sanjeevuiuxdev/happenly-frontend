import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

/**
 * props:
 *  - events: [{ title, start: Date, end: Date, id }]
 *  - onDateSelect(iso)         // click empty day cell
 *  - onEventClick(event)       // click event
 *  - onRangeChange(range)      // month/week/day navigation
 */
export default function CalendarView({ events = [], onDateSelect, onEventClick, onRangeChange }) {
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
            const iso = slot.start.toISOString().slice(0, 10);
            onDateSelect && onDateSelect(iso);
          }}
          onSelectEvent={(e) => onEventClick && onEventClick(e)}
          onRangeChange={(r) => onRangeChange && onRangeChange(r)}
          popup
          eventPropGetter={eventPropGetter}
        />
      </div>
    </div>
  );
}

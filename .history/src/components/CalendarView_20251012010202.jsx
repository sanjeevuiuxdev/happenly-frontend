import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

// keep Bootstrap CSS via main.jsx: 'bootstrap/dist/css/bootstrap.min.css'
import "@fullcalendar/daygrid/index.css"; // use index.css here


export default function CalendarView({ onDateSelect }){
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, bootstrap5Plugin]}
      initialView="dayGridMonth"
      themeSystem="bootstrap5"
      height={520}
      dateClick={(info)=> onDateSelect?.(info.dateStr)}
    />
  )
}
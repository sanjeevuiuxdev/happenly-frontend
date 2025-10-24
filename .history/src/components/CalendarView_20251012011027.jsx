


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
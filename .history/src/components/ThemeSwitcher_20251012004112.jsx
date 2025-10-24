import { useEffect, useState } from 'react'
export default function ThemeSwitcher(){
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  useEffect(()=>{
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  },[theme])
  return (
    <select className="form-select form-select-sm w-auto" value={theme} onChange={e=>setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}
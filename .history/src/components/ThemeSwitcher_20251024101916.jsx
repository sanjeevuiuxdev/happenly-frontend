import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

// valid values: 'light' | 'dark' | 'auto'
const STORAGE_KEY = 'theme';

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-bs-theme', theme);
  }
  localStorage.setItem(STORAGE_KEY, theme);
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_KEY) || 'light');

  useEffect(() => {
    applyTheme(theme);
    
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => theme === 'auto' && applyTheme('auto');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const set = (val) => () => setTheme(val);

  const label = theme === 'auto' ? 'Auto'
             : theme === 'dark' ? 'Dark'
             : 'Light';

  return (
    <Dropdown align="end" className="me-2">
      <Dropdown.Toggle size="sm" variant="outline-secondary">
        Theme: {label}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item active={theme==='light'} onClick={set('light')}>Light</Dropdown.Item>
        <Dropdown.Item active={theme==='dark'}  onClick={set('dark')}>Dark</Dropdown.Item>
        {/* <Dropdown.Item active={theme==='auto'}  onClick={set('auto')}>Auto</Dropdown.Item> */}
      </Dropdown.Menu>
    </Dropdown>
  );
}

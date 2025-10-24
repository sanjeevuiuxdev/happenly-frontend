import { Dropdown } from 'react-bootstrap';
import { useTheme } from '../theme/ThemeProvider';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const label = theme === 'system'
    ? `System (${document.documentElement.getAttribute('data-bs-theme')})`
    : theme[0].toUpperCase() + theme.slice(1);

  return (
    <Dropdown align="end">
      <Dropdown.Toggle size="sm" variant="outline-secondary">
        {label}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item active={theme === 'light'} onClick={() => setTheme('light')}>
          Light
        </Dropdown.Item>
        <Dropdown.Item active={theme === 'dark'} onClick={() => setTheme('dark')}>
          Dark
        </Dropdown.Item>
        <Dropdown.Item active={theme === 'system'} onClick={() => setTheme('system')}>
          System
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

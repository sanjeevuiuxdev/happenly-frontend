import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply selected theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Button
      variant={theme === "light" ? "outline-dark" : "outline-light"}
      size="sm"
      onClick={toggleTheme}
      title="Toggle light/dark"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </Button>
  );
}

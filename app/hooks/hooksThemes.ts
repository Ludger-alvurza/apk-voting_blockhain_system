import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState<string>("light");
  useEffect(() => {
    // Ambil tema dari localStorage setelah mounting
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };
  return { theme, toggleTheme };
};

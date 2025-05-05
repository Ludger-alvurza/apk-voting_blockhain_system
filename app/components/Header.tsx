"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../hooks/hooksThemes";
import LogoutButton from "./logout";

const Header: React.FC = () => {
  const pathname = usePathname();
  const hideHeader = pathname === "/login" || pathname === "/register";
  const { theme, toggleTheme } = useTheme();

  if (hideHeader) return null; // Jangan render Header jika di halaman login/register

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/vote", label: "Vote" },
    { path: "/results", label: "Results" },
  ];

  return (
    <header className="bg-gray-800 text-white px-6 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Title */}
        <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
          Vote Dapp
        </h1>

        {/* Navigation */}
        <nav className="flex items-center space-x-8">
          {/* Dynamic Links */}
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`text-lg font-semibold px-4 py-2 transition-all rounded-md ${
                pathname === link.path
                  ? "text-black bg-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Logout Button */}
          <LogoutButton />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="px-6 py-2 text-sm font-medium rounded-lg shadow-md bg-blue-500 text-white dark:bg-yellow-500 dark:text-black hover:bg-blue-600 dark:hover:bg-yellow-600 transition-all transform hover:scale-105"
          >
            {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

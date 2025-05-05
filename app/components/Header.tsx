"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../hooks/hooksThemes";
import LogoutButton from "./logout";
import Link from "next/link";

const Header: React.FC = () => {
  const pathname = usePathname();
  const hideHeader = pathname === "/login" || pathname === "/register";
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const transitionDuration = 300; // ms

  // Check login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check for auth cookie status by making a request to the server
        const response = await fetch("/api/authcheck", {
          method: "GET",
          credentials: "include", // Important to include cookies
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isAuthenticated);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Listen for custom auth events
    const handleAuthEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === "login") {
        setIsLoggedIn(true);
      } else if (customEvent.detail?.action === "logout") {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener(
      "authStateChange",
      handleAuthEvent as EventListener
    );

    return () => {
      window.removeEventListener(
        "authStateChange",
        handleAuthEvent as EventListener
      );
    };
  }, []);

  // Handle menu toggle with animation
  const handleToggleMenu = () => {
    if (isMenuOpen) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsTransitioning(false);
      }, transitionDuration);
    } else {
      setIsMenuOpen(true);
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isMenuOpen && !isTransitioning) {
          setIsTransitioning(true);
          setTimeout(() => {
            setIsMenuOpen(false);
            setIsTransitioning(false);
          }, transitionDuration);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isTransitioning]);

  // Close menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsTransitioning(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen && !isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsMenuOpen(false);
          setIsTransitioning(false);
        }, transitionDuration);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen, isTransitioning]);

  if (hideHeader) return null; // Don't render Header on login/register pages

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/vote", label: "Vote" },
    { path: "/results", label: "Results" },
  ];

  return (
    <header className="bg-gray-800 text-white w-full fixed top-0 left-0 right-0 z-50 py-3 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Title */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 tracking-wide">
            Vote Dapp
          </h1>

          {/* Mobile Menu Button */}
          <button
            onClick={handleToggleMenu}
            className="md:hidden text-white focus:outline-none transition-transform duration-300 ease-in-out"
            aria-label="Toggle Menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isMenuOpen ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`text-sm font-medium px-2 py-1 lg:px-3 lg:py-2 rounded-md transition-colors ${
                  pathname === link.path
                    ? "text-black bg-yellow-400"
                    : "text-white hover:text-yellow-400"
                }`}
              >
                {link.label}
              </a>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-xs font-medium px-2 py-1 lg:px-3 lg:py-2 rounded-md shadow-md bg-blue-500 text-white dark:bg-yellow-500 dark:text-black hover:bg-blue-600 dark:hover:bg-yellow-600 transition-colors"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>

            {/* Logout Button or Login Button */}
            {isLoggedIn ? (
              <div className="ml-1">
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-1 text-xs font-medium px-2 py-1 lg:px-3 lg:py-2 rounded-md shadow-md bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Navigation Menu with Transition */}
        <div
          ref={menuRef}
          className={`md:hidden absolute left-0 right-0 top-full bg-gray-800 shadow-lg border-t border-gray-700 z-50 transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
          style={{
            maxHeight: isMenuOpen ? "calc(100vh - 64px)" : "0px",
            overflowY: "auto",
            transitionProperty: "max-height, opacity",
          }}
        >
          <nav
            className={`flex flex-col py-1 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-y-0" : "-translate-y-4"
            }`}
          >
            {navLinks.map((link, index) => (
              <a
                key={link.path}
                href={link.path}
                onClick={handleToggleMenu}
                className={`py-3 px-4 border-b border-gray-700 transition-all duration-200 ease-in-out ${
                  pathname === link.path
                    ? "bg-yellow-400 text-black"
                    : "text-white hover:bg-gray-700"
                }`}
                style={{
                  transitionDelay: `${50 + index * 50}ms`,
                  opacity: isMenuOpen ? "1" : "0",
                }}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => {
                toggleTheme();
                handleToggleMenu();
              }}
              className="py-3 px-4 text-left border-b border-gray-700 text-white hover:bg-gray-700 transition-all duration-200 ease-in-out"
              style={{
                transitionDelay: `${50 + navLinks.length * 50}ms`,
                opacity: isMenuOpen ? "1" : "0",
              }}
            >
              {theme === "light"
                ? "Switch to Dark Mode"
                : "Switch to Light Mode"}
            </button>

            {/* Conditional rendering for logout/login buttons */}
            {isLoggedIn ? (
              <div
                className="py-3 px-4 transition-all duration-200 ease-in-out"
                onClick={handleToggleMenu}
                style={{
                  transitionDelay: `${50 + (navLinks.length + 1) * 50}ms`,
                  opacity: isMenuOpen ? "1" : "0",
                }}
              >
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="py-3 px-4 block text-left text-white hover:bg-gray-700 transition-all duration-200 ease-in-out font-medium"
                onClick={handleToggleMenu}
                style={{
                  transitionDelay: `${50 + (navLinks.length + 1) * 50}ms`,
                  opacity: isMenuOpen ? "1" : "0",
                }}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Spacer for content not to be hidden by fixed header */}
      <div className="h-16 md:h-16" />
    </header>
  );
};

export default Header;

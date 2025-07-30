"use client";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white w-full fixed top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full md:w-10 md:h-10"
            />
            <h1 className="text-base md:text-xl font-bold tracking-tight">
              Task Tracker
            </h1>
          </div>

          {/* Desktop menu */}
          <nav className="hidden sm:block">
            <ul className="flex space-x-4">
              <li>
                <a
                  href="/createTask"
                  className="hover:underline px-3 py-2 rounded-md text-sm"
                >
                  Create Task
                </a>
              </li>
              <li>
                <a
                  href="/task"
                  className="hover:underline px-3 py-2 rounded-md text-sm"
                >
                  List Tasks
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/createTask"
                className="block px-3 py-2 rounded-md text-base hover:bg-gray-700"
              >
                Create Task
              </a>
              <a
                href="/task"
                className="block px-3 py-2 rounded-md text-base hover:bg-gray-700"
              >
                List Tasks
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

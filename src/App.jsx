import { useState } from 'react';
import SideBar from "./components/SideBar";
import SEO from "./components/SEO";
import { Outlet } from "@tanstack/react-router";
import { Menu } from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SEO />
      <div className="flex h-screen bg-white dark:bg-gray-800">
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto" role="main" aria-label="Main content">
          {/* The Header on mobile with Hamburger Menu */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-b">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">T0 + D0</h1>
            <div className="w-10" />
          </div>
          
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
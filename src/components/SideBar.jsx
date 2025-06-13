import { Link } from '@tanstack/react-router';
import { Sun, Moon, CheckSquare, Star, Archive, Menu, X } from 'lucide-react';
import { useTheme } from '../theme-context';

export default function SideBar({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        flex flex-col justify-between bg-gray-200 dark:bg-gray-900 w-60 p-4 h-screen
        fixed lg:relative z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex justify-between items-center lg:hidden mb-4">
          <h1 className="text-2xl font-bold">T0 + D0</h1>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-4">
          <h1 className="text-2xl font-bold hidden lg:block">T0 + D0</h1>
          <ul className="space-y-2">
            <li className="px-2 py-1 hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-700 transition duration-300">
              <Link to="/" className="flex gap-2 items-center" onClick={onClose}> 
                <CheckSquare className="size-4 text-blue-500"/> Todos 
              </Link>
            </li>
            <li className="px-2 py-1 hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-700 transition duration-300">
              <Link to="/important" className="flex gap-2 items-center" onClick={onClose}> 
                <Star className="size-4 text-yellow-500"/> Important 
              </Link>
            </li>
            <li className="px-2 py-1 hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-700 transition duration-300">
              <Link to="/archives" className="flex gap-2 items-center" onClick={onClose}> 
                <Archive className="size-4 text-gray-500"/> Archives 
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <p className="text-sm">{theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} T0 + D0
          </p>
        </div>
      </aside>
    </>
  );
}
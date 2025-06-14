import { Link, useLocation } from '@tanstack/react-router';
import { Sun, Moon, CheckSquare, Star, Archive, Menu, X } from 'lucide-react';
import { useTheme } from '../theme-context';

export default function SideBar({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Function to check if a route is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      path: '/',
      label: 'Todos',
      icon: CheckSquare,
      iconColor: 'text-blue-500',
    },
    {
      path: '/important',
      label: 'Important',
      icon: Star,
      iconColor: 'text-yellow-500',
    },
    {
      path: '/archived',
      label: 'Archives',
      icon: Archive,
      iconColor: 'text-gray-500',
    },
  ];

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
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li 
                  key={item.path}
                  className={`
                    px-2 py-1 rounded transition duration-300 border-2
                    ${active 
                      ? 'bg-gray-400 dark:bg-gray-300/30 border-gray-600 dark:border-gray-400 shadow-sm' 
                      : 'border-transparent hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-700'
                    }
                  `}
                >
                  <Link 
                    to={item.path} 
                    className={`
                      flex gap-2 items-center
                      ${active 
                        ? ' font-semibold' 
                        : 'text-gray-700 dark:text-gray-300'
                      }
                    `}
                    onClick={onClose}
                  > 
                    <Icon 
                      className={`
                        size-4 
                        ${active ? '' : item.iconColor}
                      `}
                    /> 
                    {item.label}
                  </Link>
                </li>
              );
            })}
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
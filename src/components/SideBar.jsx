import { Link } from '@tanstack/react-router';
import { Sun, Moon, CheckSquare, Star, Archive } from 'lucide-react';
import { useTheme } from '../theme-context';

export default function SideBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="flex flex-col justify-between bg-gray-200 dark:bg-gray-900 w-60 p-4">
      <nav className="space-y-4">
        <h1 className="text-2xl font-bold">Todo App</h1>
        <ul className="space-y-2">
          <li className="px-2 py-1 hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-700 transition duration-300"><Link to="/" className="flex gap-2 items-center"> <CheckSquare className="size-4 text-blue-500"/> Todos </Link></li>
          <li className="px-2 py-1 hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-700 transition duration-300"><Link to="/important" className="flex gap-2 items-center"> <Star className="size-4 text-yellow-500"/> Important </Link></li>
          <li className="px-2 py-1 hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-700 transition duration-300"><Link to="/archives" className="flex gap-2 items-center"> <Archive className="size-4 text-gray-500"/> Archives </Link></li>
        </ul>
      </nav>
      <button
        onClick={toggleTheme}
        aria-label="Toggle light/dark mode"
        className="self-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </aside>
  );
}
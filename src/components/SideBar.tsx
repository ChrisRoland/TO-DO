import { Link, useLocation } from "@tanstack/react-router";
import { Sun, Moon, CheckSquare, Star, Archive, Menu, X, LogOut, User } from "lucide-react";
import { useTheme } from "../theme-context";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, getUserDisplayName, getUserAvatarUrl } = useAuth();
  const location = useLocation();

  // Function to check if a route is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/app/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      path: "/app/",
      label: "Todos",
      icon: CheckSquare,
      iconColor: "text-blue-500",
    },
    {
      path: "/app/important",
      label: "Important",
      icon: Star,
      iconColor: "text-yellow-500",
    },
    {
      path: "/app/archived",
      label: "Archives",
      icon: Archive,
      iconColor: "text-gray-500",
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const avatarUrl = getUserAvatarUrl();

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
      <aside
        className={`
        flex flex-col justify-between bg-gray-200 dark:bg-gray-900 w-60 p-4 h-screen
        fixed lg:relative z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex justify-between items-center lg:hidden mb-4">
          <Link to={"/app"} onClick={onClose} className="text-2xl font-bold">
            T0 + D0
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Section */}
        <div className="space-y-6">
          <Link to={"/app"} className="text-2xl font-bold hidden lg:block">
            T0 + D0
          </Link>

          {/* User Info */}
          {user && (
            <div className="bg-gray-300/50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={getUserDisplayName()}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <li
                    key={item.path}
                    className={`
                      px-2 py-1 rounded transition duration-300 border-2
                      ${
                        active
                          ? "bg-gray-400 dark:bg-gray-300/30 border-gray-600 dark:border-gray-400 shadow-sm"
                          : "border-transparent hover:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-700"
                      }
                    `}
                  >
                    <Link
                      to={item.path}
                      className={`
                        flex gap-2 items-center
                        ${
                          active
                            ? " font-semibold"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      `}
                      onClick={onClose}
                    >
                      <Icon
                        className={`
                          size-4 
                          ${active ? "" : item.iconColor}
                        `}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <p className="text-xs text-center">
            {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          </p>

          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} T0 + D0
          </p>
        </div>
      </aside>
    </>
  );
}
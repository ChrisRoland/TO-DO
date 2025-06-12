import SideBar from "./components/SideBar";
import { Outlet } from "@tanstack/react-router";

export default function App() {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-800">
      <SideBar />
      <main
        className="flex-1 overflow-y-auto p-6"
        role="main"
        aria-label="Main content"
      >
        <Outlet />
      </main>
    </div>
  );
}

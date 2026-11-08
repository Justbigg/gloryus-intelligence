import { Outlet } from "react-router";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import MobileNav from "./MobileNav.jsx";

export default function AppLayout({ title = "Dashboard", subtitle, actions }) {
  return (
    <div className="flex h-screen overflow-hidden bg-void">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <TopBar title={title} subtitle={subtitle} actions={actions} />

        <main className="flex-1 overflow-y-auto bg-void pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

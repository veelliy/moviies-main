import { Outlet, useLocation } from "react-router-dom";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileNav } from "./MobileNav";

function MainLayout() {
    const location = useLocation();

    return (
        <div className="app-layout">
            <DesktopSidebar />

            <div className="app-main">
                <div
                    key={location.pathname}
                    className="page-transition"
                >
                    <Outlet />
                </div>
            </div>

            <MobileNav />
        </div>
    );
}

export { MainLayout };

import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CustomAppBar from "./CustomAppBar";
import Sidebar from "./Sidebar";
import { XMarkIcon } from "@heroicons/react/24/solid";

const pageVariants = {
  initial: { opacity: 0, x: 15 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -15 },
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
};

const Layout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDrawerClose = () => setMobileOpen(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/inventory":
        return "Inventory Management";
      case "/purchase-orders":
        return "Purchase Orders";
      default:
        return "Inventory Management System";
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* App Bar */}
      <CustomAppBar handleDrawerToggle={handleDrawerToggle} title={getPageTitle()} />

      {/* Sidebar for desktop */}
      <div className="hidden md:block fixed top-0 left-0 h-full z-40">
        <Sidebar handleDrawerToggle={handleDrawerClose} />
      </div>

      {/* Sidebar for mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDrawerClose}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-[260px] bg-[#537D5D] text-white z-50 shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h6 className="font-semibold text-white text-lg">SmartInventory</h6>
                <button onClick={handleDrawerClose} className="p-2 rounded-md hover:bg-white/20">
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              <Sidebar handleDrawerToggle={handleDrawerClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow w-full md:ml-[260px] pt-16">
        <div className="p-4 sm:p-6 md:p-8 bg-white relative overflow-hidden">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Outlet />
          </motion.div>
        </div>

        <footer className="py-3 border-t border-gray-200 text-center text-sm text-gray-500 bg-white shadow-inner">
          © 2025 SmartInventory — All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default Layout;

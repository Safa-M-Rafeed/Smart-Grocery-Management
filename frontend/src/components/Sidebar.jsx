import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  CubeIcon,
  DocumentTextIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon className="h-5 w-5" />, path: "/" },
  { text: "Inventory", icon: <CubeIcon className="h-5 w-5" />, path: "/inventory" },
  { text: "Purchase Orders", icon: <DocumentTextIcon className="h-5 w-5" />, path: "/purchase-orders" },
];

const Sidebar = ({ handleDrawerToggle }) => {
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => setOpen(!open);

  const NavigationItem = ({ item, index }) => {
    const isActive = location.pathname === item.path;
    return (
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link
          to={item.path}
          onClick={handleDrawerToggle}
          className={`flex items-center gap-3 p-3 rounded-md mx-3 mb-1 transition-all ${
            isActive
              ? "bg-white text-[#537D5D] shadow-md"
              : "text-white hover:bg-white/20"
          }`}
        >
          <div className="flex-shrink-0">{item.icon}</div>
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-medium text-sm"
              >
                {item.text}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </motion.div>
    );
  };

  return (
    <div
      className={`h-full flex flex-col bg-[#537D5D] text-white transition-all duration-300 ${
        open ? "w-[260px]" : "w-[80px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <AnimatePresence>
          {open && (
            <motion.h6
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold"
            >
              SmartInventory
            </motion.h6>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
        >
          {open ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, index) => (
          <NavigationItem key={item.text} item={item} index={index} />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <div
          className={`flex items-center gap-3 p-3 rounded-md transition-all hover:bg-white/20 ${
            open ? "justify-start" : "justify-center"
          }`}
        >
          <CogIcon className="h-5 w-5" />
          {open && <span className="text-sm font-medium">Settings</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

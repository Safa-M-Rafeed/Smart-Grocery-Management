import { motion } from "framer-motion";
import { BellIcon, UserCircleIcon, Bars3Icon } from "@heroicons/react/24/outline";

const CustomAppBar = ({ handleDrawerToggle, title }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#537D5D] text-white shadow-lg backdrop-blur-md">
      <div className="flex justify-between items-center px-4 sm:px-6 h-16 max-w-[1280px] mx-auto">
        {/* Left - Menu and Title */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDrawerToggle}
            className="md:hidden bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all shadow-sm"
          >
            <Bars3Icon className="h-6 w-6 text-white" />
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl font-bold text-white truncate max-w-[60vw]"
          >
            {title}
          </motion.h1>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg relative shadow-sm"
          >
            <BellIcon className="h-6 w-6 text-white" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full px-1.5">
              3
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg shadow-sm"
          >
            <UserCircleIcon className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default CustomAppBar;

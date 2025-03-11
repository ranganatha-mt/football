import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "../components/Menu";
import Navbar from "../components/Navbar";

export const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen h-full flex">
      {/* LEFT (Sidebar) */}
      <div
        className={`bg-white shadow-md md:shadow-none transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "w-[18%] sm:w-[50%] md:w-[8%] lg:w-[16%] xl:w-[14%]" : "w-0 md:w-[8%] lg:w-[16%] xl:w-[14%]"
        }`}
      >
        <div className="p-4">
          
          <div className="hidden lg:block font-bold">
          <Link to="/">
            <img src="/proplay_logo.png" alt="ProPlay" className="h-50" />
            </Link>
          </div>


          <Menu />
        </div>
      </div>

      {/* RIGHT (Content) */}
      <div
        className={`bg-[#F7F8FA] overflow-scroll flex flex-col transition-all duration-300 ${
          isMenuOpen ? "w-[86%]" : "w-full"
        } md:w-[92%] lg:w-[84%] xl:w-[86%]`}
      >
        <Navbar toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
            <div className="min-h-screen w-full h-full flex flex-col bg-cover bg-center relative" style={{ backgroundImage: "url('/bg3.png')" }}>
                {children}
            </div>
      </div>
    </div>
  );
};

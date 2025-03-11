import { Link } from "react-router-dom";
import { Menu as MenuIcon } from "lucide-react";
import { useAuthStore } from "../store/authUser";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = ({ toggleMenu }) => {
  const {
    user: { profile_picture, full_name, user_type },
  } = useAuthStore();

  const imageUrl = profile_picture ? `${API_BASE_URL}${profile_picture}` : "/avatar.png";

  return (
    <div className="bg-gray-800 text-white flex items-center justify-between p-4 shadow-md">
      {/* Left - Menu Icon (☰) */}
      <button onClick={toggleMenu} className="text-white md:hidden">
        <MenuIcon size={28} />
      </button>

      <div className="flex-grow flex justify-center lg:hidden">
      <Link to="/">
        <img src="/proplay_logo.png" alt="ProPlay" className="h-12" />
        </Link>
      </div>

      {/* Right - User Info & Avatar */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex flex-col text-right">
          <span className="text-xs font-medium leading-3">{full_name}</span>
          <span className="text-[10px] text-white">{user_type}</span>
        </div>
        <img
          src={imageUrl}
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Navbar;

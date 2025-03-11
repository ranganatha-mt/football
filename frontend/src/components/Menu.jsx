import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["Admin", "Player", "Reviewer"] },
      { icon: "/player.png", label: "Players List", href: "/list/players", visible: ["Admin", "Reviewer"] },
      { icon: "/reviwer.png", label: "Reviewers List", href: "/list/reviewers", visible: ["Admin"] },
      { icon: "/football-pitch.png", label: "Matches List", href: "/matches", visible: ["Admin", "Player", "Reviewer"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["Admin", "Player", "Reviewer"] },
    ],
  },
];

export const Menu = () => {
  const { user } = useAuthStore();
  const role = user?.user_type;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
          {i.items.map((item) =>
            item.visible.includes(role) ? (
              <Link
                to={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-100"
              >
                <img src={item.icon} alt={item.label} width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
};

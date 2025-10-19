import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Jobs",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/40c398d3bbfd27d8cc6e74549c75d584e0edbaa2?width=92",
    path: "/dashboard",
  },
  {
    name: "Scholarships",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/30c7e3c9fcad3cb93f14c9788fc8e7e906581960?width=106",
    path: "/dashboard",
  },
  {
    name: "Profile",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/33dee74ce672a2588998e433d48d3cbd47f85db5?width=100",
    path: "/dashboard",
  },
  {
    name: "Resume",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/8d564c7fceb052c952b6dde7d864dd6296eee352?width=110",
    path: "/upload",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-full md:w-44 lg:w-52 bg-husky-purple flex flex-col items-center py-6 md:py-8 flex-shrink-0">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/dc095ce5ac4ad7c9950418b703bcde8f1845fd69?width=210"
        alt="Washington Huskies"
        className="w-20 h-14 md:w-24 md:h-16 object-contain mb-12 md:mb-16"
      />

      <nav className="flex flex-row md:flex-col gap-4 md:gap-8 w-full px-2 justify-center md:justify-start">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col md:flex-row items-center gap-1 md:gap-2 text-white hover:opacity-80 transition-opacity",
              location.pathname === item.path && "opacity-100",
            )}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
            />
            <span className="text-xs md:text-base lg:text-xl font-kavoon text-center md:text-left">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

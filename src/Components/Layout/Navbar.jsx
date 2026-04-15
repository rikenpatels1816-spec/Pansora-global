import { useLocation, useNavigate } from "react-router-dom";

const MENUS = [
  { label: "Home", href: "/", hot: false },
  { label: "Top Selling", href: "#top-selling", hot: false },
  { label: "Categories", href: "/categories", hot: false },
  { label: "About Us", href: "/about", hot: false },
  { label: "Contact Us", href: "/contact", hot: false },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="inner">
        <ul className="menuList">
          {MENUS.map((item, i) => {
            const isActive = location.pathname === item.href;

            return (
              <li key={item.label} className="menuItem">
                <button
                  className={`menuBtn ${
                    isActive ? "active" : ""
                  } ${item.hot ? "sale" : ""}`}
                  onClick={() => {
  if (item.href.startsWith("#")) {
    // If already on home
    if (location.pathname === "/") {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home first, then scroll
      navigate("/", { state: { scrollTo: item.href } });
    }
  } else {
    navigate(item.href);
  }
}}
                >
                  {item.label}

                  {item.hot && <span className="dot" />}
                  {isActive && <span className="underline" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
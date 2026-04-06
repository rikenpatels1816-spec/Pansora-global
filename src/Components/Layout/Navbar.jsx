import { useState } from 'react'
import { href } from 'react-router-dom'

const MENUS = [
  { label: 'Home',  href: "/home" ,        hot: false },
  { label: 'Top Selling', hot: true  },
  { label: 'Products', href: "/categories" ,  hot: false },
  { label: 'About Us',        hot: false },
  { label: 'Contact Us',          hot: false },
]

export default function Navbar() {
  const [active, setActive] = useState(0)

  return (
    <nav className="nav">
      <div className="inner">
        <ul className="menuList">
          {MENUS.map((item, i) => (
            <li key={item.label} className="menuItem">
              <button
                className={`menuBtn ${active === i ? 'active' : ''} ${item.label === 'Top Selling' ? 'sale' : ''}`}
                onClick={() => {
                  setActive(i);
                  if (item.href) navigate(item.href);
                }}  
              >
                {item.label}
                {item.hot && <span className="dot" />}
                {active === i && <span className="underline" />}
              </button>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  )
}
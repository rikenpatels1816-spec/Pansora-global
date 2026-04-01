import { useState } from 'react'

const MENUS = [
  { label: 'Home',         hot: false },
  { label: 'Top Selling', hot: true  },
  { label: 'Products',  hot: false },
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
                onClick={() => setActive(i)}
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
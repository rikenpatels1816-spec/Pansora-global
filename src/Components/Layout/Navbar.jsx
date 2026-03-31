import { useState } from 'react'

const MENUS = [
  { label: 'Home',         hot: false },
  { label: 'New Arrivals', hot: true  },
  { label: 'Collections',  hot: false },
  { label: 'Women',        hot: false },
  { label: 'Men',          hot: false },
  { label: 'Accessories',  hot: false },
  { label: 'Beauty',       hot: false },
  { label: 'Home & Living',hot: false },
  { label: 'Sale',         hot: true  },
  { label: 'Editorial',    hot: false },
  { label: 'About',        hot: false },
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
                className={`menuBtn ${active === i ? 'active' : ''} ${item.label === 'Sale' ? 'sale' : ''}`}
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
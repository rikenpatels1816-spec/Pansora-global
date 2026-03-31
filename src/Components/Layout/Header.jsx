import { useState } from 'react'
import logo from '../../assets/Images/logo2.png'

export default function Header() {
  const [searchVal, setSearchVal] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <header className="header">
      <div className="inner">

        {/* Logo */}
        <div className="logo">
          <div className="logoMark">
            <img src={logo} className='logo' />
          </div>
        </div>

        {/* Search */}
        <div className={`searchWrap ${focused ? 'searchFocused' : ''}`}>
          <svg className="searchIcon" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="searchInput"
            type="text"
            placeholder="Search collections, stories, items…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {searchVal && (
            <button className="clearBtn" onClick={() => setSearchVal('')}>✕</button>
          )}
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="cartBtn" title="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="cartBadge">0</span>
          </button>
        </div>

      </div>
    </header>
  )
}
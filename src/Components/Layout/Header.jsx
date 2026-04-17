import { useState, useRef, useEffect } from "react";
import logo from '../../assets/Images/logo2.png'
import { useNavigate } from "react-router-dom";


export default function Header() {
  const [searchVal, setSearchVal] = useState('')
  const [focused, setFocused] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
  const dropdownRef = useRef();

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

async function fetchWishlistCount() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || !user.Cust_Code) return;

  try {
    const res = await fetch(
      `https://apis.ganeshinfotech.org/api/wishlist/GetWishlist/${user.Cust_Code}`
    );

    const data = await res.json();

    console.log("Wishlist Count Response:", data);

    // adjust based on API response
    const list = data?.data || [];

    setWishlistCount(list.length);

  } catch (err) {
    console.error(err);
  }
}

async function handleSearch(value) {
  setSearchVal(value);

  if (!value.trim()) {
    setResults([]);
    return;
  }

  try {
    setLoading(true);

    // 🔥 call all APIs
    const [catRes, subRes, itemRes] = await Promise.all([
      fetch("https://apis.ganeshinfotech.org/api/Home/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }).then(r => r.json()),

      fetch("https://apis.ganeshinfotech.org/api/Home/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }).then(r => r.json()),

      fetch("https://apis.ganeshinfotech.org/api/Home/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }).then(r => r.json())
    ]);

    const categories = catRes?.data || [];
    const subcategories = subRes?.data || [];
    const items = itemRes?.data || [];

    const query = value.toLowerCase();

    const filtered = [
      ...categories
        .filter(c => c.IC_Name?.toLowerCase().includes(query))
        .map(c => ({ ...c, type: "category" })),

      ...subcategories
        .filter(s => s.ISC_Name?.toLowerCase().includes(query))
        .map(s => ({ ...s, type: "subcategory" })),

      ...items
        .filter(i => i.Itm_Name?.toLowerCase().includes(query))
        .map(i => ({ ...i, type: "item" }))
    ];

    setResults(filtered.slice(0, 8)); // limit results

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}


useEffect(() => {
  function handleUpdate() {
    fetchWishlistCount();
  }

  window.addEventListener("wishlistUpdated", handleUpdate);

  return () =>
    window.removeEventListener("wishlistUpdated", handleUpdate);
}, []);



  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="inner">

        <div className="logo">
          <div className="logoMark">
            <img src={logo} className='logo' />
          </div>
        </div>

        <div className={`searchWrap ${focused ? 'searchFocused' : ''} ${searchOpen ? 'searchVisible' : ''}`}>
          <svg className="searchIcon" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="searchInput"
            type="text"
            placeholder="Search collections, stories, items…"
            value={searchVal}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {searchVal && (
            <button className="clearBtn" onClick={() => setSearchVal('')}>✕</button>
          )}
        {(results.length > 0 || loading) && (
  <div className="searchDropdown">

    {loading && <div className="searchItem">Searching...</div>}

    {results.map((item, i) => (
      <div
        key={i}
        className="searchItem"
        onClick={() => {
          setResults([]);
          setSearchVal("");

          if (item.type === "category") {
            navigate("/categories");
          }

          if (item.type === "subcategory") {
            navigate(`/categories/${item.IC_Id}`);
          }

          if (item.type === "item") {
            navigate(`/productdetails/${item.Itm_Code}`);
          }
        }}
      >
        <span className="typeTag">{item.type}</span>

        <span>
          {item.IC_Name || item.ISC_Name || item.Itm_Name}
        </span>
      </div>
    ))}

  </div>
)}
        </div>


        <div className="actions">

          {/* Mobile search toggle */}
          <button
            className="searchToggleBtn"
            onClick={() => setSearchOpen(o => !o)}
            title="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Login / Signup */}
          {user ? (
            <div className="userWrapper" ref={dropdownRef}>

              <div
                className="userBox"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="userIcon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M20 21a8 8 0 1 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                <span className="userName">
                  {user.Cust_Name}
                </span>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="userDropdown">

                  <div
                    className="dropdownItem"
                    onClick={() => navigate("/profile")}
                  >
                     Update Profile
                  </div>

                  <div
                    className="dropdownItem logout"
                    onClick={() => {
                      sessionStorage.removeItem("user");
                      navigate("/login");
                    }}
                  >
                     Logout
                  </div>

                </div>
              )}
            </div>
          ) : (
            <button className="authBtn" onClick={() => navigate("/login")}>
              <span className="authBtnFull">Login / Sign up</span>
              <span className="authBtnShort">Login</span>
            </button>
          )}

          {/* Cart */}
          <button className="cartBtn" title="Wish List" onClick={() => navigate("/wishlist")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="cartBadge">
              {wishlistCount}
            </span>
          </button>

        </div>
      </div>
    </header>
  )
}
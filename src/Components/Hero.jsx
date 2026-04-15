import { useEffect, useState } from 'react'
import '../assets/Css/Common.css'
import { getTopSelling } from '../api/ProductApi'

export default function Hero() {
  const [products, setProducts] = useState([])
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/"

  // Fetch products
  useEffect(() => {
    async function fetchData() {
      const data = await getTopSelling()
      setProducts(data.slice(0, 5))
    }
    fetchData()
  }, [])

  // Auto slide
  useEffect(() => {
    if (products.length === 0) return
    const id = setInterval(() => {
      setCurrent(prev => (prev + 1) % products.length)
    }, 4000)
    return () => clearInterval(id)
  }, [products])

  // 🔥 FIX: reset added when slide changes
  useEffect(() => {
    setAdded(false)
  }, [current])

  const goTo = (idx) => {
    if (animating || idx === current) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 500)
  }

  if (products.length === 0) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,#163a7c,#1E4FA5)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(83,188,213,0.3)',
            borderTop: '3px solid #53BCD5',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Loading Products…
          </p>
        </div>
      </div>
    )
  }

  const product = products[current]

  // 🔥 Wishlist Function
  async function handleWishList() {
    if (adding || added) return

    const user = JSON.parse(sessionStorage.getItem("user"))

    if (!user || !user.Cust_Code) {
      window.location.href = "/login"
      return
    }

    try {
      setAdding(true)

      const res = await fetch(
        `https://apis.ganeshinfotech.org/api/wishlist/AddToWishList`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Cust_Code: user.Cust_Code,
            Itm_Code: product?.Itm_Code,
          }),
        }
      )

      const data = await res.json()

      if (data?.success) {
        alert("Added to wishlist");
        setAdded(true)
        window.dispatchEvent(new Event("wishlistUpdated"))

      } else {
        alert(data?.message || "Already added")
        setAdded(true)
      }

    } catch (err) {
      console.error(err)
      alert("Error adding wishlist")
    } finally {
      setAdding(false)
    }
  }

  // Safe image
  const heroImage =
    product.Item_Images?.[1] || product.Item_Images?.[0]

  return (
    <section className="hero">

      <div className="content">
        <div className="textBlock" key={current}>

          <span className="eyebrow">
            #{product.Itm_Code}
          </span>

          <h1 className="title">
            {product.Itm_Name.length > 50
              ? product.Itm_Name.substring(0, 50) + '…'
              : product.Itm_Name}
          </h1>

          <p className="subtitle">
            {(product.Itm_Desc || "Premium quality product from Pansora Global")
              .substring(0, 120)}…
          </p>

          <div className="ctaRow">
            <button
              className="ctaSecondary"
              onClick={handleWishList}
            >
              { adding ? "Adding..." : "Add to Wish List"}
            </button>
          </div>

        </div>

        <div className="heroImageWrap">
          <img
            src={IMAGE_BASE + heroImage}
            alt={product.Itm_Name}
            className="heroImage"
          />
        </div>
      </div>

      {/* DOTS */}
      <div className="dots">
        {products.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? 'dotActive' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* ARROWS */}
      <button
        onClick={() => goTo((current - 1 + products.length) % products.length)}
        style={arrowStyle('left')}
      >
        ‹
      </button>

      <button
        onClick={() => goTo((current + 1) % products.length)}
        style={arrowStyle('right')}
      >
        ›
      </button>

      {/* COUNTER */}
      <div style={{
        position: 'absolute',
        bottom: 36,
        right: 40,
        zIndex: 20,
        display: 'flex',
        gap: 4
      }}>
        <span style={{ fontSize: 28, color: '#53BCD5' }}>
          0{current + 1}
        </span>
        <span>/</span>
        <span>0{products.length}</span>
      </div>

    </section>
  )
}

function arrowStyle(side) {
  return {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [side]: 20,
    width: 44,
    height: 44,
    borderRadius: '50%',
    cursor: 'pointer'
  }
}
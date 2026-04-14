import { useEffect, useState } from 'react'
import '../assets/Css/Common.css'
import { getTopSelling } from '../api/ProductApi'

export default function Hero() {
  const [products, setProducts] = useState([])
  const [current, setCurrent]   = useState(0)
  const [animating, setAnimating] = useState(false)
  const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/";

  // Fetch products
  useEffect(() => {
    async function fetchData() {
      const data = await getTopSelling()
      setProducts(data.slice(0, 5))
    }
    fetchData()
  }, [])

  const goTo = (idx) => {
    if (animating || idx === current) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 500)
  }

  useEffect(() => {
    if (products.length === 0) return
    const id = setInterval(() => {
      setCurrent(prev => (prev + 1) % products.length)
    }, 4000)
    return () => clearInterval(id)
  }, [products])

  if (products.length === 0) {
    return (
      <div style={{
        minHeight:'60vh', display:'flex', alignItems:'center',
        justifyContent:'center',
        background:'linear-gradient(135deg,#163a7c,#1E4FA5)'
      }}>
        <div style={{textAlign:'center'}}>
          <div style={{
            width:48,height:48,borderRadius:'50%',
            border:'3px solid rgba(83,188,213,0.3)',
            borderTop:'3px solid #53BCD5',
            animation:'spin 0.8s linear infinite',
            margin:'0 auto 16px'
          }}/>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:14,letterSpacing:1}}>
            Loading Products…
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  const product = products[current]

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
            <button className="ctaSecondary">
              Get Quote
            </button>
          </div>

        </div>

        <div className="heroImageWrap">
          <img
            src={IMAGE_BASE + product.Item_Images[1]}
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
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => goTo((current - 1 + products.length) % products.length)}
        style={arrowStyle('left')}
        aria-label="Previous"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % products.length)}
        style={arrowStyle('right')}
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Slide counter */}
      <div style={{
        position:'absolute', bottom:36, right:40, zIndex:20,
        fontFamily:"'Playfair Display',serif",
        display:'flex', alignItems:'baseline', gap:4
      }}>
        <span style={{fontSize:28,fontWeight:700,color:'#53BCD5'}}>
          0{current+1}
        </span>
        <span style={{fontSize:15,color:'rgba(255,255,255,0.25)'}}>/</span>
        <span style={{fontSize:13,color:'rgba(255,255,255,0.35)'}}>
          0{products.length}
        </span>
      </div>

    </section>
  )
}

function arrowStyle(side) {
  return {
    position:'absolute',
    top:'50%', transform:'translateY(-50%)',
    [side]: 20,
    zIndex:20,
    width:44, height:44, borderRadius:'50%',
    border:'1.5px solid rgba(83,188,213,0.30)',
    background:'rgba(83,188,213,0.08)',
    color:'rgba(255,255,255,0.7)',
    display:'flex', alignItems:'center', justifyContent:'center',
    cursor:'pointer',
    transition:'all 0.2s',
  }
}
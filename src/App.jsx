import React from 'react'

import Header from './Components/Layout/Header'
import Navbar from './Components/Layout/Navbar'
import Hero from './Components/Hero'
import SubCat from './Components/SubCategories'
import './App.css'
import './assets/Css/Common.css'
import TopProducts from './Components/TopProducts'

const App = () => {
  return (
    <div className='app'>
      <Header />
      <Navbar />
      <Hero />
      <SubCat />
      <TopProducts />
    </div>
  )
}

export default App
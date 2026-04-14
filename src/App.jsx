import React from 'react'

import Hero from './Components/Hero'
import SubCat from './Components/SubCategories'
import './App.css'
import './assets/Css/Common.css'
import TopProducts from './Components/TopProducts'
import ContactSnippet from './Components/ContactSnippet'

const App = () => {
  return (
    <div className='app'>
      <Hero />
      <SubCat />
      <TopProducts />
      <ContactSnippet />
    </div>
  )
}

export default App
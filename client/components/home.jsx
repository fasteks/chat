import React from 'react'
import Head from './head'

import Main from './main'
import Sidebar from './sidebar'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Head title="Home" />
      <div className="min-h-screen flex">
        <Sidebar />
        <Main />
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home

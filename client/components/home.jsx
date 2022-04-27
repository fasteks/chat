import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Head from './head'
// import Main from './main'
import Sidebar from './sidebar'

import { getChannels } from '../redux/reducers/channels'

const Home = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getChannels())
  }, [])

  return (
    <div className="min-h-screen">
      <Head title="Main" />
      <div className="min-h-screen flex">
        <Sidebar />
        {/* <Main /> */}
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home

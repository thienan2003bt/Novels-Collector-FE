import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../Partials/index'

const DefaultLayout = () => {
  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </>
  )
}

export default DefaultLayout

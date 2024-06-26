import React from 'react'

import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
} from '@coreui/react'

import { AppSidebarNav } from '../SidebarNavigation/AppSidebarNav'

import logo from '../../../../assets/images/logo.png'
//sidebar nav config
import navigation from '../Navigation/Navigation'

const AppSidebar = () => {

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
    >
      <CSidebarHeader className="align-self-center" >
        <CSidebarBrand to="/" >
          <CImage src={logo} width={80} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark

        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">

      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

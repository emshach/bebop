import * as React from 'react'
import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled, alpha } from '@mui/material/styles'

const drawerWidth = 240

const StyledDivider = styled( Divider )(({ theme }) => ({
  '&.MuiDivider-root': {
    borderColor: 'rgba(255,255,255,0.12)'
  }
}))

export default function ResponsiveDrawer( props ) {
  const {
    window,
    menu,
    appBarContent,
    pageClass,
    mainClass,
    mainContent,
    navigate,
    current,
    sx,
    ...restProps
  } = props
  const [ mobileOpen, setMobileOpen ] = React.useState( false )

  const handleDrawerToggle = () => {
    setMobileOpen( !mobileOpen )
  }

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: 'transparent', border: '0 none' }} />
      <List sx={{
        '& .MuiListItem-root.Mui-selected': {
          backgroundColor: 'rgba(255,255,255,0.25)'
        }
      }}>{
        (menu || []).map( item => (
          item ?
             <ListItem button
                       key={ item.link }
                       selected={ item.link === current }
                       onClick={ e => {
                         navigate( item.link )
                       }}>
               { item.icon ?
                 <ListItemIcon sx={{ color: 'white' }}>{ item.icon }</ListItemIcon>
                 : ''}
               <ListItemText primary={ item.title } />
             </ListItem>
          : <StyledDivider />
        ))
      }</List>
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  sx.display = 'flex'

  return (
    <Box { ...restProps } className={ `page ${ pageClass || '' }`} sx={ sx }>
      <CssBaseline />
      <AppBar
        position="fixed"
        className="appbar"
        sx={{
          width: { sm: `calc(100% - ${ drawerWidth }px)` },
          ml: { sm: `${ drawerWidth }px` },
        }}
        elevation={0}
      >
        <Toolbar className="toolbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={ handleDrawerToggle }
            sx={{ mr: 2, display: { sm: 'none' }}}
          >
            <MenuIcon />
          </IconButton>
          { appBarContent }
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              backgroundColor: 'transparent',
              color: 'white',
              boxSizing: 'border-box',
              width: drawerWidth,
              border: '0 none'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        className={ mainClass }
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* <Toolbar /> */}
        { mainContent }
      </Box>
    </Box>
  )
}

import React from 'react';
import { Link as RouterLink, useLocation, Outlet } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import StorageIcon from '@mui/icons-material/Storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
//import SettingsIcon from '@mui/icons-material/Settings';

function DrawerNavigation() {
  const location = useLocation();
  const drawerWidth = 240;

  const drawerItems = [
    { icon: <HomeIcon />, label: 'Home', path: '/' },
    { icon: <StorageIcon />, label: 'Inventory', path: '/inventory' },
    { icon: <CloudUploadIcon />, label: 'Upload', path: '/upload' },
    { icon: <CloudUploadIcon />, label: 'Upload_auto', path: '/upload_auto' },
    { icon: <AccountCircleIcon />, label: 'Profile', path: '/profile' }
    //{ icon: <SettingsIcon />, label: 'Settings', path: '/settings' }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0 }}
        variant="permanent"
        anchor="left"
        open
      >
        <List>
          {drawerItems.map((item) => (
            <ListItem 
              button 
              key={item.label} 
              component={RouterLink} 
              to={item.path} 
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: 3 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default DrawerNavigation;

import React from "react";
import { FaBars } from "react-icons/fa";
import { styled, createTheme } from '@mui/material/styles';
import AppBar from  '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from '@mui/icons-material/AccountCircleRounded';
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from '@mui/material/ToggleButton';
import Menu from "@mui/material/Menu";

const Header = ({toggled,
    collapsed,
    rtl,
    handleToggleSidebar,
    handleCollapsedChange,
    handleRtlChange}:
    {toggled:boolean, collapsed:boolean, rtl:boolean, handleToggleSidebar:(value: boolean) => void,handleCollapsedChange:(value: any)=>void,handleRtlChange:(value:any)=>void;}) => {

    const theme = createTheme();
  const Root = styled('div')(({theme})=> ({
      flexGrow: 1
  }));

  const MenuBtn = styled(ToggleButton)(({theme})=> ({
    marginRight: theme.spacing(2)
  }));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <header>
      <Root>
        <AppBar position="static">
          <Toolbar>
            <MenuBtn value="check"
                selected={collapsed}
                onChange={() => {
                handleCollapsedChange(!collapsed);
                }} >
              <FaBars />
            </MenuBtn>
            <Typography variant="h6" flexGrow={1}>
              Digital Twin Framework
            </Typography>
    
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Root>
    </header>
  );
};

export default Header;
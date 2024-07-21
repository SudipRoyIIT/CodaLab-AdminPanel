import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = ({ setCurrentUser }, { userRole }) => {
  console.log("This is user role form Heder", userRole);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    navigate("/Signup");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    setCurrentUser(null);
    navigate("/signin");
    handleMenuClose();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{ borderBottom: 1, borderColor: "#ccc", marginBottom: 2 }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <div
            style={{
              backgroundImage:
                "url(https://i.ibb.co/378LhGr/Whats-App-Image-2024-06-22-at-23-41-20-cc83bb23.jpg)",
              width: 40,
              height: 40,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "50%",
              marginRight: 2,
            }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            CoDa Lab @IITR
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontWeight: "bold",
              bgcolor: "#cce6ff",
              padding: "5px 15px",
              borderRadius: "30px",
              marginRight: 2,
            }}
          >
            Dashboard
          </Typography>
          <Avatar
            sx={{ bgcolor: "#ccc", cursor: "pointer" }}
            onClick={handleAvatarClick}
          >
            A
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLoginClick}>Signup</MenuItem>
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

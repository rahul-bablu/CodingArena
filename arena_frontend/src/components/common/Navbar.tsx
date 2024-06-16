import { Logout } from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Avatar, Button, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import style from "./Navbar.module.css";

function UserDisplay({ user, logOut }: { user: string, logOut:()=>void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  return (
    <div>
      <Button
      
        sx={{ margin:0,padding:0,textTransform: 'none', color:'inherit', display: "flex", alignItems: "center", '&:hover': {backgroundColor: 'inherit'}, '&:checked':{} }}
        disableRipple
        
        onClick={handleClick}
      >
        <Avatar sx={{ height: "30px", width: "30px", marginRight: 1 }}></Avatar>{" "}
        {user}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <MenuItem onClick={() => navigate('/admin/contests')}><ListItemIcon><AdminPanelSettingsIcon/></ListItemIcon>Admin View</MenuItem>
        <Divider />
        <MenuItem onClick={logOut}><ListItemIcon>

        
            <Logout fontSize="small" />
          </ListItemIcon>Logout</MenuItem>
      </Menu>
    </div>
  );
}

const Navbar = () => {
  const pages = ["Problems", "Contests"];
  const move = ["/", "/contests"] as string[];
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logOut } = useAuth() || { user: undefined };

  return (
    <nav className={style.nav}>
      
      {user ? <UserDisplay user={user} logOut={logOut} /> : location.pathname == '/login' ? <></> :<Link to="/login">Login</Link>}
      <div
        style={{
          fontFamily: "cursive",
          fontSize: "x-large",
          fontWeight: "bold",
        }}
      >
        Coding Arena
      </div>
      {move.find((path) => location.pathname == path) ? (
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            justifyContent: "space-evenly",
            gap: 10,
          }}
        >
          {pages.map((page, index) => (
            <div
              style={{ position: "relative" }}
              className={style.navMenuItem}
              onClick={() => navigate(move[index])}
            >
              {page}

              <div
                style={{
                  position: "absolute",
                  margin: "auto",
                  bottom: -16,
                  transition: "width 2s",
                  width: location.pathname == move[index] ? "100%" : "0%",
                  backgroundColor: "black",
                  height: "4px",
                }}
              ></div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
};

export default Navbar;

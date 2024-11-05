import { Logout } from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./Navbar.module.css";

// import Logo from '../../../public/plogo_for_cc.svg';
import { motion } from "framer-motion";
import "./Navbar.module.css";
import "./styles.css";

function UserDisplay({ user, logOut }: { user: string; logOut: () => void }) {
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
        sx={{
          margin: 0,
          padding: 0,
          textTransform: "none",
          color: "inherit",
          display: "flex",
          alignItems: "center",
          "&:hover": { backgroundColor: "inherit" },
          "&:checked": {},
        }}
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
        <MenuItem onClick={() => navigate("/admin/home")}>
          <ListItemIcon>
            <AdminPanelSettingsIcon />
          </ListItemIcon>
          Admin View
        </MenuItem>
        <Divider />
        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  color: "var(--text-color)",
  position: "relative",
  fontSize: "0.95rem",
  paddingInline: "10px",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "2px",
    display: "block",
    marginTop: "20px",
    right: "0",
    background: "var(--text-color)",
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "95%",
    left: "0",
    backgroundColor: "var(--text-color)",
  },
}));

const NavBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff12",
  backdropFilter: "blur(8px)",
  color: theme.palette.text.primary,
  // borderBottom: `1px solid ${theme.palette.divider}`,
  position: "fixed",
  paddingBlock: "5px",
  width: "100%",
  
  top: 0,
  zIndex: 100,
}));

const Navbar = () => {
  const pages = ["Anouncements", "Contests"];
  const move = ["/tt#asdfghjkl", "/contests"] as string[];
  const navigate = useNavigate();
  const location = useLocation();
  // const { user, logOut } = useAuth() || { user: undefined };

  return (
    <NavBox>
      <motion.div
      initial={{ y: '-110%' }}
      style={{display: "flex",
        alignItems: "center",
        justifyContent: "space-around",}}
      animate={
        { y: 0 }
      }
      transition={{ duration: 0.5 , ease: "easeOut", delay: 2.5 }}
    >
      {/* <nav className={""} style={{}}> */}

      {/* {user ? <UserDisplay user={user} logOut={logOut} /> : location.pathname == '/login' ? <></> :<Link to="/login">Login</Link>} */}
      <div className="__name-logo">Coding Club</div>
      {/* <Logo /> */}
      {/* <img src={Logo} width={100}/> */}
      {
        <div className={"__nav-buttons "+style.nav}>
          {pages.map((page, index) => (
            <NavButton onClick={() => navigate(move[index])}>{page}</NavButton>
          ))}
        </div>
      }
      </motion.div>
      {/* </nav> */}
    </NavBox>
  );
};

export default Navbar;

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from "./FireBase_Config";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import './navbar.css';

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
const drawerWidth = 240;


function Nabvar(props) {
    const [WhetherUserExist, SetWhetherUserExist] = useState(false);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [college, SetCollege] = useState("");

    const handleClose = () => { setShow(false) }; 

    const status = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                SetCollege(localStorage.getItem("College"));
                SetWhetherUserExist(true);
            }
            else {
                navigate("/");
                SetWhetherUserExist(false);
            }
        })
    }
    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('College');
        localStorage.removeItem('Occupation');
        setShow(true);
    }

    const login = () => {
        navigate("/loginpage");
    }

    useEffect(() => {
        status();
    }, [WhetherUserExist])

    const location = useLocation();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const container = window !== undefined ? () => window().document.body : undefined;

    let navItems = ['Add Research Paper', 'My Profile', 'Statistics', 'View Research Paper', 'Help'];

    const navigateMe = (e, item) => {
        e.preventDefault();
        if (item === "Add Research Paper") {
            navigate(`/adddocument`)
        }
        else if (item === "My Profile") {
            navigate(`/myactivity`)
        }
        else if (item === "Statistics") {
            navigate(`/statistics`)
        }
        else if (item === "View Research Paper") {
            navigate(`/showdocument`)
        }
        else if (item === "Help") {
            navigate(`/help`)
        }
    }
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Research Paper
            </Typography>
            <Divider />
            <List >
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton onClick={(e) => { navigateMe(e, item) }} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" style={{ backgroundColor: "#071e3d" }} >
                    <Toolbar onClick={() => { handleDrawerToggle() }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => { navigate(`/`) }}
                            style={{ cursor: "pointer" }}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                            <Typography variant="h6" sx={{ ml: 1 }}>
                                {
                                    college === " " ? <span> Research Paper</span> : <span> {college}</span>
                                }
                            </Typography>
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, mr: 40 }}
                            onClick={() => { navigate(`/`) }}
                            style={{ cursor: "pointer" }}
                        >
                            {
                                college === " " ? <span> Research Paper</span> : <span> {college}</span>
                            }
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {
                                WhetherUserExist ?
                                    <div> <NavLink className='mynavitem' id={location.pathname === "/adddocument" ? "activenav" : ""} to="/adddocument">Add Research Paper</NavLink> &nbsp;&nbsp;&nbsp;
                                        <NavLink className='mynavitem' id={location.pathname === "/myactivity" ? "activenav" : ""} to="/myactivity">My Profile</NavLink> &nbsp;&nbsp;&nbsp;
                                        <NavLink className='mynavitem' id={location.pathname === "/statistics" ? "activenav" : ""} to="/statistics">Statistics</NavLink> &nbsp;&nbsp;&nbsp;
                                        <NavLink className='mynavitem' id={location.pathname === "/showdocument" ? "activenav" : ""} to="/showdocument">View Research Paper</NavLink> &nbsp;&nbsp;&nbsp;
                                        <NavLink className='mynavitem' id={location.pathname === "/help" ? "activenav" : ""} to="/help">Help</NavLink> &nbsp;&nbsp;&nbsp;
                                        <button id="mybutton" type="submit" onClick={logout} className="btn btn-primary btn-block mb-1 "> Log Out </button>
                                    </div> :
                                    <div> <NavLink className='mynavitem' id={location.pathname === "/showdocument" ? "activenav" : ""} to="/showdocument">View Research Paper</NavLink>
                                        <NavLink className='mynavitem' id={location.pathname === "/help" ? "activenav" : ""} to="/help">Help</NavLink> &nbsp;&nbsp;&nbsp;
                                        <button type="submit" onClick={login} className="btn btn-primary btn-block mb-1 "> Login </button>
                                    </div>

                            }
                        </Box>
                    </Toolbar>
                </AppBar>
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
                </Drawer> <br /> <br />
            </Box>
            <Modal style={{ zIndex: "10" }} show={show} onHide={handleClose}>
                <Modal.Body>You are successfully logged out.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default Nabvar;  
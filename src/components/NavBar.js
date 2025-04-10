import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../resources/pngs/logoCircle.png';

function Navbar({ isLoggedIn }) {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    return (
        <nav style={styles.navbar}>
            {/* Logo that links to the home page */}
            <Link to="/" style={styles.logoLink}>
                <img src={logo} alt="Logo" style={styles.logo} />
            </Link>

            {isLoggedIn && (
                <div style={styles.links}>
                    <Link to="/add-person" style={styles.link}>Add Person</Link>
                    <Link to="/add-cemetery" style={styles.link}>Add Cemetery</Link>
                    <Link to="/map" style={styles.link}>Map</Link>

                    <div>
                        <div style={styles.link} onClick={toggleSubMenu}>
                            Lists
                            <span style={styles.arrow}>
                                {isSubMenuOpen ? '▲' : '▼'}
                            </span>
                        </div>

                        {isSubMenuOpen && (
                            <div style={styles.submenu}>
                                <Link to="/people-list" style={styles.submenuLink}>Person List</Link>
                                <Link to="/cemetery-list" style={styles.submenuLink}>Cemetery List</Link>
                                <Link to="/plot-list" style={styles.submenuLink}>Plot List</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

const styles = {
    navbar: {
        position: "fixed",
        top: "0",
        left: "0",
        width: "150px",
        height: "100vh",
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: "20px",
        paddingLeft: "10px",
    },
    logoLink: {
        marginBottom: "20px",
        textAlign: "center",
    },
    logo: {
        width: "100px",
        height: "auto",
        cursor: "pointer",
    },
    links: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    link: {
        color: "white",
        textDecoration: "none",
        fontSize: "18px",
        padding: "10px",
        width: "100%",
        textAlign: "left",
        borderRadius: "4px",
        transition: "background-color 0.3s",
        cursor: "pointer",
    },
    submenu: {
        marginLeft: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "10px",
    },
    submenuLink: {
        color: "white",
        textDecoration: "none",
        fontSize: "16px",
        padding: "8px",
        width: "100%",
        textAlign: "left",
        borderRadius: "4px",
        transition: "background-color 0.3s",
    },
    arrow: {
        marginLeft: "8px",
        fontSize: "16px",
    },
};

export default Navbar;

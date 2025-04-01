import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../public/resources/pngs/logo.png'; // Adjust the path based on your structure

function Navbar() {
    // State to toggle the visibility of the submenu
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

            <div style={styles.links}>
                {/* Add Person Link */}
                <Link to="/add-person" style={styles.link}>Add Person</Link>

                {/* Add Cemetery Link */}
                <Link to="/add-cemetery" style={styles.link}>Add Cemetery</Link>

                {/* Lists Main Menu with Arrow */}
                <div>
                    <div
                        style={styles.link}
                        onClick={toggleSubMenu}
                    >
                        Lists
                        {/* Down Arrow */}
                        <span style={styles.arrow}>
                            {isSubMenuOpen ? '▲' : '▼'} {/* Toggle between down and up arrow */}
                        </span>
                    </div>

                    {/* Submenu */}
                    {isSubMenuOpen && (
                        <div style={styles.submenu}>
                            <Link to="/people-list" style={styles.submenuLink}>Person List</Link>
                            <Link to="/cemetery-list" style={styles.submenuLink}>Cemetery List</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        position: "fixed",  // Keeps it fixed to the left
        top: "0",
        left: "0",
        width: "150px",  // Adjust width as needed
        height: "100vh", // Full height
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",  // Align the items on the left
        paddingTop: "20px",
        paddingLeft: "10px",
    },
    logoLink: {
        marginBottom: "20px",  // Space between logo and other links
        textAlign: "center",
    },
    logo: {
        width: "100px",  // Adjust size as needed
        height: "auto",
        cursor: "pointer",  // Makes the logo clickable
    },
    links: {
        display: "flex",
        flexDirection: "column",  // Stack links vertically
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
        marginLeft: "20px",  // Indentation for the submenu
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "10px",  // Space between main and submenu
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
        marginLeft: "8px",  // Space between the text and arrow
        fontSize: "16px",   // Size of the arrow
    },
};

export default Navbar;

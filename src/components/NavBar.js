import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={styles.navbar}>
            <h2 style={styles.logo}>My Website</h2>
            <div style={styles.links}>
                <Link to="/add-person" style={styles.link}>Add Person</Link>
                <Link to="/add-cemetery" style={styles.link}>Add Cemetery</Link>
                <Link to="/people-list" style={styles.link}>Person List</Link>
                <Link to="/cemetery-list" style={styles.link}>Cemetery List</Link>
                <Link to="/map" style={styles.link}>Map</Link>
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        position: "fixed",  // Keeps it fixed to the left
        top: "0",
        left: "0",
        width: "200px",  // Adjust width as needed
        height: "100vh", // Full height
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",  // Align the items on the left
        paddingTop: "20px",
        paddingLeft: "10px",
    },
    logo: {
        margin: "0 0 20px 0",
        fontSize: "24px",
        textAlign: "center",
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
    },
    linkHover: {
        backgroundColor: "#555",
    }
};

export default Navbar;

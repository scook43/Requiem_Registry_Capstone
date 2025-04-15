import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PeopleList from "./person/PeopleList";
import AddPerson from "./person/AddPerson";
import Navbar from "./components/NavBar";
import AddCemetery from "./cemetery/addCemetery";
import CemeteryList from "./cemetery/CemeteryList";
import HomePage from "./HomePage";
import PlotList from "./plot/PlotList";
import CemeteryDetail from "./cemetery/CemeteryDetails";
import Map from "./map/Map";
import PersonDetail from "./person/PersonDetails";
import UserMap from "./map/UserMap";
import Signin from "./signin/signin";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to false to test public view

    const [userProfile, setUserProfile] = useState(null);
    const isLoggedIn = !!userProfile;

    useEffect(() => {
        const savedProfile = localStorage.getItem("googleUser");
        if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
        }
    }, []);

    return (
        <Router>
            <div style={styles.container}>
                <Navbar isLoggedIn={isLoggedIn} />


                {/* Signin top right */}
                <div style={styles.loginBox}>
                    <Signin
                        onLogin={(profile) => setUserProfile(profile)}
                        onLogout={() => setUserProfile(null)}
                    />
                </div>



                <div style={styles.content}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/person/:id" element={<PersonDetail />} />
                        <Route path="/map/UserMap"element={<UserMap />} />

                        {/* Protected admin routes */}
                        {isLoggedIn && (
                            <>
                                <Route path="/add-person" element={<AddPerson />} />
                                <Route path="/add-cemetery" element={<AddCemetery />} />
                                <Route path="/people-list" element={<PeopleList />} />
                                <Route path="/cemetery-list" element={<CemeteryList />} />
                                <Route path="/map" element={<Map />} />
                                <Route path="/plot-list" element={<PlotList />} />
                                <Route path="/cemetery/:id" element={<CemeteryDetail />} />
                            </>
                        )}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

const styles = {
    container: {
        display: "flex",
    },
    content: {
        marginLeft: "200px",
        padding: "20px",
        flexGrow: 1,
    },
    loginBox: {
        position: "absolute",
        top: 10,
        right: 20,
        zIndex: 1000
    }
};

export default App;

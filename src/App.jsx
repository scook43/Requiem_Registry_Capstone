import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PeopleList from "./person/PeopleList"; // Importing People List component
import AddPerson from "./person/AddPerson";
import Navbar from "./components/NavBar";
import AddCemetery from "./cemetery/addCemetery";
import CemeteryList from "./cemetery/CemeteryList";
import HomePage from "./HomePage";  // Import Add Person component
import Map from "./map/Map";
import PlotList from "./plot/PlotList";
import CemeteryDetail from "./cemetery/CemeteryDetails";
import PersonDetail from "./person/PersonDetails";  // Import Add Person component

function App() {
    return (
        <Router>
            <div style={styles.container}>
                <Navbar /> {/* Navbar stays on the left */}
                <div style={styles.content}>
                    <Routes>
                        <Route path="/add-person" element={<AddPerson />} />
                        <Route path="/add-cemetery" element={<AddCemetery />} />
                        <Route path="/" element={<HomePage />} />  {/* Home Page route */}
                        <Route path="/people-list" element={<PeopleList />} />  {/* People List route */}
                        <Route path="/cemetery-list" element={<CemeteryList />} />  {/* Separate route for Cemetery List */}
                        <Route path="/map" element={<Map />} />
                        <Route path="/plot-list" element={<PlotList />} />  {/* Separate route for Cemetery List */}
                        <Route path="/person/:id" element={<PersonDetail />} />
                        <Route path="/cemetery/:id" element={<CemeteryDetail />} />

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
        marginLeft: "200px", // Offset the content by the width of the navbar
        padding: "20px",
        flexGrow: 1,
    },
};

export default App;

import React, { useState, useEffect } from "react";
import supabaseClient from ".//helper/supabaseClient.js";
import logo from './public/resources/pngs/logo.png';

function HomePage() {

    // State for cemeteries, selected cemetery, and cemetery details
    const [cemeteries, setCemeteries] = useState([]);
    const [selectedCemetery, setSelectedCemetery] = useState("");
    const [cemeteryDetails, setCemeteryDetails] = useState(null);

    // State for the search query
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch the cemeteries from your database
    useEffect(() => {
        const fetchCemeteries = async () => {
            const { data, error } = await supabaseClient
                .from("cemetery")  // Assuming your table name is 'cemetery'
                .select("id, name");

            if (error) {
                console.error("Error fetching cemeteries:", error);
            } else {
                setCemeteries(data);
            }
        };
        fetchCemeteries();
    }, []);

    // Fetch selected cemetery details
    useEffect(() => {
        const fetchCemeteryDetails = async () => {
            if (selectedCemetery) {
                const { data, error } = await supabaseClient
                    .from("cemetery")  // Assuming your table name is 'cemetery'
                    .select("*")
                    .eq("id", selectedCemetery)
                    .single();

                if (error) {
                    console.error("Error fetching cemetery details:", error);
                } else {
                    setCemeteryDetails(data);
                }
            } else {
                setCemeteryDetails(null); // Reset details if no cemetery is selected
            }
        };
        fetchCemeteryDetails();
    }, [selectedCemetery]); // Re-run when selectedCemetery changes

    const handleCemeteryChange = (e) => {
        setSelectedCemetery(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            {/* Header Bar */}
            <header style={styles.header}>
                <img src={logo} alt="Logo" style={styles.logo} />
                <h1 style={styles.websiteName}>Requiem Registry</h1>

                {/* Cemetery Selection Dropdown in Header */}
                <div style={styles.control}>
                    <select
                        id="cemetery"
                        value={selectedCemetery}
                        onChange={handleCemeteryChange}
                        style={styles.dropdown}
                    >
                        <option value="">Select a cemetery</option>
                        {cemeteries.map((cemetery) => (
                            <option key={cemetery.id} value={cemetery.id}>
                                {cemetery.name}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Display Cemetery Details */}
            {cemeteryDetails && (
                <div style={styles.cemeteryDetails}>
                    <h2>{cemeteryDetails.name}</h2>
                    <p><strong>Description:</strong> {cemeteryDetails.description}</p>
                    <p><strong>Address:</strong> {cemeteryDetails.address}</p>
                    <p><strong>Phone:</strong> {cemeteryDetails.phone_number}</p>
                    <p><strong>Email:</strong> {cemeteryDetails.email}</p>
                </div>
            )}

            {/* Information Display (e.g., people in cemetery) */}
            <div style={styles.content}>
                {/* You can filter or display people based on the selected cemetery and search query */}
            </div>
            {/* Search Bar below Header */}
            <div style={styles.controls}>
                <div style={styles.control}>
                    <label htmlFor="search" style={styles.label}>Search for People:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by name"
                        style={styles.searchBar}
                    />
                </div>
            </div>
        </div>
    );
}

// Basic CSS styles
const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        backgroundColor: '#333',
        color: 'white',
    },
    logo: {
        width: '50px',
        height: '50px',
        marginRight: '10px',
    },
    websiteName: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginRight: '20px',
    },
    control: {
        display: 'flex',
        flexDirection: 'column',
        width: '20%',
        marginRight: '20px',
    },
    label: {
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    dropdown: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    controls: {
        margin: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    searchBar: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    cemeteryDetails: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    content: {
        marginTop: '30px',
    },
};

export default HomePage;

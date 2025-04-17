import React, { useState, useEffect, useCallback } from "react";
import supabaseClient from "./helper/supabaseClient.js";
import PersonCard from "./person/PersonCard";
import logoResized from "./resources/pngs/logoCircle.png";
import { Link } from "react-router-dom";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Signin from './signin/signin';
//import logo from '../resources/pngs/logoCircle.png';



function HomePage() {
    const [cemeteries, setCemeteries] = useState([]);
    const [selectedCemetery, setSelectedCemetery] = useState("ALL");
    const [cemeteryDetails, setCemeteryDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    

    useEffect(() => {
        const fetchCemeteries = async () => {
            const { data, error } = await supabaseClient
                .from("cemetery")
                .select("id, name");
            if (error) console.error("Error fetching cemeteries:", error);
            else setCemeteries(data);
        };
        fetchCemeteries();
    }, []);

    useEffect(() => {
        const fetchCemeteryDetails = async () => {
            if (selectedCemetery && selectedCemetery !== "ALL") {
                const { data, error } = await supabaseClient
                    .from("cemetery")
                    .select("*")
                    .eq("id", selectedCemetery)
                    .single();
                if (error) console.error("Error fetching cemetery details:", error);
                else setCemeteryDetails(data);
            } else {
                setCemeteryDetails(null);
            }
        };
        fetchCemeteryDetails();
    }, [selectedCemetery]);

    const fetchPeople = useCallback(async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        let query = supabaseClient
            .from("rr_plot")
            .select(`
                tenant_id,
                ceme_id,
                person:tenant_id (
                    id,
                    f_name,
                    m_name,
                    l_name,
                    suffix,
                    birth_date,
                    death_date,
                    biography
                )
            `);

        if (selectedCemetery !== "ALL") {
            query = query.eq("ceme_id", selectedCemetery);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching assigned people:", error);
            return;
        }

        const people = data
            .map((row) => row.person)
            .filter((person) => person !== null)
            .filter((person, index, self) =>
                index === self.findIndex(p => p.id === person.id)
            )
            .filter((person) => {
                const fullName = `${person.f_name} ${person.m_name || ""} ${person.l_name}`.toLowerCase();
                return fullName.includes(searchQuery.toLowerCase());
            });

        setSearchResults(people);
    }, [searchQuery, selectedCemetery]);

    useEffect(() => {
        fetchPeople();
    }, [fetchPeople]);

    return (
        <div>
            {/* Header Bar */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <img src={logoResized} alt="Requiem Registry logo" style={styles.logo} />
                    <h1 className="website-name">Requiem Registry</h1>
                </div>

                {/* Cemetery Dropdown */}
                <div style={styles.control}>
                    <select
                        value={selectedCemetery}
                        onChange={(e) => setSelectedCemetery(e.target.value)}
                        style={styles.dropdown}
                    >
                        <option value="ALL">All Cemeteries</option>
                        {cemeteries.map((cemetery) => (
                            <option key={cemetery.id} value={cemetery.id}>
                                {cemetery.name}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Cemetery Details */}
            {cemeteryDetails && (
                <div style={styles.cemeteryDetails}>
                    <h2>
                    <Link
                        to={`/cemetery/${cemeteryDetails.id}`}
                        state={{ fromHome: true }}  // Pass flag indicating navigation came from HomePage
                        style={styles.cemeteryLink}
                    >
                        {cemeteryDetails.name}
                    </Link>
                </h2>

                    <p><strong>Description:</strong> {cemeteryDetails.description}</p>
                    <p><strong>Address:</strong> {cemeteryDetails.address}</p>
                    <p><strong>Phone:</strong> {cemeteryDetails.phone_number}</p>
                    <p><strong>Email:</strong> {cemeteryDetails.email}</p>
                </div>
            )}

            {/* Search Bar */}
            <div style={styles.controls}>
                <div style={styles.control}>
                    <label htmlFor="search" style={styles.label}>Search for People:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name"
                        style={styles.searchBar}
                    />
                </div>
            </div>

            {/* Search Results */}
            <div style={styles.resultsWrapper}>
                {searchResults.map((person) => (
                    <PersonCard key={person.id} person={person} />
                ))}
            </div>
        </div>
    );

}

const styles = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "white",
    },

    headerLeft: {
        display: "flex",
        alignItems: "center",
    },
    logo: {
        width: "50px",
        height: "50px",
        marginRight: "15px",
    },
    websiteName: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    control: {
        display: "flex",
        flexDirection: "column",
        width: "20%",
    },
    dropdown: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    cemeteryDetails: {
        padding: "20px",
        backgroundColor: "#f1f1f1",
        borderRadius: "8px",
        margin: "20px",
    },
    controls: {
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
    },
    label: {
        marginBottom: "5px",
    },
    searchBar: {
        padding: "10px",
        width: "300px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    resultsWrapper: {
        padding: "20px",
    },
    cemeteryLink: {
        color: "black",
        textDecoration: "underline",
        fontWeight: "bold"
    }
};

export default HomePage;

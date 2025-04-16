import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../resources/css/Map.css';
import logoResized from "../resources/pngs/logoCircle.png";
import supabaseClient from "../helper/supabaseClient";

export default function UserMap() {
    const [cemeteries, setCemeteries] = useState([]);
    const [cemeteryDetails, setCemeteryDetails] = useState(null);
    const [plotLists, setPlotLists] = useState({});
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});
    const [plotAssignments, setPlotAssignments] = useState({});
    const [selectedCemetery, setSelectedCemetery] = useState("");
    const [selectedCemeteryName, setSelectedCemeteryName] = useState("Requiem Registry");

    useEffect(() => {
        const fetchCemeteries = async () => {
            const {data, error} = await supabaseClient.from("cemetery").select("id, name");
            if (error) console.error("Error fetching cemeteries:", error);
            else setCemeteries(data);
        };
        fetchCemeteries();
    }, []);

    useEffect(() => {
        const fetchCemeteryDetails = async () => {
            if (selectedCemetery) {
                const {data, error} = await supabaseClient
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

    useEffect(() => {
        const fetchSavedPlots = async () => {
            if (!selectedCemetery) return;

            const {data, error} = await supabaseClient
                .from("rr_plot")
                .select(`
          plot_number,
          coord_lat,
          coord_long,
          tenant_id,
          person:tenant_id (
            id,
            f_name,
            m_name,
            l_name,
            suffix
          )
        `)
                .eq("ceme_id", selectedCemetery);

            if (error) {
                console.error("Error fetching saved plots:", error);
            } else {
                const savedPlots = [];
                const assignments = {};

                data.forEach(p => {
                    savedPlots.push({
                        id: p.plot_number,
                        x: p.coord_lat,
                        y: p.coord_long
                    });

                    if (p.person) {
                        const name = [p.person.f_name, p.person.m_name, p.person.l_name, p.person.suffix]
                            .filter(Boolean)
                            .join(" ");
                        assignments[`${selectedCemetery}-${p.plot_number}`] = {
                            name,
                            id: p.person.id
                        };
                    }
                });

                setPlotLists(prev => ({
                    ...prev,
                    [selectedCemetery]: savedPlots
                }));

                setPlotAssignments(assignments);
            }
        };
        fetchSavedPlots();
    }, [selectedCemetery]);

    const plots = plotLists[selectedCemetery] || [];

    const handleCemeteryChange = (e) => {
        const cemeteryId = e.target.value;
        setSelectedCemetery(cemeteryId);
        const selected = cemeteries.find(c => c.id.toString() === cemeteryId);
        setSelectedCemeteryName(selected ? selected.name : "Requiem Registry");
        setSelectedPlot(null);
    };

    return (
        <div className="map-container">
            {/* Header with logo and cemetery selection */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <img src={logoResized} alt="Requiem Registry logo" style={styles.logo}/>
                    <h1 className="website-name">{selectedCemeteryName || "Requiem Registry"}</h1>
                </div>
                <div style={styles.control}>
                    <select
                        value={selectedCemetery}
                        onChange={handleCemeteryChange}
                        style={styles.dropdown}
                    >
                        <option value="">Select a cemetery</option>
                        {cemeteries.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Main content layout */}
            <div style={styles.mainContent}>
                {/* Map Section */}
                <div style={styles.mapSection}>
                    {cemeteryDetails?.image_url ? (
                        <img
                            src={cemeteryDetails.image_url}
                            alt="Cemetery Map"
                            style={styles.mapImage}
                        />
                    ) : (
                        <p style={{textAlign: "center"}}>
                            Please select a cemetery to view the map.
                        </p>
                    )}

                    <div id="add-plots-pane">
                        {plots.map((plot) => (
                            <div
                                key={plot.id}
                                className="plot"
                                title={plotAssignments[`${selectedCemetery}-${plot.id}`]?.name || ""}
                                style={{left: `${plot.x}px`, top: `${plot.y}px`}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPlot(plot);
                                    setPopupPosition({x: plot.x + 20, y: plot.y + 20});
                                }}
                            >
                                {plot.id}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Cemetery Details */}
                <div style={styles.sidebar}>
                    {cemeteryDetails && (
                        <div style={styles.cemeteryDetails}>
                            <h2>{cemeteryDetails.name}</h2>
                            <p><strong>Description:</strong> {cemeteryDetails.description}</p>
                            <p><strong>Address:</strong> {cemeteryDetails.address}</p>
                            <p><strong>Phone:</strong> {cemeteryDetails.phone_number}</p>
                            <p><strong>Email:</strong> {cemeteryDetails.email}</p>
                            <p style={{marginTop: "10px"}}>
                                <strong>{plots.length}</strong> of{" "}
                                <strong>{cemeteryDetails.capacity}</strong> plots placed
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Popup for Plot Info */}
            {selectedPlot && (
                <div
                    id="info-popup"
                    style={{left: `${popupPosition.x}px`, top: `${popupPosition.y}px`}}
                >
                    <button
                        className="close-button"
                        onClick={() => setSelectedPlot(null)}
                        aria-label="Close"
                    >
                        ×
                    </button>
                    <h3>Plot {selectedPlot.id}</h3>

                    {plotAssignments[`${selectedCemetery}-${selectedPlot.id}`] ? (
                        <p>
                            <strong>Assigned to:</strong>{" "}
                            <Link
                                to={`/person/${plotAssignments[`${selectedCemetery}-${selectedPlot.id}`].id}?view=readonly`}
                                style={{textDecoration: "underline", color: "#0077cc"}}
                            >
                                {plotAssignments[`${selectedCemetery}-${selectedPlot.id}`].name}
                            </Link>
                        </p>
                    ) : (
                        <p><em>This plot is currently unassigned.</em></p>
                    )}
                </div>
            )}
        </div>
    );
};
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
    mainContent: {
        display: "flex",
        padding: "20px",
        gap: "30px",
    },
    mapSection: {
        position: "relative",
        width: "500px",
        height: "500px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
    },
    mapImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    sidebar: {
        flex: 1,
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
    },
    cemeteryDetails: {
        fontSize: "16px",
        lineHeight: "1.5",
    },

};


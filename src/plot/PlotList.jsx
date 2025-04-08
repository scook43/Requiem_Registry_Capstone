import React, { useEffect, useState } from "react";
import supabaseClient from "../helper/supabaseClient";
import PlotRow from "./PlotRow";
import "./PlotsList.css";

function PlotsList() {
    const [plots, setPlots] = useState([]);
    const [cemeteries, setCemeteries] = useState([]);
    const [selectedCemeteryId, setSelectedCemeteryId] = useState("");
    const [selectedCemeteryName, setSelectedCemeteryName] = useState("");

    useEffect(() => {
        fetchCemeteries();
    }, []);

    useEffect(() => {
        const fetchPlots = async () => {
            let query = supabaseClient
                .from("rr_plot")
                .select("*")
                .order("plot_id", { ascending: true });

            if (selectedCemeteryId) {
                query = query.eq("ceme_id", selectedCemeteryId);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching plots:", error);
            } else {
                setPlots(data || []);
            }
        };

        fetchPlots();
    }, [selectedCemeteryId]);

    async function fetchCemeteries() {
        const { data, error } = await supabaseClient.from("cemetery").select("id, name");
        if (error) {
            console.error("Error fetching cemeteries:", error);
        } else {
            setCemeteries(data);
        }
    }

    async function deletePlot(id) {
        const { error } = await supabaseClient.from("rr_plot").delete().eq("plot_id", id);
        if (error) {
            console.error("Error deleting plot:", error);
        } else {
            // Re-fetch plots after delete
            const fetchPlots = async () => {
                let query = supabaseClient
                    .from("rr_plot")
                    .select("*")
                    .order("plot_id", { ascending: true });

                if (selectedCemeteryId) {
                    query = query.eq("ceme_id", selectedCemeteryId);
                }

                const { data, error } = await query;
                if (error) {
                    console.error("Error fetching plots:", error);
                } else {
                    setPlots(data || []);
                }
            };
            await fetchPlots();
        }
    }


    const handleCemeteryChange = (e) => {
        const selectedId = e.target.value;
        setSelectedCemeteryId(selectedId);

        const selected = cemeteries.find(c => c.id.toString() === selectedId);
        setSelectedCemeteryName(selected ? selected.name : "");
    };


    return (
        <div className="plots-list-container">
            {/* Header Bar */}
            <header
                className="header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 20px",
                    backgroundColor: "#333",
                    color: "white",
                }}
            >
                <div className="header-left">
                    <h1 className="website-name">
                        {selectedCemeteryName || "Requiem Registry"}
                    </h1>
                </div>
                <div className="control">
                    <select
                        value={selectedCemeteryId}
                        onChange={handleCemeteryChange}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
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

            {selectedCemeteryId ? (
                <table className="plots-table">
                    <thead>
                    <tr>
                        <th>Plot ID</th>
                        <th>Cemetery ID</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Tenant ID</th>
                        <th>Plot Number</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {plots.map((plot) => (
                        <PlotRow
                            key={plot.plot_id}
                            plot={plot}
                            deletePlot={deletePlot}
                        />
                    ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Please select a cemetery to view plots.
                </p>
            )}
        </div>
    );
}

export default PlotsList;

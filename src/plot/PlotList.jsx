import React, { useEffect, useState } from "react";
import supabaseClient from "../helper/supabaseClient";
import PlotRow from "./PlotRow";
import "./PlotsList.css";

function PlotsList() {
    const [plots, setPlots] = useState([]);
    const [cemeteries, setCemeteries] = useState([]);
    const [selectedCemeteryId, setSelectedCemeteryId] = useState("");
    const [selectedCemeteryName, setSelectedCemeteryName] = useState("");
    const [peopleOptions, setPeopleOptions] = useState([]);

    useEffect(() => {
        fetchCemeteries();
        fetchPeople();
    }, []);

    useEffect(() => {
        if (selectedCemeteryId) fetchPlots();
    }, [selectedCemeteryId]);

    const fetchCemeteries = async () => {
        const { data, error } = await supabaseClient.from("cemetery").select("id, name");
        if (error) console.error("Error fetching cemeteries:", error);
        else setCemeteries(data);
    };

    const fetchPeople = async () => {
        const { data, error } = await supabaseClient
            .from("person")
            .select("id, f_name, m_name, l_name, suffix");

        if (error) {
            console.error("Error fetching people:", error);
        } else {
            const options = data.map((person) => {
                const fullName = [
                    person.f_name,
                    person.m_name,
                    person.l_name,
                    person.suffix ? `(${person.suffix})` : ""
                ].filter(Boolean).join(" ");
                return { value: person.id, label: fullName };
            });
            setPeopleOptions(options);
        }
    };

    const fetchPlots = async () => {
        const { data, error } = await supabaseClient
            .from("rr_plot")
            .select(`
                plot_id,
                ceme_id,
                coord_lat,
                coord_long,
                tenant_id,
                plot_number,
                person:tenant_id (
                    f_name,
                    m_name,
                    l_name,
                    suffix
                )
            `)
            .eq("ceme_id", selectedCemeteryId)
            .order("plot_id", { ascending: true });

        if (error) {
            console.error("Error fetching plots:", error);
        } else {
            setPlots(data || []);
        }
    };

    const deletePlot = async (id) => {
        const { error } = await supabaseClient.from("rr_plot").delete().eq("plot_id", id);
        if (error) {
            console.error("Error deleting plot:", error);
        } else {
            fetchPlots();
        }
    };

    const handleAssignTenant = async (plotId, personId) => {
        const { error } = await supabaseClient
            .from("rr_plot")
            .update({ tenant_id: personId })
            .eq("plot_id", plotId);

        if (error) {
            console.error("Error assigning tenant:", error);
            alert("Failed to assign person.");
        } else {
            fetchPlots();
        }
    };

    const handleCemeteryChange = (e) => {
        const selectedId = e.target.value;
        setSelectedCemeteryId(selectedId);
        const selected = cemeteries.find(c => c.id.toString() === selectedId);
        setSelectedCemeteryName(selected ? selected.name : "");
    };

    return (
        <div className="plots-list-container">
            <header className="header" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "#333",
                color: "white",
            }}>
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
                        <th>Tenant Name</th>
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
                            peopleOptions={peopleOptions}
                            onAssign={handleAssignTenant}
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

import React, { useState } from "react";
import Select from "react-select";

function PlotRow({ plot, deletePlot, peopleOptions, onAssign }) {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const hasTenant = !!plot.person;

    const fullName = hasTenant
        ? [plot.person.f_name, plot.person.m_name, plot.person.l_name, plot.person.suffix]
            .filter(Boolean)
            .join(" ")
        : "Unassigned";

    const handleSave = () => {
        if (selectedPerson) {
            onAssign(plot.plot_id, selectedPerson.value);
            setIsEditing(false);
        }
    };

    return (
        <tr style={!hasTenant ? { backgroundColor: "#f8f8f8" } : {}}>
            <td>{plot.plot_id}</td>
            <td>{plot.ceme_id}</td>
            <td>{plot.coord_lat}</td>
            <td>{plot.coord_long}</td>
            <td>
                {hasTenant ? fullName : <span style={{ color: "#999" }}>Unassigned</span>}
            </td>
            <td>{plot.plot_number}</td>
            <td>
                <button
                    onClick={() => {
                        if (window.confirm("Are you sure?")) deletePlot(plot.plot_id);
                    }}
                >
                    Delete
                </button>

                {/* Only allow editing if no tenant assigned */}
                {!hasTenant && (
                    <>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            style={{ marginLeft: "8px" }}
                        >
                            {isEditing ? "Cancel" : "Assign"}
                        </button>
                        {isEditing && (
                            <div style={{ marginTop: "8px" }}>
                                <Select
                                    options={peopleOptions}
                                    onChange={setSelectedPerson}
                                    value={selectedPerson}
                                    placeholder="Select person..."
                                    isClearable
                                    styles={{ container: (base) => ({ ...base, width: 200 }) }}
                                />
                                <button
                                    onClick={handleSave}
                                    style={{ marginTop: "4px" }}
                                    disabled={!selectedPerson}
                                >
                                    Confirm
                                </button>
                            </div>
                        )}
                    </>
                )}
            </td>
        </tr>
    );
}

export default PlotRow;
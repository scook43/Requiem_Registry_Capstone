import React, { useEffect, useState } from "react";
import supabaseClient from "../helper/supabaseClient";
import CemeteryRow from "./CemeteryRow"; // Import the row component

function CemeteryList() {
    const [cemetery, setCemetery] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchCemetery();
    }, []);

    async function fetchCemetery() {
        const { data, error } = await supabaseClient.from("cemetery").select("*").order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching cemetery:", error);
        } else {
            setCemetery(data || []);
        }
    }

    async function updateCemetery(id) {
        const { error } = await supabaseClient.from("cemetery").update(editData).eq("id", id);
        if (error) {
            console.error("Error updating cemetery:", error);
        } else {
            setEditingId(null);
            await fetchCemetery();
        }
    }

    async function deleteCemetery(id) {
        const { error } = await supabaseClient.from("cemetery").delete().eq("id", id);
        if (error) {
            console.error("Error deleting person:", error);
        } else {
            await fetchCemetery();
        }
    }

    return (
        <div>
            <h1>Cemetery List</h1>
            <table border="1">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Capacity</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {cemetery.map((cemetery) => (
                    <CemeteryRow
                        key={cemetery.id}
                        cemetery={cemetery}
                        editingId={editingId}
                        editData={editData}
                        setEditingId={setEditingId}
                        setEditData={setEditData}
                        updateCemetery={updateCemetery}
                        deleteCemetery={deleteCemetery}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CemeteryList;

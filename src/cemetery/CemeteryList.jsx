import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabaseClient from "../helper/supabaseClient";
import "../resources/css/CemeteryList.css";

function CemeteryList() {
    const [cemetery, setCemetery] = useState([]);

    useEffect(() => {
        fetchCemetery();
    }, []);

    async function fetchCemetery() {
        const { data, error } = await supabaseClient
            .from("cemetery")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching cemetery:", error);
        } else {
            setCemetery(data || []);
        }
    }

    return (
        <div className="cemetery-list-container">
            <h1>Cemetery List</h1>
            <table className="cemetery-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {cemetery.map((cem) => (
                    <tr key={cem.id}>
                        <td>
                            <Link to={`/cemetery/${cem.id}`} className="cemetery-link">
                                {cem.name}
                            </Link>
                        </td>
                        <td>{cem.address || "N/A"}</td>
                        <td>{cem.email || "N/A"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CemeteryList;

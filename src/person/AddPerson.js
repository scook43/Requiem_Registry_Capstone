import React, { useState } from "react";
import supabaseClient from "../helper/supabaseClient";
import "../resources/css/formStyles.css";

function AddPerson() {
    const [f_name, setFName] = useState("");
    const [m_name, setMName] = useState("");
    const [l_name, setLName] = useState("");
    const [suffix, setSuffix] = useState("");
    const [birth_date, setBirthDate] = useState("");
    const [death_date, setDeathDate] = useState("");
    const [biography, setBiography] = useState("");

    async function addPerson() {
        if (!f_name.trim()) return;

        const { error } = await supabaseClient.from("person").insert([{
            f_name, m_name, l_name, suffix, birth_date, death_date, biography
        }]);

        if (error) {
            console.error("Error inserting person:", error);
        } else {
            // Reset fields
            setFName(""); setMName(""); setLName(""); setSuffix("");
            setBirthDate(""); setDeathDate(""); setBiography("");
        }
    }

    return (
        <div className="add-person-container">
            <h1>Add Person</h1>

            <label htmlFor="first-name">First Name</label>
            <input
                id="first-name"
                value={f_name}
                onChange={(e) => setFName(e.target.value)}
                placeholder="First Name"
            />

            <label htmlFor="middle-name">Middle Name</label>
            <input
                id="middle-name"
                value={m_name}
                onChange={(e) => setMName(e.target.value)}
                placeholder="Middle Name"
            />

            <label htmlFor="last-name">Last Name</label>
            <input
                id="last-name"
                value={l_name}
                onChange={(e) => setLName(e.target.value)}
                placeholder="Last Name"
            />

            <label htmlFor="suffix">Suffix</label>
            <input
                id="suffix"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="Suffix (e.g., Jr., Sr., III)"
            />

            <label htmlFor="birth-date">Birth Date</label>
            <input
                id="birth-date"
                type="date"
                value={birth_date}
                onChange={(e) => setBirthDate(e.target.value)}
            />

            <label htmlFor="death-date">Death Date</label>
            <input
                id="death-date"
                type="date"
                value={death_date}
                onChange={(e) => setDeathDate(e.target.value)}
            />

            <label htmlFor="biography">Biography</label>
            <textarea
                id="biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Biography"
            ></textarea>

            <button onClick={addPerson}>Add Person</button>
        </div>
    );
}

export default AddPerson;

import React, { useState } from "react";
import supabaseClient from "../helper/supabaseClient";
import "../resources/css/formStyles.css";


function AddCemetery() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [capacity, setCapacity] = useState(0); // Initialize capacity as an integer
    const [email, setEmail] = useState("");


    async function addCemetery() {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }

        const { data, error } = await supabaseClient
            .from("cemetery")
            .insert([{ name, description, address, phone_number, capacity, email }])
            .select();

        if (error) {
            console.error("Error inserting cemetery:", error);
            alert("Failed to add cemetery.");
            return;
        }

        if (data) {
            console.log("Inserted cemetery:", data);
            alert("Cemetery added successfully!");
        }
    }


    return (
        <div className="add-cemetery-container">
            <h1>Add Cemetery</h1>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
            />
            <input
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
            />
            <input
                type="number"  // Change from "int" to "number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Capacity"
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button onClick={addCemetery}>Add Cemetery</button>
        </div>
    );
}

export default AddCemetery;

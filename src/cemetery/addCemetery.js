import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseClient from "../helper/supabaseClient";

function AddCemetery() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [capacity, setCapacity] = useState(0); // Initialize capacity as an integer
    const [email, setEmail] = useState("");

    const navigate = useNavigate(); // Navigate back after adding

    async function addCemetery() {
        if (!name.trim()) {
            // If the name is empty, prevent submitting
            alert("Name is required");
            return;
        }

        // Insert the data into the Supabase database
        const { error } = await supabaseClient.from("cemetery").insert([{
            name, description, address, phone_number, capacity, email
        }]);

        if (error) {
            console.error("Error inserting cemetery:", error);
        } else {
            // Reset fields after successful insert
            setName(""); setDescription(""); setAddress(""); setPhoneNumber("");
            setCapacity(0); setEmail("");

        }
    }

    return (
        <div>
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

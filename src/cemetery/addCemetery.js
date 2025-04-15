import React, { useState } from "react";
import supabaseClient from "../helper/supabaseClient";
import "../resources/css/formStyles.css";

function AddCemetery() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [email, setEmail] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    async function addCemetery() {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }

        let imageUrl = null;

        if (imageFile) {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `cemeteries/${fileName}`;

            const { error: uploadError } = await supabaseClient.storage
                .from("cemetery-images")
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error("Image upload error:", uploadError);
                alert("Failed to upload image.");
                return;
            }

            const { data: publicURLData } = supabaseClient.storage
                .from("cemetery-images")
                .getPublicUrl(filePath);

            imageUrl = publicURLData.publicUrl;
        }

        const { data, error } = await supabaseClient
            .from("cemetery")
            .insert([{ name, description, address, phone_number, capacity, email, image_url: imageUrl }])
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

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file && file.type === "image/png") {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.src = objectUrl;

            img.onload = () => {
                if (img.width === 500 && img.height === 500) {
                    setImageFile(file);
                    setPreviewUrl(objectUrl);
                } else {
                    alert("Image must be exactly 500x500 pixels.");
                    setImageFile(null);
                    setPreviewUrl(null);
                }
            };
        } else {
            alert("Only PNG files are allowed.");
        }
    }

    return (
        <div className="add-cemetery-container">
            <h1>Add Cemetery</h1>

            <label htmlFor="cemetery-name">Cemetery Name</label>
            <input
                id="cemetery-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />

            <label htmlFor="cemetery-description">Description</label>
            <textarea
                id="cemetery-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />

            <label htmlFor="cemetery-address">Address</label>
            <textarea
                id="cemetery-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
            />

            <label htmlFor="cemetery-phone">Phone Number</label>
            <input
                id="cemetery-phone"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
            />

            <label htmlFor="cemetery-capacity">Capacity</label>
            <input
                id="cemetery-capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                placeholder="Capacity"
            />

            <label htmlFor="cemetery-email">Email</label>
            <input
                id="cemetery-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />

            <label htmlFor="cemetery-image">Upload Cemetery Image (PNG, 500x500px)</label>
            <input
                id="cemetery-image"
                type="file"
                accept="image/png"
                onChange={handleImageChange}
            />

            {previewUrl && (
                <div style={{ marginTop: "10px" }}>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ width: 100, height: 100, border: "1px solid #ccc" }}
                    />
                </div>
            )}

            <button onClick={addCemetery}>Add Cemetery</button>
        </div>
    );
}

export default AddCemetery;

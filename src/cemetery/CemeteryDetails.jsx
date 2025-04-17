import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import supabaseClient from "../helper/supabaseClient";

function CemeteryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // Determine if navigation came from HomePage
    const fromHome = location.state && location.state.fromHome;

    const [cemetery, setCemetery] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchCemetery = async () => {
            const { data, error } = await supabaseClient
                .from("cemetery")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching cemetery:", error);
            } else {
                setCemetery(data);
                setFormData(data);
            }
        };

        fetchCemetery();
    }, [id]);

    async function handleSave() {
        const { error } = await supabaseClient
            .from("cemetery")
            .update(formData)
            .eq("id", id);

        if (error) {
            console.error("Error updating cemetery:", error);
        } else {
            setIsEditing(false);
            setCemetery(formData);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm("Are you sure you want to delete this cemetery?");
        if (!confirmed) return;

        setIsDeleting(true);
        const { error } = await supabaseClient.from("cemetery").delete().eq("id", id);
        if (error) {
            console.error("Error deleting cemetery:", error);
            alert("There was an error deleting the cemetery.");
            setIsDeleting(false);
        } else {
            // Redirect to an appropriate page after deletion.
            // For instance, if the deletion happened from cemetery list, navigate there.
            navigate("/cemetery-list");
        }
    }

    if (!cemetery) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            {/* Adjust your back button depending on where the user came from */}
            {fromHome ? (
                <button onClick={() => navigate("/")} className="person-detail-btn cancel-btn">
                    ← Back to Home
                </button>
            ) : (
                <button onClick={() => navigate("/cemetery-list")} className="person-detail-btn cancel-btn">
                    ← Back to List
                </button>
            )}

            {(!fromHome && isEditing) ? (
                <div style={styles.form}>
                    <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Name"
                    />
                    <textarea
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description"
                        rows={3}
                    />
                    <input
                        type="text"
                        value={formData.address || ""}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Address"
                    />
                    <input
                        type="text"
                        value={formData.phone_number || ""}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        placeholder="Phone Number"
                    />
                    <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                    />
                    <input
                        type="number"
                        value={formData.capacity || ""}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="Capacity"
                    />

                    <div style={styles.buttonGroup}>
                        <button onClick={handleSave} className="person-detail-btn save-btn">Save</button>
                        <button onClick={() => setIsEditing(false)} className="person-detail-btn cancel-btn">Cancel</button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>{cemetery.name}</h2>
                    <p><strong>Description:</strong> {cemetery.description}</p>
                    <p><strong>Address:</strong> {cemetery.address}</p>
                    <p><strong>Phone:</strong> {cemetery.phone_number}</p>
                    <p><strong>Email:</strong> {cemetery.email}</p>
                    <p><strong>Capacity:</strong> {cemetery.capacity}</p>

                    {/* Only show editing/deleting when not coming from HomePage */}
                    {!fromHome && (
                        <div style={styles.buttonGroup}>
                            <button onClick={() => setIsEditing(true)} className="person-detail-btn edit-btn">Edit</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="person-detail-btn delete-btn">
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "15px",
    },
    buttonGroup: {
        marginTop: "15px",
        display: "flex",
        gap: "10px",
    },
};

export default CemeteryDetail;

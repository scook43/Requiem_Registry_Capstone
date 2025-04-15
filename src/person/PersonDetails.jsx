import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import supabaseClient from "../helper/supabaseClient";
import "../resources/css/PersonDetails.css"; // or whatever your path/filename is


function PersonDetail() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isReadOnly = searchParams.get("view") === "readonly";

    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchPerson = async () => {
            const { data, error } = await supabaseClient
                .from("person")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching person:", error);
            } else {
                setPerson(data);
                setFormData(data);
            }
        };

        fetchPerson();
    }, [id]);

    async function handleSave() {
        const { error } = await supabaseClient
            .from("person")
            .update(formData)
            .eq("id", id);

        if (error) {
            console.error("Error updating person:", error);
        } else {
            setIsEditing(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm("Are you sure you want to delete this person?");
        if (!confirmed) return;

        setIsDeleting(true);

        const { error } = await supabaseClient.from("person").delete().eq("id", id);
        if (error) {
            console.error("Error deleting person:", error);
            alert("There was an error deleting the person.");
            setIsDeleting(false);
        } else {
            navigate("/people-list");
        }
    }

    if (!person) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            <button onClick={() => navigate("/")} className="person-detail-btn cancel-btn">
                ← Back to Homepage
            </button>


            {isEditing ? (
                <div style={styles.form}>
                    <input
                        type="text"
                        value={formData.f_name || ""}
                        onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        value={formData.m_name || ""}
                        onChange={(e) => setFormData({ ...formData, m_name: e.target.value })}
                        placeholder="Middle Name"
                    />
                    <input
                        type="text"
                        value={formData.l_name || ""}
                        onChange={(e) => setFormData({ ...formData, l_name: e.target.value })}
                        placeholder="Last Name"
                    />
                    <input
                        type="text"
                        value={formData.suffix || ""}
                        onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                        placeholder="Suffix"
                    />
                    <input
                        type="date"
                        value={formData.birth_date || ""}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    />
                    <input
                        type="date"
                        value={formData.death_date || ""}
                        onChange={(e) => setFormData({ ...formData, death_date: e.target.value })}
                    />
                    <textarea
                        value={formData.biography || ""}
                        onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                        placeholder="Biography"
                        rows={4}
                    />

                    <div style={styles.buttonGroup}>
                        <button onClick={handleSave} className="person-detail-btn save-btn">Save</button>
                        <button onClick={() => setIsEditing(false)} className="person-detail-btn cancel-btn">Cancel</button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>{person.f_name} {person.m_name} {person.l_name} {person.suffix}</h2>
                    <p><strong>Born:</strong> {person.birth_date || "N/A"}</p>
                    <p><strong>Died:</strong> {person.death_date || "N/A"}</p>
                    <p><strong>Bio:</strong> {person.biography || "No biography available."}</p>

                    {!isReadOnly && (
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
    backButton: {
        marginBottom: "20px",
        padding: "8px 12px",
        fontSize: "14px",
        backgroundColor: "#eee",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    buttonGroup: {
        marginTop: "15px",
        display: "flex",
        gap: "10px",
    },
};

export default PersonDetail;

import React from "react";
import { Link } from "react-router-dom";

function PersonCard({ person, showLink = true, showDetails = false }) {
    return (
        <div style={styles.card}>
            {showLink ? (
                <Link to={`/person/${person.id}?view=readonly`} className="person-link">
                    <strong>{person.f_name} {person.m_name} {person.l_name}</strong>{person.suffix && `, ${person.suffix}`}
                </Link>
            ) : (
                <h2 style={styles.name}>
                    {person.f_name} {person.m_name} {person.l_name} {person.suffix && `, ${person.suffix}`}
                </h2>
            )}
            <p><strong>Born:</strong> {person.birth_date}</p>
            <p><strong>Died:</strong> {person.death_date}</p>

            {showDetails && (
                <>
                    <p><strong>Bio:</strong> {person.biography || "No bio available."}</p>
                </>
            )}
        </div>
    );
}

const styles = {
    card: {
        border: "1px solid #ccc",
        padding: "15px",
        margin: "10px 0",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    },
    name: {
        fontSize: "18px",
        color: "#333",
        textDecoration: "none",
    },
};

export default PersonCard;

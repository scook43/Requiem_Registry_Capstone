import React from "react";
import { Link } from "react-router-dom";

function PersonRow({ person }) {
    return (
        <tr>
            <td>
                <Link to={`/person/${person.id}`} className="person-link">
                    {person.f_name} {person.m_name} {person.l_name}
                </Link>
            </td>
            <td>{person.suffix}</td>
            <td>{person.birth_date || "N/A"}</td>
            <td>{person.death_date || "N/A"}</td>
            <td></td> {/* Empty Biography column */}
            <td></td> {/* Empty Actions column */}
        </tr>
    );
}


export default PersonRow;

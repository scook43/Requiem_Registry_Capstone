import React from "react";

function PersonRow({
                       person,
                       editingId,
                       editData,
                       setEditingId,
                       setEditData,
                       updatePerson,
                       deletePerson,
                   }) {
    return (
        <tr>
            {editingId === person.id ? (
                <>
                    <td>
                        <input
                            type="text"
                            value={editData.f_name || person.f_name}
                            onChange={(e) => setEditData({ ...editData, f_name: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editData.m_name || person.m_name}
                            onChange={(e) => setEditData({ ...editData, m_name: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editData.l_name || person.l_name}
                            onChange={(e) => setEditData({ ...editData, l_name: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editData.suffix || person.suffix}
                            onChange={(e) => setEditData({ ...editData, suffix: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="date"
                            value={editData.birth_date || person.birth_date}
                            onChange={(e) => setEditData({ ...editData, birth_date: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="date"
                            value={editData.death_date || person.death_date}
                            onChange={(e) => setEditData({ ...editData, death_date: e.target.value })}
                        />
                    </td>
                    <td>
                        <textarea
                            value={editData.biography || person.biography}
                            onChange={(e) => setEditData({ ...editData, biography: e.target.value })}
                        />
                    </td>
                    <td>
                        <button onClick={() => updatePerson(person.id)}>Save</button>
                        <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                </>
            ) : (
                <>
                    <td>{person.f_name}</td>
                    <td>{person.m_name}</td>
                    <td>{person.l_name}</td>
                    <td>{person.suffix}</td>
                    <td>{person.birth_date || "N/A"}</td>
                    <td>{person.death_date || "N/A"}</td>
                    <td>{person.biography || "No Bio"}</td>
                    <td>
                        <button onClick={() => { setEditingId(person.id); setEditData(person); }}>Edit</button>
                        <button onClick={() => { if (window.confirm("Are you sure?")) deletePerson(person.id); }}>Delete</button>
                    </td>
                </>
            )}
        </tr>
    );
}

export default PersonRow;

import React from "react";

function CemeteryRow({
                       cemetery,
                       editingId,
                       editData,
                       setEditingId,
                       setEditData,
                       updateCemetery,
                       deleteCemetery,
                   }) {
    return (
        <tr>
            {editingId === cemetery.id ? (
                <>
                    <td>
                        <input
                            type="text"
                            value={editData.name || cemetery.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editData.description || cemetery.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editData.address || cemetery.address}
                            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editData.phone_number || cemetery.phone_number}
                            onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="date"
                            value={editData.capacity || cemetery.capacity}
                            onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="date"
                            value={editData.email || cemetery.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        />
                    </td>
                    <td>
                        <button onClick={() => updateCemetery(cemetery.id)}>Save</button>
                        <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                </>
            ) : (
                <>
                    <td>{cemetery.name}</td>
                    <td>{cemetery.description}</td>
                    <td>{cemetery.address}</td>
                    <td>{cemetery.phone_number}</td>
                    <td>{cemetery.capacity || "N/A"}</td>
                    <td>{cemetery.email || "N/A"}</td>
                    <td>
                        <button onClick={() => { setEditingId(cemetery.id); setEditData(cemetery); }}>Edit</button>
                        <button onClick={() => { if (window.confirm("Are you sure?")) deleteCemetery(cemetery.id); }}>Delete</button>
                    </td>
                </>
            )}
        </tr>
    );
}

export default CemeteryRow;

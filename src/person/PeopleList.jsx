import React, { useEffect, useState } from "react";
import supabaseClient from "../helper/supabaseClient";
import PersonRow from "./PersonRow"; // Import the row component

function PeopleList() {
    const [people, setPeople] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchPeople();
    }, []);

    async function fetchPeople() {
        const { data, error } = await supabaseClient.from("person").select("*").order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching people:", error);
        } else {
            setPeople(data || []);
        }
    }

    async function updatePerson(id) {
        const { error } = await supabaseClient.from("person").update(editData).eq("id", id);
        if (error) {
            console.error("Error updating person:", error);
        } else {
            setEditingId(null);
            await fetchPeople();
        }
    }

    async function deletePerson(id) {
        const { error } = await supabaseClient.from("person").delete().eq("id", id);
        if (error) {
            console.error("Error deleting person:", error);
        } else {
            await fetchPeople();
        }
    }

    return (
        <div>
            <h1>People List</h1>
            <table border="1">
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Middle Name</th>
                    <th>Last Name</th>
                    <th>Suffix</th>
                    <th>Birth Date</th>
                    <th>Death Date</th>
                    <th>Biography</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {people.map((person) => (
                    <PersonRow
                        key={person.id}
                        person={person}
                        editingId={editingId}
                        editData={editData}
                        setEditingId={setEditingId}
                        setEditData={setEditData}
                        updatePerson={updatePerson}
                        deletePerson={deletePerson}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default PeopleList;

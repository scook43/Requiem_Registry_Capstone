import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './Map.css';
import logoResized from "../resources/pngs/logoCircle.png";
import supabaseClient from "../helper/supabaseClient";

export default function Map() {
  const [cemeteries, setCemeteries] = useState([]);
  const [cemeteryDetails, setCemeteryDetails] = useState(null);
  const [plotLists, setPlotLists] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [addingPlot, setAddingPlot] = useState(false);
  const [peopleOptions, setPeopleOptions] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [plotAssignments, setPlotAssignments] = useState({});
  const [selectedCemetery, setSelectedCemetery] = useState("");
  const [selectedCemeteryName, setSelectedCemeteryName] = useState("Requiem Registry");

  // Fetch cemeteries
  useEffect(() => {
    const fetchCemeteries = async () => {
      const { data, error } = await supabaseClient
          .from("cemetery")
          .select("id, name");
      if (error) console.error("Error fetching cemeteries:", error);
      else setCemeteries(data);
    };
    fetchCemeteries();
  }, []);

  // Fetch cemetery details
  useEffect(() => {
    const fetchCemeteryDetails = async () => {
      if (selectedCemetery) {
        const { data, error } = await supabaseClient
            .from("cemetery")
            .select("*")
            .eq("id", selectedCemetery)
            .single();
        if (error) console.error("Error fetching cemetery details:", error);
        else setCemeteryDetails(data);
      } else {
        setCemeteryDetails(null);
      }
    };
    fetchCemeteryDetails();
  }, [selectedCemetery]);

  // Fetch all people for dropdown options
  useEffect(() => {
    const fetchPeople = async () => {
      const { data, error } = await supabaseClient
          .from("person")
          .select("id, f_name, m_name, l_name, suffix");

      if (error) {
        console.error("Error fetching people:", error);
      } else {
        const options = data.map((person) => {
          const fullName = [
            person.f_name,
            person.m_name,
            person.l_name,
            person.suffix ? `(${person.suffix})` : ""
          ].filter(Boolean).join(" ");

          return { value: person.id, label: fullName };
        });
        setPeopleOptions(options);
      }
    };

    fetchPeople();
  }, []);

  // Clear plot and person on cemetery change
  useEffect(() => {
    setSelectedPlot(null);
    setSelectedPerson(null);
  }, [selectedCemetery]);

  // Fetch saved plots and assignments
  useEffect(() => {
    const fetchSavedPlots = async () => {
      if (!selectedCemetery) return;

      const { data, error } = await supabaseClient
          .from("rr_plot")
          .select(`
          plot_number,
          coord_lat,
          coord_long,
          tenant_id,
          person:tenant_id (
            id,
            f_name,
            m_name,
            l_name,
            suffix
          )
        `)
          .eq("ceme_id", selectedCemetery);

      if (error) {
        console.error("Error fetching saved plots:", error);
      } else {
        const savedPlots = [];
        const assignments = {};

        data.forEach(p => {
          savedPlots.push({
            id: p.plot_number,
            x: p.coord_lat,
            y: p.coord_long
          });

          if (p.person) {
            const name = [p.person.f_name, p.person.m_name, p.person.l_name, p.person.suffix]
                .filter(Boolean)
                .join(" ");
            assignments[`${selectedCemetery}-${p.plot_number}`] = name;
          }
        });

        setPlotLists(prev => ({
          ...prev,
          [selectedCemetery]: savedPlots
        }));

        setPlotAssignments(assignments);
      }
    };

    fetchSavedPlots();
  }, [selectedCemetery]);

  const plots = plotLists[selectedCemetery] || [];

  const toggleAddingPlot = () => setAddingPlot((prev) => !prev);

  const getNextAvailableId = (plots) => {
    const usedIds = plots.map(p => p.id).sort((a, b) => a - b);
    for (let i = 1; i <= (cemeteryDetails?.capacity || 1000); i++) {
      if (!usedIds.includes(i)) return i;
    }
    return usedIds.length + 1;
  };

  const addPlot = (e) => {
    if (!addingPlot || plots.length >= (cemeteryDetails?.capacity || 0)) return;
    if (e.target.classList.contains('plot')) return;

    const mapRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - mapRect.left;
    const y = e.clientY - mapRect.top;

    const newPlot = {
      id: getNextAvailableId(plots),
      name: '',
      x,
      y
    };

    setPlotLists(prev => ({
      ...prev,
      [selectedCemetery]: [...(prev[selectedCemetery] || []), newPlot]
    }));
  };

  const assignPersonToPlot = async () => {
    if (!selectedPlot || !selectedPerson) return;

    const { error } = await supabaseClient.from("rr_plot").insert([{
      ceme_id: cemeteryDetails.id,
      plot_number: selectedPlot.id,
      coord_lat: selectedPlot.x,
      coord_long: selectedPlot.y,
      tenant_id: selectedPerson.value,
    }]);

    if (error) {
      console.error("Failed to insert plot:", error);
      alert("Failed to assign person to plot.");
    } else {
      alert(`Assigned ${selectedPerson.label} to Plot ${selectedPlot.id}`);
      setPlotAssignments(prev => ({
        ...prev,
        [`${selectedCemetery}-${selectedPlot.id}`]: selectedPerson.label
      }));
      setSelectedPlot(null);
      setSelectedPerson(null);
    }
  };

  const deletePlot = () => {
    setPlotLists(prev => ({
      ...prev,
      [selectedCemetery]: prev[selectedCemetery].filter(p => p.id !== selectedPlot.id)
    }));
    setSelectedPlot(null);
  };

  const handleCemeteryChange = (e) => {
    const cemeteryId = e.target.value;
    setSelectedCemetery(cemeteryId);

    const selected = cemeteries.find(c => c.id.toString() === cemeteryId);
    setSelectedCemeteryName(selected ? selected.name : "Requiem Registry");
  };

  return (
      <div className="map-container">
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <img src={logoResized} alt="Requiem Registry logo" style={styles.logo} />
            <h1 className="website-name">{selectedCemeteryName || "Requiem Registry"}</h1>
          </div>
          <div style={styles.control}>
            <select value={selectedCemetery} onChange={handleCemeteryChange} style={styles.dropdown}>
              <option value="">Select a cemetery</option>
              {cemeteries.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </header>

        <div id="plot-container" onClick={addPlot}>
          {cemeteryDetails?.image_url ? (
              <img
                  src={cemeteryDetails.image_url}
                  alt="Cemetery Map"
                  id="map-image"
              />

          ) : (
              <p style={{ textAlign: "center" }}>Please select a cemetery to view the map.</p>
          )}

          <div id="add-plots-pane">
            {plots.map((plot) => (
                <div
                    key={plot.id}
                    className="plot"
                    title={plotAssignments[`${selectedCemetery}-${plot.id}`] || ""}
                    style={{ left: `${plot.x}px`, top: `${plot.y}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlot(plot);
                      setPopupPosition({ x: plot.x + 20, y: plot.y + 20 });
                    }}
                >
                  {plot.id}
                </div>
            ))}
          </div>
        </div>

        {cemeteryDetails && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              {plots.length} of {cemeteryDetails.capacity} plots placed
            </div>
        )}

        <button
            onClick={toggleAddingPlot}
            className={`map-action-button ${addingPlot ? 'cancel' : ''}`}
            disabled={plots.length >= (cemeteryDetails?.capacity || 0)}
        >
          {addingPlot ? 'Cancel Adding Plots' : 'Add Plots'}
        </button>

        {selectedPlot && (
            <div
                id="info-popup"
                style={{ left: `${popupPosition.x}px`, top: `${popupPosition.y}px` }}
            >
              <button
                  className="close-button"
                  onClick={() => setSelectedPlot(null)}
                  aria-label="Close"
              >
                ×
              </button>
              <h3>Assign Person to Plot {selectedPlot.id}</h3>

              {plotAssignments[`${selectedCemetery}-${selectedPlot.id}`] && (
                  <p><strong>Assigned:</strong> {plotAssignments[`${selectedCemetery}-${selectedPlot.id}`]}</p>
              )}

              <Select
                  options={peopleOptions}
                  value={selectedPerson}
                  onChange={setSelectedPerson}
                  placeholder="Search for a person..."
                  isClearable
              />

              <div className="popup-button-group">
                <button
                    onClick={assignPersonToPlot}
                    disabled={!selectedPerson}
                    className="popup-button assign"
                >
                  Assign
                </button>
                <button
                    onClick={deletePlot}
                    className="popup-button delete"
                >
                  Delete
                </button>
              </div>
            </div>
        )}
      </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "50px",
    height: "50px",
    marginRight: "15px",
  },
  websiteName: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  control: {
    display: "flex",
    flexDirection: "column",
    width: "20%",
  },
  dropdown: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};

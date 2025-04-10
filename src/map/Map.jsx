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
  const [plotAssignments, setPlotAssignments] = useState({}); // New
  const [selectedCemetery, setSelectedCemetery] = useState("");
  const [selectedCemeteryName, setSelectedCemeteryName] = useState("Requiem Registry");

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


  useEffect(() => {
    const fetchPlots = async () => {
      if (!selectedCemetery) {
        setPlotLists((prev) => ({ ...prev, [selectedCemetery]: [] }));
        return;
      }
  
      const { data, error } = await supabaseClient
        .from("rr_plot")
        .select("plot_number, coord_lat, coord_long, tenant_id")
        .eq("ceme_id", selectedCemetery);
  
      if (error) {
        console.error("Error fetching plots:", error);
      } else {
        const fetchedPlots = data.map((plot) => ({
          id: plot.plot_number,
          x: plot.coord_lat,
          y: plot.coord_long,
          tenant_id: plot.tenant_id,
        }));
  
        setPlotLists((prev) => ({
          ...prev,
          [selectedCemetery]: fetchedPlots,
        }));
  
        // If you want to pre-fill plotAssignments for display:
        const tenantIds = data.map(p => p.tenant_id).filter(Boolean);
        if (tenantIds.length > 0) {
          const { data: tenants, error: tenantError } = await supabaseClient
            .from("person")
            .select("id, f_name, m_name, l_name, suffix")
            .in("id", tenantIds);
  
          if (tenantError) {
            console.error("Error fetching tenants:", tenantError);
          } else {
            const tenantMap = {};
            tenants.forEach(p => {
              const fullName = [p.f_name, p.m_name, p.l_name, p.suffix ? `(${p.suffix})` : ""]
                .filter(Boolean).join(" ");
              tenantMap[p.id] = fullName;
            });
  
            const assignments = {};
            data.forEach(plot => {
              if (plot.tenant_id) {
                assignments[`${selectedCemetery}-${plot.plot_number}`] = tenantMap[plot.tenant_id];
              }
            });
            setPlotAssignments(assignments);
          }
        }
      }
    };
  
    fetchPlots();
  }, [selectedCemetery]);

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

          return {
            value: person.id,
            label: fullName
          };
        });

        setPeopleOptions(options);
      }
    };

    fetchPeople();
  }, []);

  useEffect(() => {
    setSelectedPlot(null);
    setSelectedPerson(null);
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

    setPlotLists((prev) => ({
      ...prev,
      [selectedCemetery]: [...(prev[selectedCemetery] || []), newPlot]
    }));
  };

  const assignPersonToPlot = async () => {
    if (!selectedPlot || !selectedPerson) return;
  
    // Step 1: Check if the plot exists
    const { data: existingPlot, error: fetchError } = await supabaseClient
      .from("rr_plot")
      .select("id")
      .eq("ceme_id", cemeteryDetails.id)
      .eq("plot_number", selectedPlot.id)
      .single();
  
    if (fetchError || !existingPlot) {
      console.error("Plot not found in database.");
      alert("This plot has not been saved to the database yet.");
      return;
    }
  
    // Step 2: Update the existing plot
    const { error: updateError } = await supabaseClient
      .from("rr_plot")
      .update({
        tenant_id: selectedPerson.value
      })
      .eq("ceme_id", cemeteryDetails.id)
      .eq("plot_number", selectedPlot.id);
  
    if (updateError) {
      console.error("Failed to update plot:", updateError);
      alert("Failed to assign person to plot.");
    } else {
      alert(`Updated Plot ${selectedPlot.id} with ${selectedPerson.label}`);
      setPlotAssignments(prev => ({
        ...prev,
        [`${selectedCemetery}-${selectedPlot.id}`]: selectedPerson.label
      }));
      setSelectedPlot(null);
      setSelectedPerson(null);
    }
  };



  const deletePlot = async () => {
    await supabaseClient
    .from("rr_plot")
    .delete()
    .match({
      ceme_id: selectedCemetery,
      plot_number: selectedPlot.id
    });
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
            <h1 className="website-name">
              {selectedCemeteryName || "Requiem Registry"}
            </h1>         
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

        <div id="plot-container" onClick={addPlot} style={{ position: 'relative' }}>
          {cemeteryDetails?.image_url ? (
              <img
                  src={cemeteryDetails.image_url}
                  alt="Cemetery Map"
                  id="map-image"
                  style={{ display: 'block', maxWidth: '100%' }}
              />
          ) : (
              <p style={{ textAlign: "center" }}>Please select a cemetery to view the map.</p>
          )}

          <div
              id="add-plots-pane"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            {plots.map((plot) => (
                <div
                    key={plot.id}
                    className="plot"
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

        <div>
          <button
              onClick={toggleAddingPlot}
              className={addingPlot ? 'active' : ''}
              disabled={plots.length >= (cemeteryDetails?.capacity || 0)}
          >
            {addingPlot ? 'Cancel Adding Plots' : 'Add Plots'}
          </button>
        </div>

        {selectedPlot && (
            <div
                id="info-popup"
                style={{
                  position: 'absolute',
                  left: `${popupPosition.x}px`,
                  top: `${popupPosition.y}px`,
                  background: "white",
                  padding: "10px",
                  border: "1px solid black"
                }}
            >
              <h3>Assign Person to Plot {selectedPlot.id}</h3>

              {/* Show Assigned Person */}
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

              <div style={{ marginTop: "10px" }}>
                <button onClick={assignPersonToPlot} disabled={!selectedPerson}>Assign</button>
                <button onClick={deletePlot} style={{ marginLeft: "10px" }}>Delete</button>
                <button onClick={() => setSelectedPlot(null)} style={{ marginLeft: "10px" }}>Close</button>
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
  }
};

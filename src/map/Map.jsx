import React, { useState, useEffect } from 'react';
import './Map.css';

export default function Map() {


  
  const initialPlotLists = {
    Cemetery1: [
      { id: 1, name: '', x: 125, y: 120 },
      { id: 2, name: '', x: 220, y: 220 }
    ],
    Cemetery2: [
      { id: 1, name: '', x: 150, y: 150 },
      { id: 2, name: '', x: 250, y: 250 }
    ],
    Cemetery3: [
      { id: 1, name: '', x: 120, y: 120 },
      { id: 2, name: '', x: 220, y: 220 }
    ]
  };

  const cemeteryMaps = {
    Cemetery1: 'pollard.png',
    Cemetery2: 'erin.png',
    Cemetery3: 'adkins.png'
  };

  const MAX_PLOTS = 10;

  const [selectedCemetery, setSelectedCemetery] = useState('Cemetery1');
  const [plotLists, setPlotLists] = useState(initialPlotLists);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [addingPlot, setAddingPlot] = useState(false);

  // Get the current cemetery's plots
  const plots = plotLists[selectedCemetery] || [];

  useEffect(() => {
    setSelectedPlot(null); // Close popup when changing cemetery
  }, [selectedCemetery]);

  const handleCemeteryChange = (event) => {
    setSelectedCemetery(event.target.value);
  };

  const toggleAddingPlot = () => {
    setAddingPlot(prev => !prev);
  };

  const getNextAvailableId = (plots) => {
    const usedIds = plots.map(plot => plot.id).sort((a, b) => a - b);
    for (let i = 1; i <= MAX_PLOTS; i++) {
      if (!usedIds.includes(i)) {
        return i;
      }
    }
    return usedIds.length + 1; // Fallback (shouldn't happen if MAX_PLOTS is followed)
  };

  const addPlot = (event) => {
    if (!addingPlot || plots.length >= MAX_PLOTS) return;

    const isPlotClicked = event.target.classList.contains('plot');
    if (isPlotClicked) return;

    const mapRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - mapRect.left;
    const y = event.clientY - mapRect.top;

    const newPlotId = getNextAvailableId(plots);
    const newPlot = { id: newPlotId, name: '', x, y };

    setPlotLists(prevLists => ({
      ...prevLists,
      [selectedCemetery]: [...prevLists[selectedCemetery], newPlot]
    }));

    //setAddingPlot(false);
  };

  const deletePlot = () => {
    setPlotLists(prevLists => ({
      ...prevLists,
      [selectedCemetery]: prevLists[selectedCemetery].filter(plot => plot.id !== selectedPlot.id)
    }));
    setSelectedPlot(null);
  };

  const editPlot = () => {
    const newName = prompt('Enter a new name for the plot:', selectedPlot.name);
    if (newName) {
      setPlotLists(prevLists => ({
        ...prevLists,
        [selectedCemetery]: prevLists[selectedCemetery].map((plot) =>
          plot.id === selectedPlot.id ? { ...plot, name: newName } : plot
        )
      }));
    }
    setSelectedPlot(null);
  };

  return (
    <div className="map-container">
      <div>
        <label htmlFor="cemetery-select">Select Cemetery: </label>
        <select id="cemetery-select" value={selectedCemetery} onChange={handleCemeteryChange}>
          {Object.keys(plotLists).map((cemetery) => (
            <option key={cemetery} value={cemetery}>{cemetery}</option>
          ))}
        </select>
      </div>
      
      <div id="plot-container" onClick={addPlot} style={{ position: 'relative' }}>
        <img 
          src={cemeteryMaps[selectedCemetery]} 
          alt="Map" 
          id="map-image" 
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <div id="add-plots-pane" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
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
              {plot.id/* {plot.name || `Plot ${plot.id}`} */}
            </div>
          ))}
        </div>
      </div>

      <div>
        <button onClick={toggleAddingPlot} className={addingPlot ? 'active' : ''} disabled={plots.length >= MAX_PLOTS}>
          {addingPlot ? 'Cancel Adding Plots' : 'Add Plots'}
        </button>
      </div>

      {selectedPlot && (
        <div
          id="info-popup"
          style={{ position: 'absolute', left: `${popupPosition.x}px`, top: `${popupPosition.y}px` }}
        >
          <h3>Plot Info</h3>
          <p><strong>Name:</strong> {selectedPlot.name || `Plot ${selectedPlot.id}`}</p>
          <button onClick={editPlot}>Edit</button>
          <button onClick={deletePlot}>Delete</button>
          <button onClick={() => setSelectedPlot(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

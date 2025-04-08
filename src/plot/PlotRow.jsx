import React from "react";

function PlotRow({ plot, deletePlot }) {
    return (
        <tr>
            <td>{plot.plot_id}</td>
            <td>{plot.ceme_id}</td>
            <td>{plot.coord_lat}</td>
            <td>{plot.coord_long}</td>
            <td>{plot.tenant_id}</td>
            <td>{plot.plot_number}</td>
            <td>
                <button
                    onClick={() => {
                        if (window.confirm("Are you sure?")) deletePlot(plot.plot_id);
                    }}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default PlotRow;
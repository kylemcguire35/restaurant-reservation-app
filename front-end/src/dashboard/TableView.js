import React from "react";
import { finishTable } from "../utils/api";

function TableView({ table }) {
  async function finishTableFromAPI() {
    await finishTable(table);
    window.location.reload();
  }

  const handleFinish = (event) => {
    event.preventDefault();
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishTableFromAPI();
    }
  };

  return (
    <tr>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>
        {table.reservation_id === null ? "Free" : "Occupied"}
      </td>
      <td>
        {table.reservation_id !== null ? (
          <button
            className="btn btn-warning"
            data-table-id-finish={table.table_id}
            onClick={handleFinish}
          >
            Finish
          </button>
        ) : (
          <div></div>
        )}
      </td>
    </tr>
  );
}

export default TableView;

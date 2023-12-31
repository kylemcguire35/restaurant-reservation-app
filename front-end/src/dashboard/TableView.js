import React from "react";
import { finishTable } from "../utils/api";

function TableView({ table }) {
  async function finishTableFromAPI() {
    await finishTable(table);
  }

  const handleFinish = (event) => {
    event.preventDefault();
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishTableFromAPI();
      window.location.reload();
    }
  };

  return (
    <tr>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>
        {table.reservation_id === null ? "Free" : "Occupied"}
      </td>
      {table.reservation_id !== null ? (
        <button data-table-id-finish={table.table_id} onClick={handleFinish}>
          Finish
        </button>
      ) : null}
    </tr>
  );
}

export default TableView;

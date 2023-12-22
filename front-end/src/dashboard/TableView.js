import React from "react";

function TableView({ table }) {
  return (
    <div>
      <p>{table.table_name}</p>
      <p>{table.capacity}</p>
      <p data-table-id-status={table.table_id}>{table.free ? "Free" : "Occupied"}</p>
    </div>
  );
}

export default TableView;

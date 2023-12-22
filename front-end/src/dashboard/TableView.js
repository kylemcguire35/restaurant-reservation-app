import React from "react";

function TableView({ table }) {
  return (
    <div>
      <p>{table.table_name}</p>
      <p>{table.capacity}</p>
      <p>{table.free}</p>
    </div>
  );
}

export default TableView;

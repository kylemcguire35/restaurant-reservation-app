import React from "react";
import TableView from "./TableView";

function TablesList({ tables }) {
  return (
    <div>
      {tables.map((table) => (
        <TableView table={table} />
      ))}
    </div>
  );
}

export default TablesList;

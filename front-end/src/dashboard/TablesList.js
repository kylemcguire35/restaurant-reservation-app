import React from "react";
import TableView from "./TableView";

function TablesList({ tables }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Table Name</th>
          <th>Capacity</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => (
          <TableView table={table} key={table.table_id} />
        ))}
      </tbody>
    </table>
  );
}

export default TablesList;

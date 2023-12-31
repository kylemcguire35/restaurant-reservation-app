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
        {tables.map((table, index) => (
          <TableView table={table} key={index} />
        ))}
      </tbody>
    </table>
  );
}

export default TablesList;

import React from "react";
import TableView from "./TableView";

function TablesList({ tables }) {
  return (
    <table>
      <th>Table Name</th>
      <th>Capacity</th>
      <th>Status</th>
      <tbody>
        {tables.map((table) => (
          <TableView table={table} />
        ))}
      </tbody>
    </table>
  );
}

export default TablesList;

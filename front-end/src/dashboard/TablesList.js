import React from "react";
import TableView from "./TableView";

function TablesList({ tables }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-striped">
          {tables.map((table) => (
            <TableView table={table} key={table.table_id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablesList;

import React from "react";
import ReservationView from "./ReservationView";

function ReservationsList({ reservations }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Party of</th>
          <th>Phone Number</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation, index) => (
          <ReservationView reservation={reservation} key={index}/>
        ))}
      </tbody>
    </table>
  );
}

export default ReservationsList;

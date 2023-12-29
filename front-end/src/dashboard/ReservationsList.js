import React from "react";
import ReservationView from "./ReservationView";

function ReservationsList({ reservations }) {
  return (
    <table>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Time</th>
      <th>Party of</th>
      <th>Phone Number</th>
      <th>Status</th>
      <tbody>
        {reservations.map((reservation) => (
          <ReservationView reservation={reservation} />
        ))}
      </tbody>
    </table>
  );
}

export default ReservationsList;

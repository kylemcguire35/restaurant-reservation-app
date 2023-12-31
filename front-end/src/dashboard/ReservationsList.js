import React from "react";
import ReservationView from "./ReservationView";

function ReservationsList({ reservations }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th> 
            <th>Party of</th>
            <th>Mobile Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <ReservationView
              reservation={reservation}
              key={reservation.reservation_id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationsList;

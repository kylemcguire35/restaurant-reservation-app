import React from "react";
import ReservationView from "./ReservationView";

function ReservationsList({ reservations }) {
  return (
    <div>
      {reservations.map((reservation) => (
        <ReservationView reservation={reservation} />
      ))}
    </div>
  );
}

export default ReservationsList;

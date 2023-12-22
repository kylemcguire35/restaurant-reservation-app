import React from "react";
import { Link } from "react-router-dom";

function ReservationView({ reservation }) {
  return (
    <div>
      <p>
        {reservation.first_name} {reservation.last_name}
      </p>
      <p>{reservation.reservation_time}</p>
      <p>{reservation.people}</p>
      <p>{reservation.mobile_number}</p>
      <Link to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>
    </div>
  );
}

export default ReservationView;

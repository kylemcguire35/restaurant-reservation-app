import React from "react";

function ReservationView({ reservation }) {
  return (
    <div>
      <p>{reservation.first_name} {reservation.last_name}</p>
      <p>{reservation.reservation_time}</p>
      <p>{reservation.people}</p>
      <p>{reservation.mobile_number}</p>
    </div>
  );
}

export default ReservationView;

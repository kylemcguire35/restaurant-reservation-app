import React from "react";
import { Link } from "react-router-dom";

function ReservationView({ reservation }) {
  return (
    <tr>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>{reservation.mobile_number}</td>
      <td>
        <a href={`/reservations/${reservation.reservation_id}/seat`}>
          Seat
        </a>
      </td>
    </tr>
  );
}

export default ReservationView;

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
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
          <button type="submit">Seat</button>
        </Link>
      </td>
    </tr>
  );
}

export default ReservationView;

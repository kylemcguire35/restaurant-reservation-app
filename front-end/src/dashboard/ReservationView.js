import React from "react";
import { Link } from "react-router-dom";
import { cancelReservation } from "../utils/api";

function ReservationView({ reservation }) {
  const handleCancel = (event) => {
    event.preventDefault();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      cancelReservationFromAPI();
    }
  };

  async function cancelReservationFromAPI() {
    cancelReservation({ ...reservation, status: "cancelled" });
  }

  return (
    <tr>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>{reservation.mobile_number}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>
      {reservation.status === "booked" ? (
        <>
          <td>
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button type="submit">Edit</button>
            </Link>
          </td>
          <td>
            <button
              onClick={handleCancel}
              type="submit"
              data-reservation-id-cancel={reservation.reservation_id}
            >
              Cancel
            </button>
          </td>
        </>
      ) : null}
      {reservation.status === "booked" ? (
        <td>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="submit">Seat</button>
          </Link>
        </td>
      ) : null}
    </tr>
  );
}

export default ReservationView;

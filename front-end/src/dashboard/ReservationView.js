import React from "react";
import { Link } from "react-router-dom";
import { cancelReservation } from "../utils/api";

function ReservationView({ reservation }) {
  async function cancelReservationFromAPI() {
    cancelReservation({ ...reservation, status: "cancelled" });
    window.location.reload();
  }

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

  /**********
  Formatting
  **********/
  function formatDate(dateString) {
    let date = dateString.split("-");
    return `${date[1]}/${date[2]}/${date[0]}`;
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const parsedTime = new Date(0, 0, 0, hours, minutes);
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedTime = parsedTime.toLocaleTimeString("en-US", options);
    return formattedTime;
  }

  function formatMobileNumber(numberString) {
    const cleanedNumber = numberString.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedNumber = `(${cleanedNumber.slice(
      0,
      3
    )})-${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
    return formattedNumber;
  }

  function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const formattedDate = formatDate(reservation.reservation_date);
  const formattedTime = formatTime(reservation.reservation_time);
  const formattedNumber = formatMobileNumber(reservation.mobile_number);
  const formattedStatus = formatStatus(reservation.status);

  return (
    <tr>
      <td>
        {reservation.first_name} {reservation.last_name}
      </td>
      <td>{formattedDate}</td>
      <td>{formattedTime}</td>
      <td>{reservation.people}</td>
      <td>{formattedNumber}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {formattedStatus}
      </td>
      {reservation.status === "booked" ? (
        <div className="btn-group">
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="submit" className="btn btn-warning">
              Seat
            </button>
          </Link>
          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
            <button type="submit" className="btn btn-outline-dark">
              Edit
            </button>
          </Link>
          <button
            onClick={handleCancel}
            type="submit"
            className="btn btn-outline-dark"
            data-reservation-id-cancel={reservation.reservation_id}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </tr>
  );
}

export default ReservationView;

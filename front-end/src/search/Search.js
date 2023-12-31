import React, { useState } from "react";
import ReservationsList from "../dashboard/ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

function Search() {
  const initialFormState = {
    mobile_number: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function loadDashboard(mobile_number) {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  /**********
  Format Phone Number
  **********/
  function formatPhoneNumber(input) {
    const numericInput = input.replace(/\D/g, "");
    return numericInput.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  const formattedPhoneNumber = formatPhoneNumber(formData.mobile_number);

  /**********
  Buttons Handler
  **********/
  async function listReservationsFromAPI() {
    await loadDashboard(formData.mobile_number);
  }

  const handleChange = ({ target }) => {
    let value = target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleFind = (event) => {
    event.preventDefault();
    listReservationsFromAPI();
    setFormData({ ...initialFormState });
    setReservationsError(null);
  };

  return (
    <div className="container d-flex flex-column align-items-center">
      <h3>Search for Reservations</h3>
      <ErrorAlert error={reservationsError} />
      <form className="py-3 text-center">
        <label className="form-label">Search by Mobile Number</label>
        <input
          className="form-control"
          id="mobile_number"
          type="tel"
          name="mobile_number"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          onChange={handleChange}
          value={formattedPhoneNumber}
          placeholder="Mobile Number"
          required
        />
      </form>
      <button className="btn btn-warning" type="submit" onClick={handleFind}>
        Find
      </button>
      <div className="py-3">
        {reservations.length > 0 ? (
          <ReservationsList reservations={reservations} />
        ) : (
          <p>No reservations found</p>
        )}
      </div>
    </div>
  );
}

export default Search;

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTable, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
  const history = useHistory();
  const { reservationId } = useParams();

  const initialFormState = {
    table_id: "",
    reservation_id: parseInt(reservationId),
  };

  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormState });

  useEffect(() => {
    loadTables();
    loadReservation();
    // eslint-disable-next-line
  }, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservationId, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }

  /**********
  Buttons Handler
  **********/
  async function updateFromAPI() {
    await updateTable(formData);
    history.push(
      `/dashboard?date=${reservation.reservation_date.split("T")[0]}`
    );
    window.location.reload();
  }

  const handleChange = ({ target }) => {
    let value = target.value;
    if (target.name === "reservation_id") {
      value = parseInt(target.value);
    }
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isNull()) {
      setError({
        message: "Please select a table.",
      });
      return;
    }
    if (!hasSufficientCapacity(formData.table_id)) {
      setError({
        message: "Reached max capacity. Please seat at a larger table.",
      });
      return;
    }
    if (isTableOccupied(formData.table_id)) {
      setError({
        message: "Table is occupied.",
      });
      return;
    }
    updateFromAPI();
    setError(null);
  };

  /**********
  Properties Middleware
  **********/
  function isNull() {
    return (
      Object.values(formData).some(
        (value) => value === null || value === "" || value === undefined
      ) || formData.table_id === ""
    );
  }

  /**********
  Capacity Middleware
  **********/
  function hasSufficientCapacity(tableId) {
    const capacity = findCapacityByID(tableId);
    const people = reservation.people;
    return capacity >= people;
  }

  function findCapacityByID(tableId) {
    tableId = parseInt(tableId);
    const table = tables.find((table) => table.table_id === tableId);
    return table.capacity;
  }

  /**********
  Status Middleware
  **********/
  function isTableOccupied(tableId) {
    tableId = parseInt(tableId);
    const table = tables.find((table) => table.table_id === tableId);
    return table.reservation_id !== null;
  }

  return (
    <div>
      <h3>{`Seat Reservation: Party of ${reservation.people}`}</h3>
      <ErrorAlert error={reservationError} />
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={error} />
      <form>
        <label className="form-label">
          Select Table
          <select
            className="form-control"
            id="table_id"
            name="table_id"
            onChange={handleChange}
            value={formData.table_id}
            required
          >
            <option value="">Table Name - Capacity</option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </label>
      </form>
      <div className="btn-group">
        <button
          className="btn btn-warning"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button className="btn btn-outline-dark" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SeatReservation;

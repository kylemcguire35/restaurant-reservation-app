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
    updateTable(formData);
    setError(null);
    history.push(
      `/dashboard?date=${reservation.reservation_date.split("T")[0]}`
    );
    window.location.reload()
  };

  function isNull() {
    return (
      Object.values(formData).some(
        (value) => value === null || value === "" || value === undefined
      ) || formData.table_id === ""
    );
  }

  function hasSufficientCapacity(tableId) {
    const capacity = findCapacityByID(tableId);
    const people = reservation.people;
    return capacity >= people;
  }

  function isTableOccupied(tableId) {
    tableId = parseInt(tableId);
    const table = tables.find((table) => table.table_id === tableId);
    return table.reservation_id !== null;
  }

  function findCapacityByID(tableId) {
    tableId = parseInt(tableId);
    const table = tables.find((table) => table.table_id === tableId);
    return table.capacity;
  }

  return (
    <div>
      <ErrorAlert error={reservationError} />
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={error} />
      <form>
        <select
          id="table_id"
          name="table_id"
          onChange={handleChange}
          value={formData.table_id}
          required
        >
          <option value="">Select Table</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default SeatReservation;

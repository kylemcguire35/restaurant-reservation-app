import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationsList from "./ReservationsList";
import TablesList from "./TablesList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, listTables } from "../utils/api";
import { next, previous, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(() => {
    loadReservations(date);
  }, [date]);

  useEffect(() => {
    loadTables();
  }, [tables]);

  function loadReservations(date) {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  /**********
  Formatting
  **********/
  function formatDate(dateString) {
    let date = dateString.split("-");
    return `${date[1]}/${date[2]}/${date[0]}`;
  }

  const formattedDate = formatDate(date)

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h4>{`Select Date: ${formattedDate}`}</h4>
        <div className="btn-group">
          <button
            className="btn btn-outline-dark"
            onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => history.push(`/dashboard?date=${today()}`)}
          >
            Today
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => history.push(`/dashboard?date=${next(date)}`)}
          >
            Next
          </button>
        </div>
      </div>
      <div>
        <h4>Reservations</h4>
        <ErrorAlert error={reservationsError} />
        {reservations.length > 0 ? (
          <ReservationsList reservations={reservations} />
        ) : (
          <p>No reservations to be displayed.</p>
        )}
      </div>
      <div>
        <h4>Tables</h4>
        <ErrorAlert error={tablesError} />
        {tables.length > 0 ? (
          <TablesList tables={tables} />
        ) : (
          <p>No tables to be displayed</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

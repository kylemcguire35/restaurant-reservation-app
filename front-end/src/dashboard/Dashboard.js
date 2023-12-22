import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "./ReservationsList";
import TablesList from "./TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null)
  // eslint-disable-next-line
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    loadDashboard(date);
  }, [date]);

  useEffect(() => {
    loadTables()
  }, [])

  function loadDashboard(date) {
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
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  function adjustDate(button) {
    setCounter((prevCounter) => {
      let newCounter = prevCounter;

      if (button === "today") {
        newCounter = 0;
      } else if (button === "next") {
        newCounter += 1;
      } else if (button === "prev") {
        newCounter -= 1;
      }

      // Use the updated counter to calculate the new date
      const currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() + newCounter);
      const displayDate = currentDate.toISOString().split("T")[0];

      // Call loadDashboard with the updated date
      console.log(displayDate);
      loadDashboard(displayDate);

      return newCounter;
    });
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div>
        <button onClick={() => adjustDate("next")}>Next</button>
        <button onClick={() => adjustDate("prev")}>Previous</button>
        <button onClick={() => adjustDate("today")}>Today</button>
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationsList reservations={reservations} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <ErrorAlert error={tablesError} />
      <TablesList tables={tables}/>
    </main>
  );
}

export default Dashboard;

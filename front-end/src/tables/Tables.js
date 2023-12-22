import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { listTables } from "../utils/api";

function Tables() {
  const history = useHistory();

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //update reservation
    setError(null);
    history.push("/");
  };

  return (
    <div>
      <form>
        <select name="table_id">
          {tables.map((table) => (
            <option>
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

export default Tables;

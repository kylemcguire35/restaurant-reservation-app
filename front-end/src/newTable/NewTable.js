import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function NewTable() {
  const history = useHistory();

  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(null);

  /**********
  Button Handlers
  **********/
  async function createTableFromAPI() {
    await createTable(formData);
    history.push("/");
  }

  const handleChange = ({ target }) => {
    let value = target.value;
    if (target.name === "capacity") value = parseInt(target.value);
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
        message: "Please fill in all required fields.",
      });
      return;
    }
    if (isTooShort(formData.table_name)) {
      setError({
        message: "Table name must be at least 2 characters long.",
      });
      return;
    }
    createTableFromAPI();
    setFormData({ ...initialFormState });
    setError(null);
  };

  /**********
  Properties Middleware
  **********/
  const isNull = () => {
    return Object.values(formData).some(
      (value) => value === null || value === ""
    );
  };

  /**********
  Name Middleware
  **********/
  function isTooShort(name) {
    return name.length < 2;
  }

  return (
    <div>
      <h3>Create Table</h3>
      <ErrorAlert error={error} />
      <form>
        <label className="form-label">
          Table Name
          <input
            className="form-control"
            id="table_name"
            type="text"
            name="table_name"
            onChange={handleChange}
            value={formData.table_name}
            placeholder="Table Name"
            minLength={2}
            required
          />
        </label>
        <label className="form-label">
          Capacity
          <input
            className="form-control"
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            onChange={handleChange}
            value={formData.capacity}
            placeholder="Capacity"
            required
          />
        </label>
      </form>
      <div>
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

export default NewTable;

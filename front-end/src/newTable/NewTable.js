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
    createTable(formData);
    setFormData({ ...initialFormState });
    setError(null);
    history.push("/");
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
      <ErrorAlert error={error} />
      <form>
        <label>
          Table Name
          <input
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
        <label>
          Capacity
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            onChange={handleChange}
            value={formData.capacity}
            required
          />
        </label>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default NewTable;

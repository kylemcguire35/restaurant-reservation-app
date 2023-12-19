import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function NewReservation() {
  const history = useHistory();

  const [error, setError] = useState(null);

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    let value = target.value;
    if (target.name === "people") value = parseInt(target.value);
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
    if (isTuesday(formData.reservation_date)) {
      setError({
        message: "Sorry, we are closed on Tuesday. Please enter another date.",
      });
      return;
    }
    if (isPastDate(formData.reservation_date)) {
      setError({
        message:
          "Sorry, that date has already passed. Please enter another date.",
      });
      return;
    }
    console.log(formData);
    createReservation(formData);
    setFormData({ ...initialFormState });
    setError(null);
    history.push("/");
  };

  const formattedPhoneNumber = formatPhoneNumber(formData.mobile_number);

  function formatPhoneNumber(input) {
    const numericInput = input.replace(/\D/g, "");
    return numericInput.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  const isNull = () => {
    return Object.values(formData).some(
      (value) => value === null || value === ""
    );
  };

  function isTuesday(dateString) {
    const dateObj = new Date(dateString);
    const day = dateObj.getDay();
    return day === 1;
  }

  function isPastDate(dateString) {
    const dateObj = new Date(dateString + 'T00:00:00');
    const today = new Date();
    // Compare the dates, ignoring the time component
    today.setHours(0, 0, 0, 0);
    return dateObj < today;
  }

  return (
    <form>
      <ErrorAlert error={error} />
      <label>
        First Name
        <input
          id="first_name"
          type="text"
          name="first_name"
          onChange={handleChange}
          value={formData.first_name}
          placeholder="First Name"
          required
        />
      </label>
      <label>
        Last Name
        <input
          id="last_name"
          type="text"
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
          placeholder="Last Name"
          required
        />
      </label>
      <label>
        Mobile Number
        <input
          id="mobile_number"
          type="tel"
          name="mobile_number"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          onChange={handleChange}
          value={formattedPhoneNumber}
          required
        />
      </label>
      <label>
        Date of Reservation
        <input
          id="reservation_date"
          type="date"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
          required
        />
      </label>
      <label>
        Time of Reservation
        <input
          id="reservation_time"
          type="time"
          name="reservation_time"
          onChange={handleChange}
          value={formData.reservation_time}
          required
        />
      </label>
      <label>
        People in the Party
        <input
          type="number"
          id="people"
          name="people"
          min="1"
          onChange={handleChange}
          value={formData.people}
          required
        />
      </label>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button onClick={handleCancel}>Cancel</button>
    </form>
  );
}

export default NewReservation;

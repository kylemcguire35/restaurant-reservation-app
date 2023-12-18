import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

function NewReservation() {
  const history = useHistory();

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
    if (target.name === "mobile_number") {
      value = formatPhoneNumber(value);
    }
    if (target.name === "reservation_time") {
      value = value + ":00";
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
      alert("Please fill in all required fields.");
      return;
    }
    createReservation(formData)
    setFormData({ ...initialFormState });
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

  return (
    <form>
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

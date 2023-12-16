import React, { useState } from "react";
import { useHistory } from "react-router-dom";

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
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //create reservation from api
    console.log(formData)
    setFormData({ ...initialFormState });
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
          onChange={handleChange}
          value={formData.mobile_number}
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

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FormComponent from "../formComponent/FormComponent";
import ErrorAlert from "../layout/ErrorAlert";
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
  const [error, setError] = useState(null);

  /**********
  Button Handlers
  **********/
  async function createReservationFromAPI() {
    await createReservation(formData);
    history.push(`/dashboard?date=${formData.reservation_date}`);
    window.location.reload();
  }

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
    if (isPastTime(formData.reservation_time, formData.reservation_date)) {
      setError({
        message:
          "Sorry, that time has already passed. Please enter another time.",
      });
      return;
    }
    if (isClosed(formData.reservation_time)) {
      setError({
        message:
          "Sorry, we are not taking reservations at this time. Please enter another time.",
      });
      return;
    }
    createReservationFromAPI();
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
  Date Middleware
  **********/
  function isTuesday(dateString) {
    const dateObj = new Date(dateString);
    const day = dateObj.getDay();
    return day === 1;
  }

  function isPastDate(dateString) {
    const dateObj = new Date(dateString + "T00:00:00");
    const today = new Date();
    // Compare the dates, ignoring the time component
    today.setHours(0, 0, 0, 0);
    return dateObj < today;
  }

  function isToday(dateString) {
    const dateObj = new Date(dateString + "T00:00:00");
    const today = new Date();
    // Compare the dates, ignoring the time component
    today.setHours(0, 0, 0, 0);
    return (
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate()
    );
  }

  /**********
  Time Middleware
  **********/
  function isPastTime(timeString, dateString) {
    if (isToday(dateString)) {
      const time = parseInt(timeString.split(":").join(""));
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const formattedTime = parseInt(`${hours}${minutes}`);
      return time < formattedTime;
    }
    return false;
  }

  function isClosed(timeString) {
    let time = timeString.split(":");
    if (time.length > 2) {
      time.pop();
    }
    time = parseInt(time.join(""));
    return time < 1030 || time > 2130;
  }

  return (
    <div className="container d-flex flex-column align-items-center">
      <h3>Create Reservation</h3>
      <ErrorAlert error={error} />
      <FormComponent formData={formData} setFormData={setFormData} />
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

export default NewReservation;

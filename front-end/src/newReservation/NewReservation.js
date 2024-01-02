import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FormComponent from "../formComponent/FormComponent";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import moment from "moment";

function NewReservation({ timeZone }) {
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
    await createReservation(formData, timeZone);
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
    if (!isValidMobileNumber(formData.mobile_number)) {
      setError({
        message: "Mobile number must be 10 digits long.",
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
  Mobile Number Middleware
  **********/
  function isValidMobileNumber(number) {
    const numberString = number.split("-").join("");
    return numberString.length === 10;
  }

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
    const dateObj = moment(dateString, "YYYY-MM-DD");
    return dateObj.day() === 2;
  }

  function isPastDate(dateString) {
    const dateObj = moment(dateString, "YYYY-MM-DD");
    const today = moment();
    return dateObj.isBefore(today, "day");
  }

  function isToday(dateString) {
    const dateObj = moment(dateString, "YYYY-MM-DD");
    const today = moment().startOf("day");
    return dateObj.isSame(today, "day");
  }

  /**********
  Time Middleware
  **********/
  function isPastTime(timeString, dateString) {
    if (isToday(dateString)) {
      const time = parseInt(timeString.split(":").join(""));
      const currentTime = moment();
      const formattedTime = parseInt(currentTime.format("HHmm"));
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

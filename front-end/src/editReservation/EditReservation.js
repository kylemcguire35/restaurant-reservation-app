import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import FormComponent from "../formComponent/FormComponent";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import moment from "moment-timezone";

function EditReservation() {
  const history = useHistory();
  const { reservationId } = useParams();

  const [reservationError, setReservationError] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservation();
    // eslint-disable-next-line
  }, []);

  async function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    const response = await readReservation(
      reservationId,
      abortController.signal
    );
    try {
      setFormData({
        reservation_id: reservationId,
        first_name: response.first_name,
        last_name: response.last_name,
        mobile_number: response.mobile_number,
        reservation_date: response.reservation_date.split("T")[0],
        reservation_time: response.reservation_time,
        people: response.people,
      });
    } catch (error) {
      setReservationError(error);
    }
    return () => abortController.abort();
  }

  /**********
  Button Handlers
  **********/
  async function updateReservationFromAPI() {
    await updateReservation(formData);
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
    updateReservationFromAPI();
    setFormData({});
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
    const dateObj = moment.tz(dateString, "YYYY-MM-DD", "UTC");
    return dateObj.day() === 2;
  }

  function isPastDate(dateString) {
    const dateObj = moment.tz(dateString, "YYYY-MM-DD", "UTC");
    const today = moment().tz("UTC");
    return dateObj.isBefore(today, "day");
  }

  function isToday(dateString) {
    const dateObj = moment.tz(dateString + "T00:00:00", "UTC");
    const today = moment().tz("UTC");
    return dateObj.isSame(today, "day");
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
      <h3>Edit Reservation</h3>
      <ErrorAlert error={error} />
      <ErrorAlert error={reservationError} />
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

export default EditReservation;

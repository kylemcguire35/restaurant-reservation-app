const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/********** 
Properties Middleware
**********/
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Reservation must include a ${propertyName}`,
    });
  };
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if (reservation.length > 0) {
    res.locals.reservation = reservation[0];
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservationId} cannot be found.`,
  });
}

/********** 
Date Middleware
**********/
function generateToday() {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  return formattedDate;
}

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

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

function isValidReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;
  if (!isValidDate(reservation_date)) {
    return next({
      status: 400,
      message: "Invalid reservation_date. Please use the format YYYY-MM-DD.",
    });
  }
  if (isTuesday(reservation_date)) {
    return next({
      status: 400,
      message: "Invalid reservation_date. The restaurant is closed on Tuesday.",
    });
  }
  if (isPastDate(reservation_date)) {
    return next({
      status: 400,
      message: "Invalid reservation_date. Please enter today or a future date.",
    });
  }
  next();
}

/********** 
Time Middleware
**********/
function isValidTime(timeString) {
  // Updated regex to allow for "HH:mm" or "HH:mm:ss" formats
  const regex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
  const isValid = regex.test(timeString);
  if (!isValid) {
    return false;
  }
  // If the format is "HH:mm", append ":00" to make it "HH:mm:ss"
  if (timeString.split(":").length === 2) {
    timeString += ":00";
  }
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  // Check if the time components are within valid ranges
  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return false;
  }
  return true;
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
  const time = parseInt(timeString.split(":").join(""));
  return time < 1030 || time > 2130;
}

function isValidReservationTime(req, res, next) {
  const { reservation_time, reservation_date } = req.body.data;
  if (!isValidTime(reservation_time)) {
    return next({
      status: 400,
      message:
        "Invalid reservation_time. Please use a valid time in the format HH:mm:ss.",
    });
  }
  if (isPastTime(reservation_time, reservation_date)) {
    return next({
      status: 400,
      message: "Invalid reservation_time. Please use a current or future time.",
    });
  }
  if (isClosed(reservation_time)) {
    return next({
      status: 400,
      message:
        "Invalid reservation_time. Please use a time when the restaurant is open.",
    });
  }
  next();
}

/********** 
People Middleware
**********/
function isValidReservationPeople(req, res, next) {
  const { people } = req.body.data;
  // Check if people is a number and greater than 0
  if (typeof people !== "string") {
    return next();
  }
  next({
    status: 400,
    message:
      "Invalid number of people. Please provide a valid number greater than 0.",
  });
}

/********** 
Status Middleware
**********/
function isBooked(status) {
  return status === "booked";
}

function isSeated(status) {
  return status === "seated";
}

function isFinished(status) {
  return status === "finished";
}

function isValidStatusForCreate(req, res, next) {
  const { status } = req.body.data;
  if (!isBooked(status)) {
    return next({
      status: 400,
      message: "Table status must be booked. It cannot be seated or finished.",
    });
  }
  next();
}

function isValidStatusForUpdate(req, res, next) {
  const { status } = req.body.data;
  if (!isBooked(status) && !isSeated(status) && !isFinished(status)) {
    return next({
      status: 400,
      message: "Table status is unknown.",
    });
  }
  next();
}

function isAlreadyFinished(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Table status is already finished.",
    });
  }
  next();
}

/********** 
Functions
**********/
//List Function
async function list(req, res) {
  const dateFromQuery = req.query.date;
  let date = "";
  if (!dateFromQuery) {
    date = generateToday();
  } else {
    date = dateFromQuery;
  }
  const data = await service.listByDate(date);
  res.json({ data });
}

//Read Function
function read(req, res, next) {
  const data = res.locals.reservation[0];
  res.json({ data });
}

//Create Function
async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({
    data: newReservation[0],
  });
}

async function update(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    bodyDataHas("status"),
    isValidReservationPeople,
    isValidReservationDate,
    isValidReservationTime,
    isValidStatusForCreate,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    isAlreadyFinished,
    isValidStatusForUpdate,
    asyncErrorBoundary(update),
  ],
};

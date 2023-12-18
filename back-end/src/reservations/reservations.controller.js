const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Middleware
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

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

function isValidReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;
  if (isValidDate(reservation_date)) {
    return next();
  }
  next({
    status: 400,
    message: "Invalid reservation_date. Please use the format YYYY-MM-DD.",
  });
}

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

function isValidReservationTime(req, res, next) {
  const { reservation_time } = req.body.data;
  if (isValidTime(reservation_time)) {
    return next();
  }
  next({
    status: 400,
    message:
      "Invalid reservation_time. Please use a valid time in the format HH:mm:ss.",
  });
}

function isValidReservationPeople(req, res, next) {
  const { people } = req.body.data;

  // Check if people is a number and greater than 0
  if (typeof people !== string) {
    return next();
  }

  next({
    status: 400,
    message:
      "Invalid number of people. Please provide a valid number greater than 0.",
  });
}

function generateToday() {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  return formattedDate;
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const datefromQuery = req.query.date;
  let date = "";
  if (!datefromQuery) {
    date = generateToday();
  } else {
    date = datefromQuery;
  }
  const data = await service.listByDate(date);
  res.json({ data });
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({
    data: newReservation[0],
  });
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
    isValidReservationDate,
    isValidReservationTime,
    asyncErrorBoundary(create),
  ],
};

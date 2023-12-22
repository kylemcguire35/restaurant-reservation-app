const service = require("./tables.service");
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

/********** 
Table Name Middleware
**********/
function isTooShort(name) {
  return name.length < 2;
}

function isValidName(req, res, next) {
  const { table_name } = req.body.data;
  if (isTooShort(table_name)) {
    return next({
      status: 400,
      message:
        "Invalid table_name. Table name must be at least 2 characters long.",
    });
  }
  next();
}

/********** 
Capacity Middleware
**********/
function isNotNumber(capacity) {
  return typeof capacity === "string";
}

function isValidCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (isNotNumber(capacity)) {
    return next({
      status: 400,
      message: "Invalid capacity. Capacity must be a number.",
    });
  }
  next();
}

/********** 
Functions
**********/
//List Function
async function list(req, res) {
  const data = await service.listByName();
  res.json({ data });
}

//Create Function
async function create(req, res) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({
    data: newTable[0],
  });
}

module.exports = {
  create: [
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    isValidName,
    isValidCapacity,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
};

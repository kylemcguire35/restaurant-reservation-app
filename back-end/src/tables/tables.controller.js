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

async function tableExists(req, res, next) {
  const table = await service.readTable(req.params.tableId);
  if (table.length > 0) {
    res.locals.table = table[0];
    return next();
  }
  next({ status: 404, message: `Table cannot be found.` });
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.body.data.reservation_id);
  if (reservation.length > 0) {
    res.locals.reservation = reservation[0];
    return next();
  }
  next({ status: 404, message: `Reservation ${req.body.data.reservation_id} cannot be found.` });
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

function hasSufficientCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;
  if (people > capacity) {
    return next({
      status: 400,
      message: "Reached max capacity. Please seat at a larger table.",
    });
  }
  next()
}

/********** 
Table Free Middleware
**********/
function isTableOccupied(req, res, next) {
  const reservation_id = res.locals.table.reservation_id;
  if (reservation_id !== null) {
    return next({
      status: 400,
      message: "Table is occupied.",
    });
  }
  next()
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

//Update Function
async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedTable);
  res.json({ data });
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
  update: [
    bodyDataHas("reservation_id"),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    hasSufficientCapacity,
    isTableOccupied,
    asyncErrorBoundary(update),
  ],
};

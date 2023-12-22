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
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)]
};

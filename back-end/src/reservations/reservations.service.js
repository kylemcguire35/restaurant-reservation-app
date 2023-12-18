const knex = require("../db/connection");

function listByDate(date) {
  return knex("reservations").select("*").where("reservation_date", date).orderBy("reservation_time");
}

function create(newReservation) {
  return knex("reservations").insert(newReservation).returning("*");
}

module.exports = { listByDate, create };

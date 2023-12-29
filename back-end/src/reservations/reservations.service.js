const knex = require("../db/connection");

function listByDate(date) {
  return knex("reservations").select("*").where("reservation_date", date).orderBy("reservation_time");
}

function read(reservationId) {
  return knex("reservations").select("*").where("reservation_id", reservationId);
}

function create(newReservation) {
  return knex("reservations").insert(newReservation).returning("*");
}

function update(updatedReservation) {
  return knex("reservations")
    .where({ "reservation_id": updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .returning("*")
    .then((updatedRecord) => updatedRecord[0])
}

module.exports = { listByDate, create, read, update };

const knex = require("../db/connection");

function listByName() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where("reservation_id", reservationId);
}

function readTable(tableId) {
  return knex("tables")
    .select("*")
    .where("table_id", tableId);
}

function create(newTable) {
  return knex("tables").insert(newTable).returning("*");
}

function update(updatedTable) {
  return knex("tables")
    .where({ table_id: updatedTable.table_id })
    .update({
      reservation_id: updatedTable.reservation_id,
    })
    .returning("*");
}

module.exports = { create, listByName, read, readTable, update };

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
  return knex("tables").select("*").where("table_id", tableId);
}

function create(newTable) {
  return knex("tables").insert(newTable).returning("*");
}

async function update(updatedTable, updatedReservation) {
  const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0])
    .then(() => {
      return trx("reservations")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
        .then((updatedResRecords) => updatedResRecords[0]);
    })
    .then(trx.commit)
    .catch(trx.rollback);
}

module.exports = {
  listByName,
  read,
  readTable,
  create,
  update,
};

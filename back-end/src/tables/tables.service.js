const knex = require("../db/connection");

function listByName() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables").insert(newTable).returning("*");
}

module.exports = { create, listByName };

const knex = require("../db/connection");

function create(newTable) {
  return knex("tables").insert(newTable).returning("*");
}

module.exports = { create };

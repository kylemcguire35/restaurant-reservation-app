exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary();
    table.string("table_name");
    table.integer("capacity");
    table.boolean("free");
    table
      .integer("reservation_id")
      .unsigned()
      .references("reservation_id")
      .inTable("reservations")
      .onDelete("CASCADE")
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};

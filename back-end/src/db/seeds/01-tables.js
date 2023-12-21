exports.seed = function (knex) {
    return knex("tables").insert([
      {
        table_name: "Bar #1",
        free: true,
        capacity: 1,
      },
      {
        table_name: "Bar #2",
        free: true,
        capacity: 1,
      },
      {
        table_name: "#1",
        free: true,
        capacity: 6,
      },
      {
        table_name: "#2",
        free: true,
        capacity: 6,
      },
    ]);
  };
  
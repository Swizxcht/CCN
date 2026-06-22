const db = require("./db");

db.getConnection((err, connection) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(
    "MySQL Connected Successfully"
  );

  connection.release();
});
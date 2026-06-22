const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.createCustomer = async (req, res) => {
  const { name, email, password, role, status } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required" });
  }

  const validRoles = ["customer", "technician", "admin"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Role must be customer, technician, or admin" });
  }

  try {
    const [existing] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      `
      INSERT INTO users
      (name, email, password, role, status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, email, hashedPassword, role, status || "Active"],
      (err) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.status(201).json({ message: "User created successfully" });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getCustomers = (req, res) => {

  db.query(
    `
    SELECT
      id,
      name,
      email,
      role,
      status,
      created_at
    FROM users
    ORDER BY created_at DESC
    `,
    (err, results) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(results);

    }
  );

};

exports.getCustomer = (req, res) => {

  db.query(
    `
    SELECT
  id,
  name,
  email,
  role,
  status,
  created_at
    FROM users
    WHERE id = ?
    `,
    [req.params.id],
    (err, results) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }

      res.json(results[0]);

    }
  );

};

exports.updateCustomer = (req, res) => {

  const {
    name,
    email
  } = req.body;

  db.query(
    `
    UPDATE users
    SET
      name = ?,
      email = ?
    WHERE id = ?
    `,
    [
      name,
      email,
      req.params.id
    ],
    (err) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json({
        message:
          "Customer updated successfully"
      });

    }
  );

};

exports.deleteCustomer = (req, res) => {

  db.query(
    `
    DELETE FROM users
    WHERE id = ?
    `,
    [req.params.id],
    (err) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json({
        message:
          "Customer deleted successfully"
      });

    }
  );

};

exports.toggleCustomerStatus =
(req, res) => {

  const { status } =
    req.body;

  db.query(
    `
    UPDATE users
    SET status = ?
    WHERE id = ?
    `,
    [
      status,
      req.params.id
    ],
    (err) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json({
        message:
          "Status updated"
      });

    }
  );

};
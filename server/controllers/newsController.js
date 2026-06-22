const db = require("../config/db");

const newsTableSchema = `
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  image_url VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
`;

function ensureNewsTable() {
  db.query(newsTableSchema, (err) => {
    if (err) {
      console.error("Failed to ensure news table:", err);
    }
  });
}

ensureNewsTable();

exports.getNews = (req, res) => {
  db.query(
    `
    SELECT
      id,
      title,
      category,
      summary,
      image_url,
      DATE_FORMAT(created_at, '%M %e, %Y') AS date
    FROM news
    ORDER BY created_at DESC
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(results);
    }
  );
};

exports.getNewsById = (req, res) => {
  db.query(
    `
    SELECT
      id,
      title,
      category,
      summary,
      content,
      image_url,
      DATE_FORMAT(created_at, '%M %e, %Y') AS date,
      created_at,
      updated_at
    FROM news
    WHERE id = ?
    LIMIT 1
    `,
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json(results[0]);
    }
  );
};

exports.createNews = (req, res) => {
  const { title, category, summary, content, image_url } = req.body;
  const uploadedImage = req.file
    ? `/uploads/news/${req.file.filename}`
    : null;

  if (!title || !category || !content) {
    return res.status(400).json({
      message: "Title, category, and content are required",
    });
  }

  db.query(
    `
    INSERT INTO news
      (title, category, summary, content, image_url)
    VALUES
      (?, ?, ?, ?, ?)
    `,
    [title, category, summary || null, content, uploadedImage || image_url || null],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({
        message: "News article created",
        id: result.insertId,
      });
    }
  );
};

exports.updateNews = (req, res) => {
  const { title, category, summary, content, image_url } = req.body;
  const uploadedImage = req.file
    ? `/uploads/news/${req.file.filename}`
    : null;

  if (!title || !category || !content) {
    return res.status(400).json({
      message: "Title, category, and content are required",
    });
  }

  db.query(
    `
    UPDATE news
    SET title = ?, category = ?, summary = ?, content = ?, image_url = COALESCE(?, image_url), updated_at = NOW()
    WHERE id = ?
    `,
    [title, category, summary || null, content, uploadedImage || image_url || null, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json({ message: "News article updated" });
    }
  );
};

exports.deleteNews = (req, res) => {
  db.query(
    `
    DELETE FROM news
    WHERE id = ?
    `,
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json({ message: "News article deleted" });
    }
  );
};

const connection = require("../SQL/connection");

function getClientUserRelation(req, res) {
  const sql = `SELECT u.user_id, u.user_name, c.full_name, c.bio FROM users AS u
JOIN clients as c WHERE c.user_id = u.user_id
AND u.user_id = ?;`;
  connection.query(sql, req.user_id, (err, results) => {
    res.json(results);
  });
}

module.exports = { getClientUserRelation };

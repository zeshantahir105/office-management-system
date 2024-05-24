const jwt = require("jsonwebtoken");
const db = require("../models/index");

async function authenticate(req, res, next) {
  const token = req.headers?.["token"];

  let user;

  if (token) {
    user = await db.users.findOne({
      attributes: ["roleType", "id"],
      include: [
        {
          model: db.user_sessions,
          as: "sessions",
          where: { token },
          attributes: [],
        },
      ],
    });
  }

  if (!user) return res.sendStatus(401); // If there's no token, return 401 (Unauthorized)

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.sendStatus(403); // If the token is invalid, return 403 (Forbidden)
    req.user = {
      id: user.id,
      roleType: user.roleType,
    };
    next();
  });
}

module.exports = authenticate;

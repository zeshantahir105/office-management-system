const jwt = require("jsonwebtoken");
const db = require("../models/index");

async function authenticate(req, res, next) {
  const token = req.headers?.["token"];

  let user;

  if (token) {
    user = await db.user_sessions.findOne({
      where: { token },
    });
  }

  if (!user) return res.sendStatus(401); // If there's no token, return 401 (Unauthorized)

  const data = jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.sendStatus(403); // If the token is invalid, return 403 (Forbidden)
    req.user = user;
    next();
  });

  console.log({ data });

  //   return res.sendStatus(401);
}

module.exports = authenticate;

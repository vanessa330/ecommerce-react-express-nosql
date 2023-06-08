const jwt = require("jsonwebtoken");

/* MIDDLEWARE */
const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) return res.status(403).send({ error: "Access Denied" });

    if (token.startsWith("Bearer")) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};

module.exports = { verifyToken };
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            msg: "Token is required"
        });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded
    req.role = decoded.userRole;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid or Expired Token",
    });
  }
};

// Authorization (Admin)
const authorization = async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ msg: "Access Denied" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { authentication, authorization };
import * as jwt from "jsonwebtoken";

export function generateAuthToken(user) {
  const payload = {
    userId: user._id,
    userEmail: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

  return token;
}

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        console.log("token verified");
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

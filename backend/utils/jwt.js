import jwt from 'jsonwebtoken';

function createJWT(payload, duration) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: duration });
}

function verifyJWT(token) {
  try {
    const JWTresponse = jwt.verify(token, process.env.JWT_SECRET);
    return JWTresponse;
  } catch (err) {
    return;
  }
}

export { createJWT, verifyJWT };

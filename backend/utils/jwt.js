import jwt from 'jsonwebtoken';

function createJWT(payload, duration) {
  const expiry = duration ? { expiresIn: duration } : {};
  return jwt.sign(payload, process.env.JWT_SECRET, expiry);
}

function verifyJWT(token) {
  try {
    const JWTresponse = jwt.verify(token, process.env.JWT_SECRET);
    return JWTresponse;
  } catch (err) {
    return { error: err.message };
  }
}

export { createJWT, verifyJWT };

import crypto from 'crypto';

export function generateOTP(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(10);
  }
  return otp;
}

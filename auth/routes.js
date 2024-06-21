const express = require('express');
const {signUp, signIn, confirmEmail, reSendVerifyCode, refreshToken} = require('./controllers');
const router = express.Router();
const passport = require('passport')

router.post('/api/auth/signup', signUp);
router.post('/api/auth/login', signIn);
router.post('/api/auth/email-confirm', confirmEmail);
router.post('/api/auth/login/refresh', refreshToken);
router.post('/api/auth/resend-email-confirm', reSendVerifyCode);

module.exports = router;
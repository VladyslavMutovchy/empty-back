import Router from 'router';
import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';

import GoogleStrategy from 'passport-google-oauth20';
// import { initFacebookCheck } from '../utils/facebook.js';
import { apiPublicWrapper } from '../utils/apiWrapper.js';
import authValidator from '../validations/auth.js';
import authAction from '../actions/auth.js';

//initialize router
const authApi = Router();

passport.use(new GoogleStrategy({
  clientID: '699726414230-rngjos248v7khf5gk03tamu9pqikd8ff.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000'
}, async (accessToken, refreshToken, profile, done) => {
  const userData = await authAction.googleLogin(profile);
  return done(null, userData);
}));



passport.use(new FacebookTokenStrategy({
  clientID: '1040222957548745', // Ваш Facebook App ID
  clientSecret: '648be84e9293443b73b64a4a5208c709' // Ваш Facebook App Secret
}, async (accessToken, refreshToken, profile, done) => {
  const userData = await authAction.facebookLogin(profile);
  return done(null, userData);
}));

authApi.route('/api/v1/auth/facebook-login').post(passport.authenticate('facebook-token', { session: false }), apiPublicWrapper((req) => {
  console.log('===FACEBOOK LOGIN', req.user);
  return req.user;
}));

authApi.route('/api/v1/auth/registration').post(apiPublicWrapper(async (req) => {
 // await authValidator.registration(req.body);
  const userData = await authAction.registration(req.body);
  return authAction.login(userData);
}));

authApi.route('/api/v1/auth/login').post(apiPublicWrapper(async (req) => {
  const userData = await authValidator.login(req.body);
  return authAction.login(userData);
}));

authApi.route('/api/v1/admin/auth/login').post(apiPublicWrapper(async (req) => {
  const userData = await authValidator.login(req.body, true);
  return authAction.adminLogin(userData);
}));

authApi.route('/api/v1/auth/google').post(apiPublicWrapper((req) => {
  return authAction.googleAuth(req.body.code);
}));

authApi.route('/api/v1/auth/facebook').post(apiPublicWrapper(async (req) => {
  return await authAction.facebookAuth(req.body.code);
}));

authApi.route('/api/v1/auth/google').get(passport.authenticate('google', {
  scope: ['profile', 'email']
}));

authApi.route('/api/v1/auth/google/callback').get(passport.authenticate('google', {
  session: false
}), apiPublicWrapper((req) => {
  return req.user;
}));


export default authApi;
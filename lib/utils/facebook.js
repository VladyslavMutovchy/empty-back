import FacebookTokenStrategy from 'passport-facebook-token';

export const initFacebookCheck = (passport, callback) => {
  passport.use(new FacebookTokenStrategy({
    clientID: '1040222957548745', // Ваш Facebook App ID
    clientSecret: '648be84e9293443b73b64a4a5208c709' // Ваш Facebook App Secret
  }, callback));
};
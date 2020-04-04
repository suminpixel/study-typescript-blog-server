import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import User from '../models/user';

export default () => {
  passport.use('local', new Strategy({
    usernameField: 'user_id',
    passwordField: 'password',
  }, async (user_id, password, done) => {
    try {
      const user = await User.findOne({ where: { user_id } });
      if (!user) {
        return done(null, false, { message: 'no user' });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      }
      return done(null, false, { message: 'missmatch password' });
    } catch (e) {
      console.error(e);
      return done(e);
    }
  }));
};
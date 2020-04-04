import * as passport from 'passport';

import Post from '../models/post'; 
import User from '../models/user'; //TODO : 클래스 자체를 타입으로 쓸 수 있다.
import local from './local';

export default () => {
    //로그인할때 1회 실행   
    passport.serializeUser((user: User, done) =>
        done(null, user.user_id)
    );
    //매번 요청할 때 마다 실행
    passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        include: [{
          model: Post,
          as: 'Posts',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }],
      });
      return done(null, user); // don 에 넣어준 것 : req.user
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local();
};
import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import Image from '../models/image';
import Post from '../models/post';
import User from '../models/user';

import { isLoggedIn, isNotLoggedIn } from './middleware';
import { IUser } from '../@types';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => { // /api/user/
  const user = req.user!.toJSON() as User;
  delete user.password;
  return res.json(user);
});

router.post('/', async (req, res, next) => { // POST /api/user 회원가입
  try {
    const exUser = await User.findOne({
      where: {
        user_id: req.body.user_id,
      },
    });
    if (exUser) {
      return res.status(403).send('already user_id');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt는 10~13 사이로
    const newUser = await User.create({
      name: req.body.name,
      user_id: req.body.user_id,
      password: hashedPassword,
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});


router.post('/logout', isLoggedIn, (req, res) => { // /api/user/logout
  req.logout();
  if (req.session) {
    req.session.destroy((err) => {
      res.send('logout 성공');
    });
  } else {
    res.send('logout 성공');
  }
});

router.post('/login', (req, res, next) => { // POST /api/user/login
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await User.findOne({ //비밀번호 제외 
          where: { id: user.id },
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
          attributes: ['id', 'name', 'user_id'],
        });
        console.log(fullUser);
        return res.json(fullUser);
      } catch (e) {
        return next(e);
      }
    });
  })(req, res, next);
});




router.get('/:id', async (req, res, next) => { // 남의 정보 가져오는 것 ex) /api/user/123
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.id, 10) },
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
      attributes: ['id', 'name'],
    });
    if (!user) return res.status(404).send('no user');
    const jsonUser = user.toJSON() as IUser;
    jsonUser.PostCount = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.FollowingCount = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.FollowerCount = jsonUser.Followers ? jsonUser.Followers.length : 0;
    return res.json(jsonUser);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get('/:id/followings', isLoggedIn, async (req, res, next) => { // /api/user/:id/followings
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
    });
    if (!user) return res.status(404).send('no user');
    const followers = await user.getFollowings({
      attributes: ['id', 'name'],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10),
    });
    return res.json(followers);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get('/:id/followers', isLoggedIn, async (req, res, next) => { // /api/user/:id/followers
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
    }); // req.params.id가 문자열 '0'
    if (!user) return res.status(404).send('no user');
    const followers = await user.getFollowers({
      attributes: ['id', 'name'],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10),
    });
    return res.json(followers);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: { id: req.user!.id },
    });
    await me!.addFollowing(parseInt(req.params.id, 10));
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: { id: req.user!.id },
    });
    await me!.removeFollowing(parseInt(req.params.id, 10));
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/posts', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
        RetweetId: null,
      },
      include: [{
        model: User,
        attributes: ['id', 'name'],
      }, {
        model: Image,
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch('/name', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({
      name: req.body.name,
    }, {
      where: { id: req.user!.id },
    });
    res.send(req.body.name);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
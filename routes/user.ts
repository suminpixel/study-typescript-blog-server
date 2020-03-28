import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import Image from '../models/image';
import Post from '../models/post';
import User from '../models/user';

import { isLoggedIn } from './middleware';

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
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send('already email');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt는 10~13 사이로
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
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
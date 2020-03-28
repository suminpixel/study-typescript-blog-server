import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as dotenv from 'dotenv';
import * as hpp from 'hpp';
import * as helmet from 'helmet';
import * as passport from 'passport';
import { sequelize } from './models';

dotenv.config();
const app = express();
const prod = process.env.NODE_ENV === 'production';

sequelize.sync({force : false}) //true : 초기화
    .then(()=>{
        console.log(`db connect ...`);
    })
    .catch((e: Error)=>{
        console.error(`db error : ${e}`);
    })
if(prod){
    app.use(hpp());
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(cors({
        origin: /suminblog\.com$/,
        credentials: true
    }))
}else{
    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials: true,
    }))
}

app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
        httpOnly: true,
        secure: false,
        domain: prod ? '.suminblog.com' : undefined
    },
    name: 'back',
}))

app.use(passport.initialize);
app.use(passport.session());

app.set('port', prod ? process.env.PORT : 3065);
app.get('/', (req, res, next) => {
    res.send('backend running...');
})

app.listen(app.get('port'), ()=>{
    console.log(`server is running on ${app.get('port')}`);
});
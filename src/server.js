require('dotenv').config();

import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';

const FileStore = new sessionFileStore(session);

const {
  NODE_ENV,
  SESSION_SECRET,
  CART_EMPTY,
  BACKEND_URL,
  LOCAL_PORT,
} = process.env;
const dev = NODE_ENV === 'development';

polka()
  .use(
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 31536000,
      },
      store: new FileStore({
        path: process.env.NOW ? `/tmp/sessions` : `.sessions`,
      }),
    }),
    compression({ threshold: 0 }),
    sirv('static', { dev }), // public -s
    cookieParser(),
    sapper.middleware({
      session: (req, res) => {
        let sessionLog = {
          userExists: !!req.session.user,
          tokenExists: !!req.session.token || false,
          userAgent: req.headers['user-agent'],
          MODE: NODE_ENV,
          BACKEND_URL,
          CART_EMPTY: CART_EMPTY !== 'false',
        };

        console.log('SAPPER SESSION:');
        console.table(sessionLog);

        return {
          user: req.session.user || null,
          tokenExists: !!req.session.token || false,
          token: !!req.session.token ? '(lives on server)' : null,
          userAgent: req.headers['user-agent'],
          MODE: NODE_ENV,
          BACKEND_URL,
          CART_EMPTY: CART_EMPTY !== 'false',
        };
      },
    })
  )
  .listen(process.env.PORT || 3000, (err) => {
    if (err) console.log('error', err);
  });

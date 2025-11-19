import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './database.js';
import { shutdownHandler, handleDisconnect } from './database.js';


const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.set('trust proxy', 1);

shutdownHandler(handleDisconnect);


app.use(session
  (
    {
      store: process.env.NODE_ENV === 'production'
        ? new (pgSession(session))(
        {
            pool: db,
            tableName: 'session',
            createTableIfMissing: true
        })
        : null,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000
    }
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

app.post("/logout", (req, res, next) =>
{
  req.logout((err) =>
  {
    if (err)
    {
      return next(err);
    }

    req.session.destroy((err) =>
    {
      if (err)
      {
        return next(err);
      }

      res.clearCookie("connect.sid");
      
      return res.json({ redirect: "/" });

    });
  });
});


app.get('/welcome', async (req, res) =>
{
  if (req.isAuthenticated())
  {
    try
    {
      const content = await db.query(
        `SELECT content
          FROM contents
          WHERE user_id = $1`,
          [ req.user.user_id ]
      );

      return res.json(
        { loggedIn: true,
           content: content.rows[0].content
        }
      );
    }
    catch (err)
    {
      console.error("Error fetching content:", err);
    
      return res.status(500).json(
        { loggedIn: true,
           message: 'Internal Server Error'
        }
      );
    }
  }
  else
  {
      return res.status(401).json(
        { loggedIn: false,
           message: 'Unauthorized'
        }
      );
  }
});


app.put('/add_content', async (req, res) =>
{
  if (req.isAuthenticated())
  {
      const content = req.body.content;
      const username = req.user.username;
  
      try
      {
        await db.query(
          `UPDATE contents AS t
          SET content = $1
          FROM credentials AS c
          WHERE t.user_id = c.user_id AND c.username = $2`,
          [ content, username ]
        );

      return res.json({ isSubmitted: true, message: 'Text submitted successfully' });

      }
      catch (err)
      {
          console.error("Error updating content:", err);

          return res.status(500).json(
            { isSubmitted: false,
               message: 'Internal Server Error'
            }
          );
      }
  }
  else
  {
    return res.status(401).json(
      { isSubmitted: false,
         message: 'Unauthorized'
      }
    );
  }
});


app.get('/login', (req, res) =>
{
    if (req.isAuthenticated())
    {
        return res.json({ loggedIn: true });
    }
    else
    {
        return res.json({ loggedIn: false });
    }
});


app.post('/login', (req, res, next) =>
{
  passport.authenticate('local', (err, user, info) =>
  {
    if (err)
    {
      return next(err);
    }

    if (!user)
    {
      return res.json({ loggedIn: false, message: "Authentication failed" });
    }

    req.logIn(user, async (err) =>
    {
      if (err) {
         return next(err);
      }

      await db.query(
        `UPDATE credentials
         SET last_login = NOW()
         WHERE username = $1`,
        [user.username,]
      );

      return res.json({ loggedIn: true, username: user.username });
    });

  })(req, res, next);
});


app.post("/registration", async (req, res) =>
{
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
  {
    return res.json({ isPasswordMismatch: true });
  }

  try
  {
    const checkResult = await db.query(
      `SELECT * FROM credentials 
      WHERE username = $1`,
      [ username ]
    );

    if (checkResult.rows.length > 0)
    {
      return res.json({ isAccountExists: true });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      `INSERT INTO credentials (username, password, created_on)
        VALUES ($1, $2, NOW()) RETURNING *`,
      [username, hash]
    );

    const user_id = result.rows[0].user_id;

    await db.query(
      `INSERT INTO contents (user_id)
        VALUES ($1)`,
        [user_id]
    );

    const user = result.rows[0];

    req.login(user, (err) =>
    {
      if (err)
      {
        console.error("Login after registration failed:", err);

        return res.status(500).json(
          { isRegistered: false,
            message: "Login after registration failed" }
        );
      }

      res.json({ isRegistered: true, username: username });

    });

  }
  catch (err)
  {
    console.log(err);
  }
});


passport.use(
  new Strategy(async function verify(username, password, cb)
  {
    try
    {
      const result = await db.query(
        `SELECT * FROM credentials
        WHERE username = $1`,
        [ username ]
      );

      if (result.rows.length === 0) 
      {
        return cb(null, false, { message: "Invalid Username" });
      }
      
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      bcrypt.compare(password, storedHashedPassword, (err, isMatch) =>
      {
        if (err)
        {
            return cb(err);
        }

        if (!isMatch)
        {
            return cb(null, false, { message: "Invalid Password" });
        }

        return cb(null, user);
      });
    }
    catch (err)
    {
        return cb(err);
    }
  })
);


passport.serializeUser((user, cb) =>
{
  cb(null, user);
});


passport.deserializeUser((user, cb) =>
{
  cb(null, user);
});


app.listen(PORT, () =>
{
    console.log(`Server is running on port ${PORT}`);
});
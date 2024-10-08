const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');
const crypto = require('crypto');

require('dotenv').config();

const { PORT, DB_PORT, HOST, DB_USER, PASSWORD, DB } = process.env;

const db_info = {
  host: HOST,
  port: DB_PORT,
  user: DB_USER,
  password: PASSWORD,
  database: DB,
};

app.use(cors({ origin: '*' }));
app.use(express.json({ extended: true }));

const appStart = async () => {
  const connection = await mysql.createConnection(db_info);

  app.get('/', async (req, res) => {
    try {
      const [results] = await connection.query('SELECT * FROM `guestbook`');
      const result = results.map((element) => ({
        id: element.id,
        name: element.name,
        message: element.message,
        created_at: element.created_at,
      }));

      res.send(result);
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/', async (req, res) => {
    const { name, message, password } = req.body;
    const hashPassword = crypto
      .createHash('sha512')
      .update(password + PASSWORD) //salt
      .digest('hex');

    await connection.query(
      'INSERT INTO guestbook (name, message, hash) values (?, ?, ?)',
      [name, message, hashPassword]
    );

    res.json({
      message: 'ok',
    });
  });

  app.delete('/', async (req, res) => {
    const id = req.query?.id;
    const password = req.query?.password;
    const [results] = await connection.query(
      'SELECT * FROM `guestbook` where id=?',
      [id]
    );

    const hashPassword = crypto
      .createHash('sha512')
      .update(password + PASSWORD) //salt
      .digest('hex');

    const isRight = results[0].hash === hashPassword;
    if (!isRight) {
      res.status(400).json({
        message: '비밀번호가 다릅니다.',
      });
    }
    await connection.query('DELETE from guestbook where id=?', [id]);
    res.json({
      message: 'ok',
    });
  });

  app.patch('/', async (req, res) => {
    const id = req.query?.id;
    const { name, message, password } = req.body;

    const hashPassword = crypto
      .createHash('sha512')
      .update(password + PASSWORD) //salt
      .digest('hex');

    const isRight = results[0].hash === hashPassword;
    if (!isRight) {
      res.status(400).json({
        message: '비밀번호가 다릅니다.',
      });
    }

    await connection.query(
      'UPDATE guestbook SET name=?, message=? where id=?',
      [name, message, id]
    );
    res.json({
      message: 'ok',
    });
  });

  app.listen(PORT, () => {
    console.log('app init');
  });
};

appStart();

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');
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

      res.send(results);
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/', async (req, res) => {
    const { name, message } = req.body;
    await connection.query(
      'INSERT INTO guestbook (name, message) values (?, ?)',
      [name, message]
    );
    res.json({
      message: 'ok',
    });
  });

  app.delete('/', async (req, res) => {
    const id = req.query?.id;
    await connection.query('DELETE from guestbook where id=?', [id]);
    res.json({
      message: 'ok',
    });
  });

  app.patch('/', async (req, res) => {
    const id = req.query?.id;
    const { name, message } = req.body;
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

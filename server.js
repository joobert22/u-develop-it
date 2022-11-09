const express = require('express')
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

// PORT designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Connect to database 
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'limothecorgi',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );

// Function that will start Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


// GET test route
// app.get('/', (req, res) => {
//     res.json({
//       message: 'Hello World'
//       });
//   });

// Query the database to test the connection
// Once this method executes the SQL command, the callback function captures the responses from the query in two variables:
// err = error response, rows = database query response
// If there are no errors in the SQL query, the err value is null. 

// db.query(`SELECT * FROM candidates`, (err, rows) => {
//    console.log(rows);
//   });

// GET from candidates: Specific candidate using query
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//    if (err) {
//      console.log(err);
//     }
//     console.log(row);
//  });

// DELETE from candidates: Specific candidate using query
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//    if (err) {
//      console.log(err);
//    }
//    console.log(result);
//  });

// CREATE into candidate
// const sql = 'INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)';
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });


// POST into candidate
// app.post('/api/candidate', ({ body }, res) => {
//   const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
//   if (errors) {
//     res.status(400).json({ error: errors });
//     return;
//   }
//   const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
//   VALUES (?,?,?)`;
// const params = [body.first_name, body.last_name, body.industry_connected];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     res.status(400).json({ error: err.message });
//     return;
//   }
//   res.json({
//     message: 'success',
//     data: body
//   });
// });
// });


// GET from candidates: All candidates
app.get('/api/candidates', (req, res) => { // Set up route
   const sql = `SELECT * FROM candidates`;

db.query(sql, (err, rows) => { // Pass in two parameters: sql, and an arrow function with two parameters: error and rows (data retrieved)
    if (err) {
        res.status(500).json({error: err.message}); // If error occurs, server will send back a response status error code of 500.
        return;
    }
    res.json({
        message: 'success', // Object with two properties: a message with a value of 'success', and a data property with a value of 'rows.'
        data: rows
    });
  });
});


// GET from candidates: Specific candidate using param
app.get('/api/candidate/:id', (req,res) => {
    const sql = 'SELECT * FROM candidates WHERE id = ?';
    const params = [req.params.id]; //  Endpoint has a route parameter that will hold the value of the id to specify which candidate we'll select from the database.

db.query(sql, params, (err, rows) => { 
    if (err) {
        res.status(400).json({error: err.message});
        return;
    }
    res.json({
        message: 'success',
        data: rows
    });
 });
});


// GET from candidates joined with parties: Specific candidate using param
// app.get('/api/candidate/:id', (req,res) => {
//   const sql = 'SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties on candidates.party_id = parties.id WHERE candidates.id = ?';
//   const params = [req.params.id]; 

// db.query(sql, params, (err, rows) => { 
//   if (err) {
//      res.status(400).json({error: err.message});
//      return;
//   }
//   res.json({
//      message: 'success',
//      data: rows
//   });
// });
// });

// /** 
//  * This is a temp function
//  */
// function temp() { }


// GET from parties: All parties
// app.get('/api/parties', (req,res) => {
//   const sql = 'SELECT * FROM parties';
//   db.query(sql, (err,rows) => {
//     if (err) {
//         res.status(500).json({error: err.message});
//         return;
//       }
//         res.json({
//           message: 'success',
//           data: rows
//       });
//   });
// });


// GET from parties: Specific party using param
app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// DELETE from parties: Specific party using param
app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


// UPDATE candidates: Update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
  const errors = inputCheck(req.body, 'party_id');

if (errors) {
  res.status(400).json({ error: errors });
  return;
}
  const sql = 'UPDATE candidates SET party_id = ? WHERE id = ?';
  const params = [req.body.party_id, req.params.id];  // The affected row's id should always be part of the route (e.g., /api/candidate/2) while the actual fields we're updating should be part of the body.
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});









// CATCHALL route: Route to handle user requests that aren't supported by the app (Default response for any other request (Not Found))
app.use((req, res) => {
    res.status(404).end();
  });

const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');


// GET from candidates: All candidates
router.get('/candidates', (req, res) => { // Originally app.get('/api/candidates', (req, res) => 
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
router.get('/candidate/:id', (req, res) => {
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
 

 // POST into candidate
router.post('/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];
  
db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});
  

// PUT from candidates: Update a candidate's party
router.put('/candidate/:id', (req, res) => {
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


// DELETE from candidates: Specific candidate using param
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
        // checks if anything was deleted
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
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
  

  module.exports = router;

 
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
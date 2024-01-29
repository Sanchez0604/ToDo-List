const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3002;

// Create database and tables
const db = new sqlite3.Database('todo.db');
db.serialize(()=>{
    db.run("CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,description TEXT,done INTEGER DEFAULT 0)")
})

app.use(cors()); //Allow CORS
app.use(express.json()); // Allow use of JSON on req body

//rotes for crud
app.get('/tasks',(req,res)=>{
    db.all('SELECT * FROM task',(err, rows)=>{
        if(err){
            res.status(500).send(err.message);
            return
        }
        res.json(rows);
    })
})

app.post('/tasks', (req,res)=>{
    const{title,description}= req.body  

    // Verify if title/description is null
    if (!title || !description) {
        res.status(400).send("The title and description are mandatory.");
        return;
      }
    // Statement const insert into task the values
      const stmt = db.prepare("INSERT INTO task (title, description) VALUES (?, ?)");
      stmt.run(title, description, (err) => {
        if (err) {
          res.status(500).send(err.message);
          return;
        }
    
        res.send("Task added successfully!");
      });
    
      stmt.finalize();
    });
    
app.put('/tasks/:id', (req, res) => {
    console.log('req.body:', req.body);
    const taskId = req.params.id;
    const { title,description,done } = req.body;
    
    // Verify if title/description is null
    if (!title || !description) {
        res.status(400).send("The title and description are mandatory.");
        return;
    }
    // Statement const update task values
    const stmt = db.prepare("UPDATE task SET title = ?, description = ?, done = ? WHERE id = ?");
    stmt.run(title,description,done, taskId, (err) => {
        if (err) {
        res.status(500).send(err.message);
        return;
        }
    
        res.send(`Task updated successfully!`);
    });
    
    stmt.finalize();
    });

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    
    const stmt = db.prepare("DELETE FROM task WHERE id = ?");
    stmt.run(taskId, (err) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({ message: `Task with ${taskId} deleted` });
    });
    
    stmt.finalize();
    });

app.listen(port, () => {
    console.log(`Server is running on:  http://localhost:${port}`);
    });

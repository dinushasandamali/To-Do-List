const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Route to get all tasks
app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => res.json(result))
        .catch(err => {
            console.error('Error fetching todos:', err);
            res.status(500).send('Error fetching todos');
        });
});

// Route to update a task
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { done } = req.body;

    if (typeof done !== 'boolean') {
        return res.status(400).send('Invalid "done" value');
    }

    TodoModel.findByIdAndUpdate(
        id,
        { done },
        { new: true } // Return the updated document
    )
        .then(task => {
            if (!task) {
                return res.status(404).send('Task not found');
            }
            res.json(task);
        })
        .catch(err => {
            console.error('Error updating task:', err);
            res.status(500).send('Error updating task');
        });
});

// Route to add a new task
app.post('/add', (req, res) => {
    const { task } = req.body;

    if (!task || typeof task !== 'string') {
        return res.status(400).send('Invalid task');
    }

    TodoModel.create({ task, done: false })
        .then(result => res.json(result))
        .catch(err => {
            console.error('Error adding task:', err);
            res.status(500).send('Error adding task');
        });
});

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    TodoModel.findByIdAndDelete({_id: id})
    .then(result => res.json(result))
    .catch(err => {
        console.error('Error deleting task:', err);
        res.status(500).send('Error deleting task');
    });

})
// Start the server
app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});

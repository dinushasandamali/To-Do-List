import React, { useEffect, useState } from 'react';
import Create from '../Create/Create'; // Assuming this handles adding new tasks
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';
import '../Home/Home.css';

function Home() {
    const [todos, setTodos] = useState([]); // Holds tasks
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch todos on component mount
    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => {
                setTodos(result.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Handle toggling the "done" status
    const handleEdit = (id) => {
        const todo = todos.find(t => t._id === id); // Find the specific task
        if (!todo) return;

        const updatedTodo = { ...todo, done: !todo.done }; // Toggle the `done` status

        axios.put(`http://localhost:3001/update/${id}`, updatedTodo)
            .then(result => {
                location.reload()
            })
            .catch(err => {
                console.error(err);
            });
    };

    // Handle task deletion
    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => {
                setTodos(todos.filter(t => t._id !== id)); // Remove deleted task from state
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div className='home'>
            <h2>Todo List</h2>
            <Create /> {/* Component for adding new tasks */}

            {loading ? (
                <p>Loading...</p> // Show loading indicator
            ) : todos.length === 0 ? (
                <h2>No Record</h2> // Show message if no tasks
            ) : (
                todos.map(todo => (
                    <div key={todo._id} className='task'>
                        <div className="checkbox" onClick={() => handleEdit(todo._id)}>
                            {todo.done ? (
                                <BsFillCheckCircleFill className='icon' />
                            ) : (
                                <BsCircleFill className='icon' />
                            )}
                            <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
                        </div>
                        <div>
                            <span onClick={() => handleDelete(todo._id)}>
                                <BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} />
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;

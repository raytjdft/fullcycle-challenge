const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// MySQL connection configuration
const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

// Generate random name
const getRandomName = () => {
    const names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana'];
    return names[Math.floor(Math.random() * names.length)];
};

app.get('/', async (req, res) => {
    try {
        // Create database connection
        const connection = await mysql.createConnection(dbConfig);

        // Insert random name
        const name = getRandomName();
        await connection.execute('INSERT INTO people (name) VALUES (?)', [name]);

        // Get all names
        const [rows] = await connection.execute('SELECT name FROM people');
        
        // Format response
        let response = '<h1>Full Cycle Rocks!</h1>\n<ul>';
        rows.forEach(row => {
            response += `<li>${row.name}</li>`;
        });
        response += '</ul>';

        // Close connection
        await connection.end();

        res.send(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
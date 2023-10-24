const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 14; 

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MSQL_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

async function getUsers() {
    try {
        let [rows] = await pool.query("SELECT * FROM users");
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function getUsersByCredentials(userName) {
    try {
        let [rows] = await pool.query("SELECT * FROM users WHERE name = ?", [userName]);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function getUser(id) {
    try {
        let [rows] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [id]);
        
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function createUser(name, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        let [rows] = await pool.query(`INSERT INTO users (name, password) VALUES (?, ?)`, [name, hashedPassword]);
        console.log(rows.insertId)
        return getUser(rows.insertId);

 
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}


async function createPost(title, body, user_id) {
    try {
       
        let [rows] = await pool.query(`INSERT INTO post (title, body, user_id) VALUES (?, ?, ?)`, [title, body, user_id]);
     
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function deletePost(post_id) {
    try {
        let [rows] = await pool.query(`DELETE FROM post WHERE  post_id = ?`, [post_id]);
        console.log(rows);
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function getPost(post_id) {
    try {
        let [rows] = await pool.query(`SELECT * FROM post WHERE post_id = ?`, [post_id]);
       
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function getPosts() {
    try {
        let [rows] = await pool.query(`SELECT * FROM post ORDER BY post_id DESC;`);
        
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function createComment(comment_body, post_id, user_id) {
    try {
        let [rows] = await pool.query(`INSERT INTO comment (comment_body, post_id, user_id) VALUES (?, ?, ?)`, [comment_body, post_id, user_id]);
    
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function deleteComment(comment_id) {
    try {
        let [rows] = await pool.query(`DELETE FROM comment WHERE comment_id = ?`, [comment_id]);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function getPostComments(post_id) {
    try {
        let [rows] = await pool.query(`SELECT * FROM comment WHERE post_id = ?`, [post_id]);
    
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function getComments() {
    try {
        let [rows] = await pool.query(`SELECT * FROM comment`);
    
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function addLike(user_id, post_id) {
    try {
        let [rows] = await pool.query(`INSERT INTO likes (user_id, post_id) VALUES (?, ?)`, [user_id, post_id]);
        await pool.query(`UPDATE post SET likes = likes + 1 WHERE post_id = ?`, [post_id]);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}

async function getLikeByUserID(user_id, post_id) {
    try {
        const [rows] = await pool.query(`SELECT * FROM likes WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    } 
}


module.exports = {
    getUsers,
    getUser,
    createUser,
    createPost,
    deletePost,
    getPost,
    getPosts,
    createComment,
    deleteComment,
    getPostComments,
    getUsersByCredentials,
    addLike,
    getLikeByUserID,
    getComments
};
const exp = require("constants");
const express = require("express");
const fs = require("fs");
const morgan = require('morgan');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const saltRounds = 14; 
const flash = require('express-flash');

const {getUsers, getUser, createUser, createPost, deletePost, getPost, getPosts, createComment, deleteComment, getPostComments, getUsersByCredentials, addLike, getLikeByUserID, getComments} = require('./database.js');


app = express();

currentUser = null;

app.set("view engine", "ejs");

app.set("views", "./templates");
app.use(flash());

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(
    session({
      secret: 'keysdfvat',
      saveUninitialized: false,
      resave: false,
    })
  );
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.listen(5050);

const isAuthenticated = (req, res, next) => {
    console.log(req.session.user);
    if (req.session.user != undefined) {
        // User is authenticated, continue to the next middleware
        return next();
    } else {
        // User is not authenticated, redirect to login page or handle as needed
        res.redirect("/signup"); // You need to create a login route
    }
};


app.get("/", isAuthenticated, async (req, res) => {
   
    try {
        const posts = await getPosts(); // Wait for the promise to resolve
        const users = await getUsers(); // If needed, wait for user data as well
        const comments = await getComments();
        const user = req.session.user;
        res.setHeader("Content-Type", "text/html");
        res.render("index", {
            posts: posts,
            user: user,
            users: users,
            comments: comments
        });
    } catch (error) {
        console.error(error);
        // Handle the error here, e.g., send an error response
        res.status(500).send("Internal Server Error");
    }
});

app.get("/post", isAuthenticated, (req, res) => {
    res.setHeader("Content-Type", "text/html");
    console.log(req.session.user);
    id = req.session.user[0].user_id;
    console.log(id);
    res.render('post', {id: id, user: req.session.user});
})

app.post("/comment", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    const { post_id, comment } = req.body;
    console.log(comment);
    console.log(post_id);
    createComment(comment, post_id, req.session.user[0].user_id);
    res.json({ success: true, user: req.session.user[0].name});

})

app.get("/signup", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.render('signup', {user: req.session.user});
})

app.get("/login", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.render('login', {user: req.session.user});
})

app.post("/signup-auth", async (req, res) => {
    try {
        let form = req.body;
        let userName = form.name;
        let userPassword = form.password;
        let prevUser = await getUsersByCredentials(userName);
        if (prevUser.length === 0){
            let user = await createUser(userName, userPassword);
            
            // Log the user object to check if it contains the user_id
            console.log("User created:", user);
            
            req.session.user = user;
            console.log("Session user:", req.session.user);
            res.redirect("/");
        }else {
            req.flash("warning", "Username Already Exists!")
            res.redirect("/login");

        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/login-auth", async (req, res) => {
    try {
        let form = req.body;
        let userName = form.name;
        let userPassword = form.password;
        let user = await getUsersByCredentials(userName);
        console.log(user);
        if (user.length == 0){
            res.redirect("/signup");
        } else{
            // Log the user object to check if it contains the user_id
            console.log(userPassword);
            console.log(user[0])
            const passwordMatch = await bcrypt.compare(userPassword, user[0].password);
            
            if (passwordMatch){
                req.session.user = user;
                console.log("Logged in user:", req.session.user);
                res.redirect("/");

                
            } else {
                req.flash("warning", "Incorrect Credentials!")
                res.redirect("/login");
            }
            
        }

    } catch (error) {
        console.error(error);
        res.redirect('/signup');
    }
});


app.post("/post-auth", isAuthenticated, async (req, res) => {
    try {

        let form = req.body;
        let user_id = Number(form.user_id)// Ensure user is available in the sessions

        console.log("User ID: ", user_id);
        let title = form.title;
        let body = form.body;
        createPost(title, body, user_id);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.get("/like/:post_id", async (req, res) => {
    // Set the Content-Type header to indicate JSON response
    res.setHeader("Content-Type", "application/json"); // Updated Content-Type
    
    let user = req.session.user[0];
    console.log(user.user_id);
    let post_id = req.params.post_id; // Access the post_id from the route parameter
    let previousLikes = await getLikeByUserID(user.user_id, post_id);
    console.log(previousLikes);
    if (previousLikes.length === 0){
        addLike(user.user_id, post_id);
        res.json({ success: true, like: 1 });
    } else {
        res.json({ success: true, like: 0 });
    }
});


app.get("/logout", isAuthenticated, (req, res) => {
    res.setHeader("Content-Type", "text/html");
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/signup');
    });
})



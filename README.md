# Social Media Web App

Welcome to the GitHub repository for my Social Media Web App. This Node.js project includes features for user authentication, posting, commenting, and liking posts. The web app uses a MySQL database for data storage.

You can access the web app [here](https://shepherd-lucky-notably.ngrok-free.app/).

## Project Overview

This web app provides the following functionality:

- User registration and login
- Posting and deleting posts
- Commenting on posts
- Liking posts
- User logout

**Code Overview**

Here's a brief overview of the main components of the Node.js application:

- `app.js`: The main application file that sets up the Express.js server and handles routing.

- `database.js`: Manages the MySQL database interactions, including user authentication, post management, comments, and likes.

- `views/`: Contains EJS templates for rendering the web pages.

- `static/`: Stores static assets such as stylesheets and client-side JavaScript files.

**Authentication**

User authentication is handled through sessions. If a user is not authenticated, they are redirected to the login or signup page.

**Routes**

- `/`: The home page displays a list of posts, along with the ability to create new posts and view comments.

- `/post`: This page allows users to create new posts.

- `/comment`: Handles the creation of comments on posts.

- `/signup` and `/login`: Routes for user registration and login.

- `/logout`: Logs the user out and destroys the session.

USE socialmedia;

CREATE TABLE users (
    user_id integer PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(256) NOT NULL,
    password VARCHAR(1000) NOT NULL
);

CREATE TABLE post (
    post_id integer PRIMARY KEY AUTO_INCREMENT,
    likes integer DEFAULT 0,
    title VARCHAR(250) NOT NULL,
    body VARCHAR(700) NOT NULL,
    user_id integer,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE likes (
    like_id integer PRIMARY KEY AUTO_INCREMENT,
    user_id integer,
    post_id integer,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);

CREATE TABLE comment (
    comment_id integer PRIMARY KEY AUTO_INCREMENT,
    comment_body VARCHAR(250) NOT NULL,
    user_id integer,
    post_id integer,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);

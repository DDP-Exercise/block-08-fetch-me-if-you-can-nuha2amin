"use strict";

import User from "./user.js";
import Post from "./post.js";

let users = [];

loadData();

async function loadData() {

    let responseUsers =
        await fetch("https://jsonplaceholder.typicode.com/users");

    let dataUsers =
        await responseUsers.json();

    for (let user of dataUsers) {

        let newUser = new User(
            user.id,
            user.name,
            user.username,
            user.email,
            user.website
        );

        users.push(newUser);
    }

    let responsePosts =
        await fetch("https://jsonplaceholder.typicode.com/posts");

    let dataPosts =
        await responsePosts.json();

    for (let post of dataPosts) {

        let newPost = new Post(
            post.id,
            post.title,
            post.body
        );

        for (let user of users) {

            if (user.id === post.userId) {
                user.posts.push(newPost);
            }
        }
    }

    printUsers();
}

function printUsers() {

    let container =
        document.querySelector("#users");

    for (let user of users) {

        let userDiv =
            document.createElement("div");

        userDiv.className = "user";

        userDiv.innerHTML =
            "<h2>" + user.name + "</h2>" +
            "<p>" + user.username + "</p>" +
            "<a href='mailto:" + user.email + "'>" +
            user.email +
            "</a><br>" +
            "<a href='https://" + user.website + "' target='_blank'>" +
            user.website +
            "</a>" +
            "<div class='posts'></div>";

        userDiv.userObject = user;

        container.append(userDiv);
    }
}

document.addEventListener("click", async function (event) {

    let userDiv =
        event.target.closest(".user");

    if (userDiv) {

        let postsContainer =
            userDiv.querySelector(".posts");

        if (postsContainer.innerHTML === "") {

            let user =
                userDiv.userObject;

            for (let post of user.posts) {

                let postDiv =
                    document.createElement("div");

                postDiv.className = "post";

                postDiv.postObject = post;

                postDiv.innerHTML =
                    "<h4>" + post.title + "</h4>" +
                    "<p>" + post.body + "</p>" +
                    "<button>Load Comments</button>" +
                    "<div class='comments'></div>";

                postsContainer.append(postDiv);
            }
        }
    }

    if (event.target.tagName === "BUTTON") {

        let postDiv =
            event.target.parentElement;

        let commentsDiv =
            postDiv.querySelector(".comments");

        if (commentsDiv.innerHTML !== "") {
            return;
        }

        let post =
            postDiv.postObject;

        let response =
            await fetch(
                "https://jsonplaceholder.typicode.com/comments?postId=" +
                post.id
            );

        let comments =
            await response.json();

        for (let comment of comments) {

            let p =
                document.createElement("p");

            p.textContent =
                comment.body;

            commentsDiv.append(p);
        }
    }
});
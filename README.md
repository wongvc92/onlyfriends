# Social media platform
Simple social media platform features include profile, post, friend, messaging.

## Tech stack
Client - React.js

server - nodejs, expressjs

database - postgreSql

ci/cd - github action, docker, docker-compose, aws ec2

## Feature

JWT authentication
- access token and refresh token is set in the response header and user browser application's cookies
- using axios to intercept expires access token, and renew it using refresh token

push notification
- send user a new notification for liking post
- tanstack setquery data to update existing cached data to avoid new data network request

profile
- add and edit profile
- tanstack setquery data to update existing cached data to avoid new data network request

post
- create, edit, delete post
- tanstack setquery data to update existing cached data to avoid new data network request
- tag friends

comment
- create, edit, delete comment
- tanstack setquery data to update existing cached data to avoid new data network request
- tag friends

friend
- add, find, and remove friends
- tanstack setquery data to update existing cached data to avoid new data network request
- search friends

messaging
- real time messaging via socket.io
- tanstack setquery data to update existing cached data to avoid new data network request

Future update
- push notification for user leave a comment and send message
- reply comment to a comment

## Getting Started

Client 
run the client development server:

from root folder
cd client
npm run dev

Open http://localhost:3000 with your browser to see the result.

server
run the server development server:

from root folder
cd server
npm run dev
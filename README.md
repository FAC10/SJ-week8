# PAJeS y PAJeS of Blog Posts :wink:

We're aiming to create a simple blog application that allows users to log in, write their own posts and view others' posts. As a stretch goal, we would like new users to be able to register new accounts.

## User Stories

### Week 1

- [ ] I would like to to able to write a blog post and post it under my username
- [ ] I would like to be able to see a list of my blog posts
- [ ] I would like the platform to be simple and easy to use
- [ ] I would like to be able to view other people's posts
- [ ] I would like to be able to view other posts written by a certain user

### Week 2

As a member of Founders and Coders, who wants to learn from my fellow devs

- I want to log in with my Github account
So that I can use my Github organisation's info to see posts from my fellow students.

Acceptance criteria:

 - [ ] I can click on a button, which allows me to log in via my Github account
 - [ ] The look of the button should make it obvious that it is this form of login
 - [ ] Once I'm logged in, I should see a list of blog posts
 - [ ] I shouldn't be left with a blank loading screen for too long during the authorisation process, otherwise I will lose confidence in your website and leave.

As any user who is logged in

- I want to see my username & Github profile picture on the homepage, so that I benefit from logging in with Github OAuth, and don't have to do any profile setup on your site.

Acceptance criteria:

- [ ] I can see my username & profile picture on each page that I visit

## Architecture and Schema

![img_2415](https://cloud.githubusercontent.com/assets/20152018/24704549/0e1c4754-1a00-11e7-9d1f-b42a71589942.JPG)

![image](https://cloud.githubusercontent.com/assets/20152018/24704641/728a2602-1a00-11e7-91f3-7f47a844a46d.png)

## Installation instructions

- Clone this repo
- Run `npm install`
- Add config.env and config-test.env files (ask us for the passwords!)
- Run `npm run dev` to run server locally
- To test - `npm run test`
- To test database - `npm run test-database`
- For coverage - `npm run coverage`

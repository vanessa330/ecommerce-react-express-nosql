# Shopping Cart

> This is a FAKE shopping cart built on the MERN stack and Deploy through [Cloudflare](https://www.cloudflare.com/) and [Render](https://dashboard.render.com/). You can register and log in, create your own products, and sell them too the other users.

<br />

> Deploy to Production : [NA](NA)

<br />

## Frontend - Client Side

1. 

<br />

## Backend - Server Side

1. Backend installation
   - `npm i -g nodemon`
   - `npm init -y`
   - `npm i express mongoose bcrypt jsonwebtoken dotenv cors helmet morgan multer`
2. Configuration on index.js
   - File storage
   - Routes settings
   - Connect to the database
3. User & Product models
4. Routes
   - auth controllers
      - Authentication: Register
      - Authorization: Login
      - verifyToken middleware
   - user controllers
      - getUser
      - getUserFollowers
      - getUserFollowing
      - addRemoveFollowing
   - prodcut controllers
      - createProdcut
      - getAllProducts
      - getUserProducts
      - patchProduct
      - likeProdcut
      - addComment
      - deleteProduct


<br />

## Pending to do...
- 
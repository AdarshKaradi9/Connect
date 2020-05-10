"DevConnector" 
mongodb atlas:
    username: adarshkaradi009@gmail.com
    password: adarsh91299
    database:
        username: adarsh123
        password: adarsh123

1. Create a repo with name of the application
2. Create .gitignore and add node_modules/ 
3. npm init and fill in the application details
4. npm install <package1> <package2>
5. npm install -D nodemon concurrently
   In package.json replace test with 
   start: node server
   server: nodemon server 
6. create server.js
7. create a config folder and db.js(connecting to db) and default.js(containing connection string)
8. call connectDB from server.js
9. create routes/api folder and the individual routesjs files


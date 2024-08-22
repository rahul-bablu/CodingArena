# CodingArena
The Coding Arena is a bespoke coding platform developed exclusively for my collage's coding club, tailored to meet the diverse needs of its members. This platform empowers the club to host a wide spectrum of coding challenges

This project is under active development more details will be added soon..
## Requirements
 - node
 - docker
 - judge0 or higher (tested on v1.13.1)
 - any database (tested on mysql)

## To run
- install all the requirements using
  ```npm install```
  in both frontend and backend
- download judge0 ( tested on [judge0-v1.13.1](https://github.com/judge0/judge0/releases/tag/v1.13.1))
- boot up the judge0 instance
- create ```.env``` file in arena_backend set appreciate variables
  
  ```
  DB_NAME=<Database Name default 'coding_club'>
  DB_USER=<Database username default 'root'>
  DB_PASS=<Database password default 'root'>
  DB_HOST=<Database hostname default 'localhost'>
  DB=<Database default 'mysql'>
  Judge0URL=<Judge0 url>
  ```
- now run both server and client by running
``` npm run dev ``` in arena_frontend and arena_backend
- Optimistically, you can find the site at http://localhost:5173/ 
  

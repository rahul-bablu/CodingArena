import cors from 'cors';
import dotenv from "dotenv";
import express, { Express } from "express";
import path from 'path';

import bodyParser from "body-parser";
import { authorize } from "./_middleware/authorize";
import { errorHandler } from "./_middleware/error-handler";
import contestRouter from "./db/controller/contest.controller";
import problemRouter from "./db/controller/problem.controller";
import roomRouter from "./db/controller/room.controller";
import userRouter from "./db/controller/user.controller";

dotenv.config();


const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors({credentials: true}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/users', userRouter)

// app.use(authorize());
app.use(express.static(path.join(__dirname, '/../data')))

app.use('/problem', authorize(), problemRouter)
app.use('/contest', authorize(), contestRouter)
app.use('/room', authorize(), roomRouter)

app.use(errorHandler);


function print (path:any, layer:any) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing:any) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []))

app.listen(port, async () => {
  try {
    console.log('Initiating Database sync...')
    // await sequelize.sync({});
    console.log('Database initiation completed successfully')
    console.log(`[server]: Server is running at http://localhost:${port}`);
  } catch (e) {
    console.log("Failed to initiate Database with error ", e)
    process.exit(1);
  }
});


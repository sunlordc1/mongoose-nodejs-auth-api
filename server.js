
import dotenv from 'dotenv'
dotenv.config()
import  express from "express";
import  { createServer } from "http";
import  { Server } from "@colyseus/core" ;

import { WebSocketTransport } from  "@colyseus/ws-transport"
import mongoose  from 'mongoose'
import  cors from 'cors'
const app = express();
const server = createServer(app); // create the http server manually
import monitor from "@colyseus/monitor";
//For JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
//Router
// import authRouter from './routes/auth';
import  { MyRoom } from './Rooms/Room.js';
//Connect DB
const connectDB = async()=>{
  try{
      await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@gar-gameserver.jcgqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
          useNewUrlParser:true,
          useUnifiedTopology:true,
      }) 
      console.log("Database is running")
  }catch(error){
      console.log(error.message)
      process.exit(1) 
      
  }
}
connectDB ();

app.use('/',monitor.monitor())
const gameServer = new Server({
  transport: new WebSocketTransport({
      server, // provide the custom server for `WebSocketTransport`,
      verifyClient:(info,next)=>{
        console.log(info.req.headers)
        next(true)
      } // provide the custom server for `WebSocketTransport`
  })
});
gameServer.define("my_room", MyRoom, {
  maxClients: 4,
  allowReconnectionTime: 120
})

gameServer.listen(2567)
console.log('Server is running')
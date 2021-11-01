import colyseus  from 'colyseus';
// import { MyState } from "./States/MyRoomState.js";

  
export class MyRoom extends colyseus.Room {
    // When room is initialized
    onCreate (options) {
        // this.setState(new MyState());
        // console.log(options)
        // console.log(this.state)
        this.onMessage("*", (client, message) => {
            client.send(client.sessionId, message);
        });
     }

    // Authorize client based on provided options before WebSocket handshake is complete
    // onAuth (client, options, request) { }

    // When client successfully join the room
    onJoin (client, options, auth) { 
        // console.log(client)
        // console.log(this.state)
    }

    // When a client leaves the room
     async onLeave (client, consented) { 

        try {
          if (consented) {
              throw new Error("consented leave");
          }
      
          // allow disconnected client to reconnect into this room until 20 seconds
          await this.allowReconnection(client, 30);
      

      
        } catch (e) {
      
 
        }

    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}


const connection = {
  wsc: null,
  init: (url) => {
    connection.wsc = new ReconnectingWebSocket(url);
    connection.wsc.onopen = (evt) => {
      console.log(evt);
      console.log("WS conectado");
      //FRONT DEVE FAZER
    };
    connection.wsc.onclose = (evt) => {
      console.log(evt);
      console.log("WS desconectado");
      //FRONT DEVE FAZER
    };
    connection.wsc.onmessage = (evt) => {
      let msg = JSON.parse(evt.data);
      let action = {
        "join": (msg) => {
          console.log("Recebeu um join");
          console.log(msg);
          //FRONT DEVE FAZER
        },
        "create": (msg) => {
          console.log("Recebeu um create");
          console.log(msg);
          //FRONT DEVE FAZER
        },
        "closeRoom": (msg) => {
          console.log("Recebeu um close");
          console.log(msg);
          //FRONT DEVE FAZER
        },
        "list": (msg) => {
          console.log("Recebeu um list");
          console.log(msg);
          //FRONT DEVE FAZER
        }
      };
      action[msg.info](msg);
    }
  },
  create: (nick) => {
    connection.wsc.send(JSON.stringify({info: "create", nick: nick}));
  },
  join: (nick, id) => {
    connection.wsc.send(JSON.stringify({info: "join", nick: nick, id: id}));
  },
  closeRoom: (nick, id) => {
    connection.wsc.send(JSON.stringify({info: "closeRoom", id: id}));
  }
}

connection.init('ws://localhost:10000');
const connection = {
  wsc: null,
  init: (url) => {
    connection.wsc = new ReconnectingWebSocket(url);
    connection.wsc.onopen = (evt) => {
      console.log(evt);
      console.log("WS conectado");
    };
    connection.wsc.onclose = (evt) => {
      console.log(evt);
      console.log("WS desconectado");
    };
    connection.wsc.onmessage = (evt) => {
      let msg = JSON.parse(evt.data);
      let action = {
        "join": (msg) => {
          console.log("Recebeu um join");
          console.log(msg);
          if (!msg.error) if (msg.data.qty == "full") window.location.replace(`/game/${msg.data.id}`);
        },
        "create": (msg) => {
          console.log("Recebeu um create");
          console.log(msg);
          if(msg.error) document.getElementById("nick").disabled = false;
        },
        "closeRoom": (msg) => {
          console.log("Recebeu um close");
          console.log(msg);
          if(!msg.error) document.getElementById("nick").disabled = false;
        },
        "list": (msg) => {
          console.log("Recebeu um list");
          console.log(msg);
          lobby.refreshList(msg.data);
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
    connection.wsc.send(JSON.stringify({info: "closeRoom", nick: nick, id: id}));
  }
}

connection.init('ws://localhost:10000');
const connectionGame = {
  wsc: null,
  init: (url) => {
    connectionGame.wsc = new ReconnectingWebSocket(url);
    connectionGame.wsc.onopen = (evt) => {
      console.log(evt);
      console.log("WS conectado");
    };
    connectionGame.wsc.onclose = (evt) => {
      console.log(evt);
      console.log("WS desconectado");
    };
    connectionGame.wsc.onmessage = (evt) => {
      let msg = JSON.parse(evt.data);
      let action = {

      };
      console.log(msg);
      //action[msg.info](msg);
    }
  },

}

connectionGame.init(`ws://localhost:10000${window.location.pathname}`);
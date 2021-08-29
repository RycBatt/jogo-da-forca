/**
 * SERVIDOR HANGMAN
 */

/**
 * Requires para ambos servidores
 */
const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const Word = require(path.join(__dirname, 'app', 'model', 'word'));

/**
 * Variáveis para ambos servidores
 */
let portMain = 10000;
let portAdmin = 4000;
let dataBankAddress = "mongodb://localhost:27017/JogoDaForca";

/**
 * Configurações para ambos servidores
 */
mongoose.connect(dataBankAddress, {useNewUrlParser: true, useUnifiedTopology: true});

/** --------------------------
 *  --- SERVIDOR PRINCIPAL ---
 *  --------------------------
 */

/**
 * Requires para porta principal
 */
const app = express();
const expressWs = require('express-ws')(app);
const randomString = require(path.join(__dirname, 'core', 'randomString'));

/**
 * Variáveis para servidor principal
 */
let roomLengthId = 5;
let qtyPlayers = 2;
let wssConnectionsMain = [];
let wssConnectionsGame = [];
let roomsWaiting = [];
let roomsPlaying = [];

/**
 * Configurações servidor principal
 */
app.use(express.static("public"));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'app', 'view'));

/**
 * Função para mandar uma mensagem para uma lista de clientes conectados
 */
function broadcast (msg, list){
  list.forEach((el)=>{
    try {el.send(msg);}
		catch (e) {console.log(e);}
  });
}

/**
 * Função para mandar a lista de salas abertas para os clientes conectados no salão principal
 */
function broadcastRoomList (){
  wssConnectionsMain.forEach((wsc)=>{sendCustomListRoom(wsc);});
}

/**
 * Função para criar uma mensagem customizada para cada usuário conectado ao salão principal
 * Basicamente, além de mostrar todas as sala, também informa pro cliente qual sala ele está conectado
 */
function sendCustomListRoom(wsc){
  try {
    let msg = roomsWaiting.map((el)=>{
      return {
        id: el.id,
        nicks: el.nicks,
        ureOnIt: el.players.some((curr)=>{return (curr == wsc);})
      };
    });
    wsc.send(JSON.stringify({info: "list", data: msg}));
  }
  catch (e) {console.log(e);}
}

/**
 * Lista de respostas possíveis para WS no servidor principal
 */
let actionWsIncommingMain = {
  "create": (wsc, nick) => {
    if (!nick) return wsc.send(JSON.stringify({info: "create", error: 1})); //Tentou criar sem nome
    if (roomsWaiting.some((el)=>{return el.players.some((pl)=>{return (wsc == pl);})})) return wsc.send(JSON.stringify({info: "create", error: 2})); //Se já estiver em uma sala
    let newId;
    let isNotNew = true;
    while (isNotNew) {
      newId = randomString(roomLengthId);
      isNotNew = roomsWaiting.some((el)=>{
        return (el == newId);
      });
    }
    let newRoom = {
      id: newId,
      players: [wsc],
      nicks: [nick]
    }
    roomsWaiting.push(newRoom);
    wsc.send(JSON.stringify({info: "create", data: {id: newRoom, nicks: roomsWaiting[roomsWaiting.length - 1].nicks}}));
    broadcastRoomList();
  },
  "join": (wsc, nick, id) => {
    if (!nick) return wsc.send(JSON.stringify({info: "join", error: 1})); //Tentou criar sem nome
    let indexId = -1;
    roomsWaiting.some((el, index)=>{
      if (el.id == id){
        indexId = index;
        return true;
      }
    });
    if (indexId == -1) return wsc.send(JSON.stringify({info: "join", error: 2})); //Não existe sala
    if (roomsWaiting[indexId].players.some((el)=>{return (el == wsc);})) return wsc.send(JSON.stringify({info: "join", error: 3})); //Tentando entrar na sua mesma sala
    let idAlready;
    if (roomsWaiting.some((el)=>{return el.players.some((pl)=>{ //Se já estiver em uma sala
      idAlready = el.id;
      return (wsc == pl);
    })})){actionWsIncommingMain["closeRoom"](wsc, idAlready);} //Fecha a sala anterior
    roomsWaiting[indexId].players.push(wsc);
    roomsWaiting[indexId].nicks.push(nick);
    roomsWaiting[indexId].players.forEach((player)=>{
      player.send(JSON.stringify({
        info: "join", data: {
          id: id,
          nicks: roomsWaiting[indexId].nicks,
          qty: roomsWaiting[indexId].players.length == qtyPlayers ? "full" : roomsWaiting[indexId].players.length
        }
      }));
    });
    broadcastRoomList();
  },
  "closeRoom": (wsc, id) => {
    let indexId = -1;
    roomsWaiting.some((el, index)=>{
      if (el.id == id){
        indexId = index;
        return true;
      }
    });
    if (indexId == -1) return wsc.send(JSON.stringify({info: "closeRoom", error: 1})); //Não existe sala
    if (!roomsWaiting[indexId].players.some((el)=>{return (el == wsc);})) return wsc.send(JSON.stringify({info: "closeRoom", error: 2})); //Tentando fechar sala dos outros
    roomsWaiting[indexId].players.forEach((player)=>{
      player.send(JSON.stringify({info: "closeRoom", data: id}));
    });
    roomsWaiting.splice(indexId, 1);
    broadcastRoomList();
  }
};

/**
 *  --- Rotas ---
 */

/**
 * Conexão genérica do WS
 */
expressWs.getWss().on('connection', function(wsc, req) {
  if (req.url == "/.websocket"){
    wssConnectionsMain.push(wsc);
    sendCustomListRoom(wsc);
    console.log(`Abriu conexão WS - Sala principal. Qtd total: ${wssConnectionsMain.length}`);
  } else console.log(req.url);
});

/**
 * Tela inicial
 */
app.get('/', function(req, res){
  res.render("index");
});

/**
 * WS da tela inicial
 */
app.ws('/', function(wsc, req) {
  wsc.on('message', function incoming(data) {
    try {
      data = JSON.parse(data);
      actionWsIncommingMain[data.info](wsc, nick = (data.nick ? data.nick : undefined), id = (data.id ? data.id : undefined));
    } catch(e){
      console.log(e);
    }
  });  
  wsc.on('close', function incoming(message) {
    if (roomsWaiting.some((el)=>{return el.players.some((pl)=>{ //Se estiver em uma sala
      idAlready = el.id;
      return (wsc == pl);
    })})){actionWsIncommingMain["closeRoom"](wsc, idAlready);} //Fecha a sala
    wssConnectionsMain.some((el, id, arr)=>{
      if (el == wsc){
        arr.splice(id, 1);
        return true;
      }
    });
    console.log(`Fechou conexão. Qtd total: ${wssConnectionsMain.length}`);
  });
});

/**
 * WS do jogo
 */
app.ws('/:id', function(wsc, req) {
  wsc.on('message', function incoming(data) {
    console.log(data);
    wsc.send("message");
  });  
  wsc.on('close', function incoming(message) {
    console.log("fechou aqui, ó");
    wsc.send("close");
  });
});

/**
 * Iniciar servidor principal
 */
app.listen(portMain, ()=>{
  console.log(`Escutando em ${portMain} - Pressione ctrl + C para desligar servidor.`);
});

/** --------------------------
 *  --- SERVIDOR ADMIN ---
 *  --------------------------
 */

/**
 * Requires para porta admin
 */
const appAdmin = express();

/**
 * Configurações servidor principal
 */
appAdmin.use(express.static("public"));
appAdmin.use(express.urlencoded({extended: true})); 
appAdmin.use(express.json());
appAdmin.set('view engine','ejs');
appAdmin.set('views', path.join(__dirname, 'app', 'view', 'admin'));

/**
 *  --- Rotas ---
 */

/**
 * Tela inicial
 */
appAdmin.get("/", (req, res) => {
  res.redirect("/add");
});

/**
 * Tela Add
 */
appAdmin.get("/add", async (req, res) => {
  var wordS = await Word.GetAll(true);
  res.render("add",{wordS});
});

/**
 * Criar palavra nova
 */
appAdmin.post("/create", async (req, res) => {
  var status = await Word.Create(req.body.palavra);
  if(status){
    res.redirect("/add");
  } else {
    res.send("Ocorreu uma falha!");
  }
});

/**
 * Deletar palavra
 */
appAdmin.post("/delete", async (req, res) => {
  var status = await Word.Delete(req.body.palavra);
  if (status){
    res.redirect("/add");
  } else{
    res.send("Ocorreu uma falha!");
  }
});

/**
 * Iniciar servidor admin
 */
appAdmin.listen(portAdmin, ()=>{
  console.log(`Escutando em ${portAdmin} - Pressione ctrl + C para desligar servidor.`);
});
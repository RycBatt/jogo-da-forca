/*jshint esversion: 6 */

const lobby = {
  refreshList: function(list){
    let gList = document.getElementById("GamerList").querySelector("ul");
    gList.innerHTML = "";
    list = list.filter((el)=>{
      return el.nicks.length == 1;
    });
    if (list.length > 0){
      list.sort((a, b)=>{
        if (!a.ureOnIt && b.ureOnIt) return 1;
        else if (a.ureOnIt && !b.ureOnIt) return -1;
        return 0;
      });
      if (!list[0].ureOnIt) document.getElementById("nick").disabled = false;
      document.getElementById("GamerList").classList.remove("invisible");
      list.forEach((currentValue) => {
        let tipoBtn = currentValue.ureOnIt ? "Fechar" : "Jogar";
        let estiloBtn = currentValue.ureOnIt ? "btn-danger" : "btn-dark";
        let fncBtn = currentValue.ureOnIt ? `lobby.closeRoom("${currentValue.id}")` : `lobby.join("${currentValue.id}")`;
        let liNew = document.createElement("li");
        liNew.innerHTML = (
          `<div class="row">
            <div class="col col-9">
              <input type="text" class="form-control" value=${currentValue.nicks[0]} disabled="">
            </div>
            <div class="col col-3">
              <button onclick=${fncBtn} class="btn ${estiloBtn} btn-lg botao_lista">${tipoBtn}</button>
            </div>
          </div>`
        );
        gList.appendChild(liNew);
      });
    } else {
      document.getElementById("GamerList").classList.add("invisible");
    }
  },
  create(){
    let nick = document.getElementById('nick').value;
    if(nick == ""){
      var nick_box = document.getElementById('nick');
      nick_box.style.borderColor = 'red';
      nick_box.style.boxShadow = '0px 0px 10px red';
      nick_box.addEventListener("blur", (event)=>{
        event.target.style.borderColor = "";
        nick_box.style.boxShadow = '';
      }, false);
      nick_box.addEventListener("input", (event)=>{
        event.target.style.borderColor = "blue";
        nick_box.style.boxShadow = '0px 0px 10px blue';
      }, false); 
    } else {
      connection.create(nick);
      document.getElementById("nick").disabled = true;
    }
  },
  closeRoom(id){
    connection.closeRoom(id);
  },
  join(id){
    let nick = document.getElementById('nick').value;
    if(nick == ""){
      var nick_box = document.getElementById('nick');
      nick_box.style.borderColor = 'red';
      nick_box.style.boxShadow = '0px 0px 10px red';
      nick_box.addEventListener("blur", (event)=>{
        event.target.style.borderColor = "";
        nick_box.style.boxShadow = '';
      }, false);
      nick_box.addEventListener("input", (event)=>{
        event.target.style.borderColor = "blue";
        nick_box.style.boxShadow = '0px 0px 10px blue';
      }, false); 
    } else {
      connection.join(nick, id);
      document.getElementById("nick").disabled = true;
    }
  }
};

window.onload = ()=>{
  document.getElementById('nick').addEventListener("keyup", event => {
    if(event.key !== "Enter") return;
    document.getElementById('CreateRoom').click();
    event.preventDefault();
  });
};
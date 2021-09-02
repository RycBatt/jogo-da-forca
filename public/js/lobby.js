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
        return 0
      });
      document.getElementById("GamerList").classList.remove("invisible");
      list.forEach((currentValue) => {
        tipoBtn = currentValue.ureOnIt ? "Fechar" : "Jogar";
        estiloBtn = currentValue.ureOnIt ? "btn-danger" : "btn-dark";
        fncBtn = currentValue.ureOnIt ? `lobby.closeRoom("${currentValue.id}")` : `lobby.join("${currentValue.id}")`;
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
    //Se faltar apelido, borda vermelha
    connection.create(document.getElementById('nick').value);
    document.getElementById("nick").disabled = true;
  },
  closeRoom(id){
    connection.closeRoom(id);
  },
  join(id){
    //Se faltar apelido, borda vermelha
    connection.join(document.getElementById('nick').value, id);
  }
}



//document.getElementById("CreateRoom").addEventListener("click", ()=>{VOLTAR A BORDA AO NORMAL});
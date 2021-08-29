const lobby = {
  refreshList: function(list){
    let ul = document.createElement("ul");
    ul.className = "list-group"

    //COLOCAR AQUI APENAS AS SALAS POSSÍVEIS DE SEREM USADAS

    list.forEach((element) => {
      let il = document.createElement("il");
      il.className = "list-group-item";
      let label = document.createElement("label");
      //label.textContent - Colocar nome do jogador aqui
      il.appendChild(label);
      let button = document.createElement("button");
      //Diferenciar se é a sala do mesmo cara ou não, usar um if aqui
      il.appendChild(button);
    });
    document.getElementById("lobby_list").appendChild(ul)
  }
}
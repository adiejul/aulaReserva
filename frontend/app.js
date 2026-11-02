function getAulas(url, muestraAulas){
    fetch(url)
  .then(response => response.json())
  .then(data => {
    muestraAulas(data);
    
  });

}

function muestraAulas(aulas){
    document.getElementById("listadoAulas").innerHTML = aulas
    .map(aula =>` <div class="recuadros"> Nombre aula: ${aula.nombre} Capacidad: ${aula.capacidad}</div>`)
    .join("")
}

(function(){
    getAulas('/backend/public/index.php', muestraAulas);
})()
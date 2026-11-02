function getAulas(url, muestraAulas){
    fetch(url)
  .then(response => response.json())
  .then(data => {
    muestraAulas(data);
    
  });

}

function muestraAulas(aulas){
    document.getElementById("listadoAulas").innerHTML = aulas
    .map(aula =>`
      <div class="recuadros"> 
      <h3>${aula.nombre}</h3>
      <p>Capacidad: ${aula.capacidad} personas </p>
      </div>`)
    .join("")
}

(function(){
    getAulas('/backend/public/index.php', muestraAulas);
})()
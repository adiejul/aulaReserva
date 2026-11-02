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

    rellenaSelectAulas(aulas);
}

function rellenaSelectAulas(aulas){
  const select = document.getElementById("aula");

  aulas.forEach(aula => {
    const opcion = document.createElement("option");
    opcion.value = aula.id;
    opcion.textContent = aula.nombre;
    select.appendChild(opcion);  
  });
}

function enviarReserva(evento) {
    evento.preventDefault();

    const aula = document.getElementById("aula").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const responsable = document.getElementById("responsable").value.trim();
    const mensaje = document.getElementById("mensajeFormulario");

    if (aula === "" || fecha === "" || hora === "" || responsable === "") {
        mensaje.textContent = "Todos los campos son obligatorios.";
        return;
    }

    mensaje.textContent = "Reserva solicitada correctamente.";
}

document.getElementById("formReserva").addEventListener("submit", enviarReserva);


(function(){
    getAulas('/backend/public/index.php', muestraAulas);
})()
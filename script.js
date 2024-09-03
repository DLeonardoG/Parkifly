const URL = "https://66d39804184dce1713d08825.mockapi.io/gotpark/vehiculos";
const crearBoton = document.getElementById("crear");
const VerBoton = document.getElementById("ver");
const main = document.getElementById("main");
const contenedorElementos = document.getElementById("contenedor-elementos");
const todosLosBotones = document.querySelectorAll(".boton-categoria")
const tablaBody = document.getElementById("tabla-body"); 
const tabla = document.getElementById("tabla-c");
// const tablaBody = document.getElementById("tabla-body")
// AQUI SE PIDEN LOS DATOS DE MOCKAPI
async function obtenerDatos(url) {
    try {
        const res = await fetch(url);
        if (res.ok) {
            const stars = await res.json();
            return stars;
        } else {
            console.error("Error en la respuesta de la API:", res.status);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}
// Crear vehiculo y rellenar el formulario
async function formGuardar() {
    // Se guarda las informacion en en variables
    const placa = document.getElementById("placa").value;
    const tipo = document.getElementById("tipo").value;
    const hora = document.getElementById("hora").value;
    const nivel = document.getElementById("nivel").value;
    const espacio = document.getElementById("espacio").value;
    const space = nivel + espacio
    if (placa == "" || tipo == "" || hora == "" || nivel ==""|| espacio == ""){
        alert("Todos los campos son obligatorios");
        return;
    }
    const validacion = validarPlaca(placa)
    const validarEntrada = validarHora(hora)
    if (validacion && validarEntrada === false){
        // Se hace la peticion al api para guardar el vehiculo
        let informacion = [];
        let data = [];
        const datos = await obtenerDatos(URL);
        data = datos;
        data.forEach(element => {
        informacion.push(element);
            });
        console.log(informacion);
        const placaM = placa.toUpperCase()
        const vehiculos = informacion.filter(vehi => vehi.estado === true)
        console.log(vehiculos);
        const existeEspacio = vehiculos.some(info => info.espacio === space);
        const existePlaca = vehiculos.some(info => info.placa === placaM );
        if(existeEspacio){
            alert("El espacio "+ space +" ya se encuentra ocupado");
            return;
        } else if (existePlaca){
            alert("La placa "+ placaM +" ya se encuentra registrada");
            return;
        } else {
            try {
                const vehiculo = {
                    placa: placaM,
                    tipo: tipo,
                    hora: hora,
                    espacio: space,
                    estado: true
                }
                console.log(vehiculo)
                let response = await fetch(URL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(vehiculo)
                });
                if (response.ok) {
                    alert("Vehiculo registrado con exito");
                    limpiarForm();
                } else {
                    alert("Error al registrar el vehiculo");
                }
            }catch (error){
                console.log("error",error)
            }
        }
    } else {
        if (validacion === false){
            alert("La placa debe tener 3 letras y 3 numeros, como /ABC123/");
            return;
        } else if (validarEntrada===true){
            alert("La fecha tiene que ser menor al dia de hoy");
            return;
        }
    }
}
async function guardarForm(){
    if (document.querySelector("#form-registro")){
        let formRegistro = document.getElementById("form-registro");
        formRegistro.onsubmit = function(e){
            e.preventDefault();
            formGuardar();

        }
}}
function crearForm(){
    main.className = "";
    contenedorElementos.className = "";
    tabla.classList.add("oculto");

    main.classList.add("formulario");
    contenedorElementos.classList.add("contenedor-formulario");
    contenedorElementos.innerHTML= "";
    contenedorElementos.innerHTML = `
            <h1 class="title">Registro de vehiculos</h1>
            <form id="form-registro">
                <div class="form-group">
                    <span>Placa</span>
                    <input type="text" id="placa" placeholder="Ej. ABC123" required>
                </div>
                <div class="form-group">
                    <span>Tipo</span>
                    <select id="tipo" name="tipo" required>
                        <option value="Carro">Carro</option>
                        <option value="Moto">Moto</option>
                        <option value="Bus">Bus</option>
                        <option value="Camioneta">Camioneta</option>
                        <option value="Camion">Camion</option>
                    </select>
                </div>
                <div class="form-group">
                    <span>Hora de entrada</span>
                    <input type="datetime-local"  min="2024-09-01T00:00" id="hora" name="hora" required>
                </div>
                <div class="form-group">
                    <span>Sotano</span>
                    <select id="nivel" name="nivel" required>
                        <option value="A">Sotano A</option>
                        <option value="B">Sotano B</option>
                        <option value="C">Sotano C</option>
                        <option value="D">Sotano D</option>
                    </select>
                </div>  
                <div class="form-group">
                    <span>Espacio</span>
                    <select id="espacio" name="espacio" required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div class="button">
                    <input type="submit" value="Registrar vehiculo">
                </div>
            </form>
            `;
    guardarForm();
}
function limpiarForm() {
    document.getElementById("placa").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("hora").value = "";
    document.getElementById("nivel").value = "";
    document.getElementById("espacio").value = "";
}
function validarPlaca(cadena) {
    const regex = /^[A-Za-z]{3}\d{3}$/;
    return regex.test(cadena);
}
function validarHora(fecha){
    const fechaSeleccionada = new Date(fecha);
    const ahora = new Date();
    return fechaSeleccionada > ahora;
}    
function validarHoraSalida(fecha){
    const fechaSeleccionada = new Date(fecha);
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() + 2);
    return fechaSeleccionada < ahora;
}
function formatearFechaCorta(fechaP) {
    const fecha = new Date(fechaP);
    const dia = fecha.getDate();
    const opcionesMes = { month: 'short' };
    const mes = new Intl.DateTimeFormat('es-ES', opcionesMes).format(fecha);
    const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };
    const hora = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);
    return `${dia} ${mes}, ${hora}`;
}

// Hasta aqui viene la funcionalidad de crear formulario
// *******************************************************
async function mostrarDatos(){
    main.className = "";
    contenedorElementos.className = "";
    contenedorElementos.classList.add("oculto");
    tabla.classList.remove("oculto");
    main.classList.add("main-tabla");
    contenedorElementos.innerHTML = "";
    const vehiculos = await obtenerDatos(URL)
    const vehiculo = vehiculos.filter(vehi => vehi.estado === true)
    console.log(vehiculo)
    tablaBody.innerHTML="";
    let cont = 1;
    vehiculo.forEach(element => {
        const fechaEntrada = formatearFechaCorta(element.hora)
        const row = document.createElement("tr");
        row.innerHTML = "";
        row.innerHTML = `
            <td>${cont}</td>
            <td>${element.placa}</td>
            <td>${element.tipo}</td>
            <td>${fechaEntrada}</td>
            <td>Activo</td>
            <td>${element.espacio}</td>
            <td class="count"><button id="${element.espacio}" class="boton boton-editar"><i class="bi bi-pencil-square"></i>Editar</button></td>
        `;
        tablaBody.appendChild(row);
        cont += 1;
    });
    console.log(vehiculo)
    botonesEditarEvento(vehiculo)
}
function botonesEditarEvento(vehiculo){
    const botonesEditar = document.querySelectorAll(".boton-editar");
    console.log(botonesEditar);
    botonesEditar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            console.log(e.target.id)
            const esp = e.currentTarget.id
            const valorEditable = vehiculo.filter(vehi => vehi.espacio === esp)
            console.log(valorEditable)
            main.className = "";
        contenedorElementos.className = "";
        tabla.classList.add("oculto");
        main.classList.add("formulario");
        contenedorElementos.classList.add("contenedor-formulario");
        contenedorElementos.innerHTML= "";
        contenedorElementos.innerHTML = `
                <h1 class="title" style="text-align: center;">Registro de salida</h1>
                <h2 class="title" style="text-align: center;">${valorEditable[0].placa} - ${valorEditable[0].tipo}</h2>
                <form id="form-registro">
                    <div class="form-group">
                        <span>Hora de salida</span>
                        <input type="datetime-local" id="horaSalida" name="hora" required>
                    </div>
                    <div class="button">
                        <input type="submit" value="Registrar salida de ${valorEditable[0].placa}">
                    </div>
                </form>
                `;
        todosLosBotones.forEach((boton) => {
            boton.classList.remove("active");
        })
        actualizarForm(valorEditable)
            })
    });
}
async function actualizarForm(valorEditable){
    if (document.querySelector("#form-registro")){
        let formRegistro = document.getElementById("form-registro");
        formRegistro.onsubmit = function(e){
            e.preventDefault();
            formActualizar(valorEditable);
        }
}}
async function formActualizar(valorEditable) {
    // Se guarda las informacion en en variables
    console.log(valorEditable)
    const entrada = new Date(valorEditable[0].hora);
    const salida = new Date(document.getElementById("horaSalida").value);
    const val = document.getElementById("horaSalida").value;
    const validarSalida = validarHoraSalida(val)
    console.log(document.getElementById("horaSalida").value)
    if (salida >= entrada && validarSalida === true) {
        const diferenciaMinutos = calcularDiferenciaEnMinutos(entrada, salida);
        console.log(`La diferencia es de ${diferenciaMinutos} minutos.`);
        if (diferenciaMinutos <= 15) {
            alert("La duracion del vehiculo fue menor a 15 minutos, no tiene cobro.")
        } else {
            const costo = calcularCosto(diferenciaMinutos, valorEditable);
            alert(`El costo de la salida es ${costo} pesos`);
        }; 
        valorEditable[0].salida = salida
        valorEditable[0].estado = false

        const URL_UP = "https://66d39804184dce1713d08825.mockapi.io/gotpark/vehiculos/"+valorEditable[0].id;
        try {
            let response = await fetch(URL_UP, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(valorEditable[0])
            });
        if (response.ok) {
            alert("Salida del vehiculo realizada con exito");
            const ver = document.getElementById("ver")
            ver.classList.add("active")
            mostrarDatos();
            } else {
                alert("Error al registrar la salida");
           }
        } catch (error){
            console.log("Error" + error)
        }
      } else {
        if (salida < entrada){
            alert("La fecha de salida no puede ser anterior a la fecha de inicio.");
            return;
        } else if (validarSalida===false){
            alert("La fecha y hora tienen que ser menores al dia y la fecha actual");
            return;
        }
    } 
}
  function calcularDiferenciaEnMinutos(fechaHora1, fechaHora2) {
    const diferenciaMilisegundos = Math.abs(fechaHora2 - fechaHora1); // Diferencia en milisegundos
    return Math.floor(diferenciaMilisegundos / 60000); // Convertir milisegundos a minutos
  }
  function calcularCosto(diferenciaMinutos, valorEditable) {
    const type = valorEditable[0].tipo
    console.log(type)
    switch (type) {
        case "Carro":
            return 50 * diferenciaMinutos;
        case "Moto":
            return 40 * diferenciaMinutos;
        case "Camioneta":
            return 60 * diferenciaMinutos;
        case "Bus":
            return 90 * diferenciaMinutos;
        case "Camion":
            return 110 * diferenciaMinutos;
        default:
            return 0;
    }
}
// ****************History****************
async function mostrarHistorial(){
    main.className = "";
    contenedorElementos.className = "";
    contenedorElementos.classList.add("oculto");
    tabla.classList.remove("oculto");
    main.classList.add("main-tabla");
    contenedorElementos.innerHTML = "";
    const vehiculos = await obtenerDatos(URL)
    const vehiculo = vehiculos.filter(vehi => vehi.estado === false)
    console.log(vehiculo)
    tablaBody.innerHTML="";
    let cont = 1;
    vehiculo.forEach(element => {
        const fechaEntrada = formatearFechaCorta(element.hora)
        const fechaSalida = formatearFechaCorta(element.salida)
        const row = document.createElement("tr");
        row.innerHTML = "";
        row.innerHTML = `
            <td>${cont}</td>
            <td>${element.placa}</td>
            <td>${element.tipo}</td>
            <td>${fechaEntrada}</td>
            <td>${fechaSalida}</td>
            <td>${element.espacio}</td>
            <td class="count"><button id="${element.placa}" class="boton boton-eliminar"><i class="bi bi-trash-fill"></i>Eliminar</button></td>
        `;
        tablaBody.appendChild(row);
        cont += 1;
    });
    console.log(vehiculo)
    botonesEliminarEvento(vehiculo)
}
function botonesEliminarEvento(vehiculo){
    const botonesEliminar = document.querySelectorAll(".boton-eliminar");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            console.log(e.target.id)
            const esp = e.currentTarget.id
            const valorEliminar = vehiculo.filter(vehi => vehi.placa === esp)
            console.log(valorEliminar)
            eliminarVehiculo(valorEliminar)
        })
    });
}
async function eliminarVehiculo(valorEditable) {
    // Se guarda las informacion en en variables
    console.log(valorEditable)
        const URL_ELI = "https://66d39804184dce1713d08825.mockapi.io/gotpark/vehiculos/"+valorEditable[0].id;
        try {
            let response = await fetch(URL_ELI, {
                method: "DELETE",
            });
        if (response.ok) {
            mostrarHistorial();
            } else {
                alert("Error al registrar la salida");}
        } catch (error){
            console.log("Error" + error)
        }
}
// ****************Inicio generar inicio****************
function mostrarInicio(){
    main.className = "";
    contenedorElementos.className = "";
    contenedorElementos.classList.remove("oculto");
    tabla.classList.add("oculto");
    main.classList.add("main-inicio");
    contenedorElementos.classList.add("contenedor-inicio");
    contenedorElementos.innerHTML = "";
}
// Obtener los datos de la API y mostrarlos en la tabla
// Agregar los eventos a las funciones necesarias
function botonesEventoFuncion(){
todosLosBotones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
    todosLosBotones.forEach((boton) => {
        boton.classList.remove("active");
    })
    e.currentTarget.classList.add("active");
    let per = e.currentTarget.id;
    console.log(per);
    switch (per) {
        case "crear":
            crearForm();
            break;
        case "ver":
            mostrarDatos();
            break;
        case "historial":
            mostrarHistorial();
            break;
        case "inicio":
            mostrarInicio();
            break;
        default:
            console.log("Opcion no valida");
    }})}
)};
botonesEventoFuncion()
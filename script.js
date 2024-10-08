const URL = "https://66d39804184dce1713d08825.mockapi.io/gotpark/vehiculos";
const crearBoton = document.getElementById("crear");
const VerBoton = document.getElementById("ver");
const main = document.getElementById("main");
const contenedorElementos = document.getElementById("contenedor-elementos");
const todosLosBotones = document.querySelectorAll(".boton-categoria")
const tablaBody = document.getElementById("tabla-body"); 
const tabla = document.getElementById("tabla-c");
const mediaQ = document.getElementById("media-query");
const buscadorCaja = document.getElementById("busc");
const textoBuscador = document.getElementById("buscador");
const botonBuscador = document.getElementById("buscar");
const totalidad = document.getElementById("totalidad");

async function obtenerDatos(url) {
    try {
        const res = await fetch(url);
        if (res.ok) {
            const stars = await res.json();
            return stars;
        } else {
            console.error("Error en la respuesta de la API:", res.status);
        }
    } catch (error) { console.error("Error en la solicitud:", error); }
}
async function formGuardar() {
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
        let informacion = [];
        let data = [];
        const datos = await obtenerDatos(URL);
        data = datos;
        data.forEach(element => { informacion.push(element); });
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
                    pago: 0,
                    estado: true
                }
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
            }catch (error){ console.log("error",error)}
        }
    } else {
        if (validacion === false){
            alert("La placa debe tener 3 letras y 3 numeros, como /ABC123/");
            return;
        } else if (validarEntrada===true){
            alert("Lo siento no puedes registrar una entrada del futuro, registra la entrada actual o a inicio de mes...");
            return;
        }}
}
async function guardarForm(){
    if (document.querySelector("#form-registro")){
        let formRegistro = document.getElementById("form-registro");
        formRegistro.onsubmit = function(e){
            e.preventDefault();
            formGuardar();}
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
            </form>`;
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
    ahora.setMinutes(ahora.getMinutes() + 3);
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
function relojDigi(){
    let f = new Date(),
    dia = f.getDate(),
    mes = f.getMonth() + 1,
    anio = f.getFullYear(),
    diaSemana = f.getDay();
    dia = ('0' + dia).slice(-2);
    mes = ('0' + mes).slice(-2)
    const fechaH = document.getElementById("fechaH")
    const tiepoH = document.getElementById("horaH")
    const fechaA = document.getElementById("fechaA")
    const tiepoA = document.getElementById("horaA")
    let timeString = f.toLocaleTimeString();
    tiepoH.innerHTML = timeString;
    tiepoA.innerHTML = timeString;
    let semana = ['DOM','LUN','MAR','MIE','JUE','VIE','SAB'];
    let showSemana = (semana[diaSemana]);
    fechaH.innerHTML = `${anio}-${mes}-${dia} ${showSemana}`
    fechaA.innerHTML = `${anio}-${mes}-${dia} ${showSemana}`
}
setInterval(() => { relojDigi() }, 1000);
const filtrado = async()=>{
    main.className = "";
    contenedorElementos.className = "";
    contenedorElementos.classList.add("oculto");
    tabla.classList.remove("oculto");
    main.classList.add("main-tabla");
    totalidad.classList.add("oculto");
    const vehiculos = await obtenerDatos(URL)
    const vehiculo = vehiculos.filter(vehi => vehi.estado === true)
    console.log(vehiculo)
    tablaBody.innerHTML="";
    let cont = 1;
    const texto = textoBuscador.value.toUpperCase()
    vehiculo.forEach(element=>{
        if(element.placa.indexOf(texto) !== -1){ 
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
            <td>n/a</td>
            <td class="count"><button id="${element.espacio}" class="boton boton-editar"><i class="bi bi-pencil-square"></i>Salida</button></td>`;
        tablaBody.appendChild(row);
        cont += 1;
        }
    })
    if(tablaBody.innerHTML === ""){
        const row = document.createElement("tr");
        row.innerHTML = "";
        row.innerHTML = `
            <td colspan="8">La placa no se encuentra en el parqueadero</td>`;
        tablaBody.appendChild(row);
    }
    textoBuscador.removeEventListener("keyup", filtradoHistorial);
    textoBuscador.addEventListener("keyup", filtrado);
    botonesEditarEvento(vehiculo)
}
const filtradoHistorial = async()=>{
    totalidad.classList.remove("oculto");
    main.className = "";
    contenedorElementos.className = "";
    contenedorElementos.classList.add("oculto");
    tabla.classList.remove("oculto");
    main.classList.add("main-tabla");
    const vehiculos = await obtenerDatos(URL)
    const vehiculo = vehiculos.filter(vehi => vehi.estado === false)
    console.log(vehiculo)
    tablaBody.innerHTML="";
    let cont = 1;
    let tot = 0;
    const texto = textoBuscador.value.toUpperCase()
    vehiculo.forEach(element=>{
        if(element.placa.indexOf(texto) !== -1){ 
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
            <td>${element.pago.toLocaleString('es-CO')}</td>
            <td class="count"><button id="${element.placa}" class="boton boton-eliminar"><i class="bi bi-trash-fill"></i>Eliminar</button></td>`;
        tablaBody.appendChild(row);
        cont += 1;
        tot += element.pago;
        totalidad.innerHTML=`Total: ${tot.toLocaleString('es-CO')}`;
        }
    })
    if(tablaBody.innerHTML === ""){
        const row = document.createElement("tr");
        row.innerHTML = "";
        row.innerHTML = `
            <td colspan="8">Lo sentimos la placa no esta registrada</td>`;
        tablaBody.appendChild(row);}
    textoBuscador.removeEventListener("keyup", filtrado);
    textoBuscador.addEventListener("keyup", filtradoHistorial);
    botonesEliminarEvento(vehiculo)
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
                </form>`;
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
    const entrada = new Date(valorEditable[0].hora);
    const salida = new Date(document.getElementById("horaSalida").value);
    const val = document.getElementById("horaSalida").value;
    const validarSalida = validarHoraSalida(val)
    if (salida >= entrada && validarSalida === true) {
        const diferenciaMinutos = calcularDiferenciaEnMinutos(entrada, salida);
        if (diferenciaMinutos <= 15) {
            alert("La duracion del vehiculo fue menor a 15 minutos, no tiene cobro.")
        } else {
            const tiempoHoras = diferenciaMinutos / 60;
            const costo = calcularCosto(diferenciaMinutos, valorEditable);
            alert(`El costo del vehiculo ${valorEditable[0].tipo} - ${valorEditable[0].placa} por su estadia de ${tiempoHoras.toFixed(2)} horas o ${diferenciaMinutos} minutos es de ${costo.toLocaleString('es-CO')} pesos.`);
            var pago = costo
        }; 
        valorEditable[0].salida = salida;
        valorEditable[0].estado = false;
        valorEditable[0].pago = pago;
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
            alert("Salida del vehiculo realizada con exito, esperamos mas vehiculos...");
            const ver = document.getElementById("ver")
            ver.classList.add("active")
            filtrado();
            } else { alert("Ey Ey, un poco mas tranquilo de a uno por uno porfa :)"); }
        } catch (error){ console.log("Error" + error); }
      } else {
        if (salida < entrada){
            alert("La fecha de salida no puede ser anterior a la fecha de inicio.");
            return;
        } else if (validarSalida===false){
            alert("Lo siento no puedes registrar la salida del futuro.");
            return;
        }
    } 
}
function calcularDiferenciaEnMinutos(fechaHora1, fechaHora2) {
    const diferenciaMilisegundos = Math.abs(fechaHora2 - fechaHora1);
    return Math.floor(diferenciaMilisegundos / 60000);
  }
  function calcularCosto(diferenciaMinutos, valorEditable) {
    const type = valorEditable[0].tipo
    switch (type) {
        case "Carro": return 50 * diferenciaMinutos;
        case "Moto": return 40 * diferenciaMinutos;
        case "Camioneta": return 60 * diferenciaMinutos;
        case "Bus": return 90 * diferenciaMinutos;
        case "Camion": return 110 * diferenciaMinutos;
        default: return 0;
    }
}
function botonesEliminarEvento(vehiculo){
    const botonesEliminar = document.querySelectorAll(".boton-eliminar");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            console.log(e.target.id)
            const esp = e.currentTarget.id
            const valorEliminar = vehiculo.filter(vehi => vehi.placa === esp)
            console.log(valorEliminar)
            eliminarVehiculo(valorEliminar)})
    });
}
async function eliminarVehiculo(valorEditable) {
    console.log(valorEditable)
        const URL_ELI = "https://66d39804184dce1713d08825.mockapi.io/gotpark/vehiculos/"+valorEditable[0].id;
        try {
            let response = await fetch(URL_ELI, {
                method: "DELETE",
            });
        if (response.ok) {
            filtradoHistorial();
            } else { alert("Error al registrar la salida");}
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
    const div = document.createElement("div");
    const boton = document.createElement("button");
    const h1 = document.createElement("h1")
    const p = document.createElement("p")
    h1.textContent = "Bienvenido a Parkify"
    p.textContent = "Aqui podras registrar todos tus vehiculos, permitiendote manejar tu parqueadero de manera segura, facil, y eficaz..."
    h1.classList.add("titulo-inicio")
    p.classList.add("texto-inicio")
    div.classList.add("caja-inicio")
    boton.classList.add("boton-iniciar")
    boton.textContent = `Iniciar`
    div.appendChild(h1)
    div.appendChild(p)
    div.appendChild(boton)
    contenedorElementos.appendChild(div)
    boton.addEventListener("click", () => {
        const er = document.getElementById("inicio");
        er.classList.remove("active");
        const ere = document.getElementById("crear");
        ere.classList.add("active");
        crearForm();
    })
}
function botonesEventoFuncion(){
todosLosBotones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
    todosLosBotones.forEach((boton) => {
        boton.classList.remove("active");})
    e.currentTarget.classList.add("active");
    let per = e.currentTarget.id;
    switch (per) {
        case "crear": crearForm(); break;
        case "ver": filtrado(); break; 
        case "historial": filtradoHistorial(); break;
        case "inicio": mostrarInicio(); break;
        default: console.log("Opcion no valida");
    }})}
)};
const ere = document.getElementById("inicio");
ere.classList.add("active");
mostrarInicio();
botonesEventoFuncion()
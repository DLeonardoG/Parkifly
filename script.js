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
    if (validacion){
        // Se hace la peticion al api para guardar el vehiculo
        let informacion = [];
        let data = [];
        const datos = await obtenerDatos(URL);
        data = datos;
        data.forEach(element => {
        informacion.push(element);
            });
        console.log(informacion);
        const existeEspacio = informacion.some(informacion => informacion.espacio === space);
        const existePlaca = informacion.some(informacion => informacion. placa === placa);
        console.log(existeEspacio);
        console.log(existePlaca);
        if(existeEspacio){
            alert("El espacio ya se encuentra ocupado");
            return;
        } else if (existePlaca){
            alert("La placa ya se encuentra registrada");
            return;
        } else {
            try {
                const placaM = placa.toUpperCase()
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
                    alert("Vehiculo registrado correctamente");
                    limpiarForm();
                } else {
                    alert("Error al registrar el vehiculo");
                }
            }catch (error){
                console.log("error",error)
            }
        }
    } else {
        alert("La placa debe tener 3 letras y 3 numeros");
        return;
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
                    <input type="text" id="placa" placeholder="Ingrese la placa" required>
                </div>
                <div class="form-group">
                    <span>Tipo</span>
                    <select id="tipo" name="tipo" required>
                        <option value="Carro">Carro</option>
                        <option value="Moto">Moto</option>
                        <option value="Bus">Bus</option>
                        <option value="Camioneta">Camioneta</option>
                    </select>
                </div>
                <div class="form-group">
                    <span>Hora de entrada</span>
                    <input type="time" id="hora" name="hora" required>
                </div>
                <div class="form-group">
                    <span>Nivel</span>
                    <select id="nivel" name="nivel" required>
                        <option value="S">Stark(S)</option>
                        <option value="T">Targarien(T)</option>
                        <option value="L">Lanister(L)</option>
                    </select>
                </div>
                <div class="form-group">
                    <span>Espacio</span>
                    <select id="espacio" name="espacio" required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div class="button">
                    <input type="submit" value="Registrar Carro">
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
    vehiculo.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = "";
        row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.placa}</td>
            <td>${element.tipo}</td>
            <td>${element.hora}</td>
            <td>${element.espacio}</td>
            <td class="count"><button id="${element.espacio}" class="boton boton-editar">Editar</button><button class="boton boton-eliminar">Eliminar</button></td>
        `;
        tablaBody.appendChild(row);
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
                <h1 class="title">Salida de ${valorEditable[0].placa} - ${valorEditable[0].tipo}</h1>
                <form id="form-registro">
                    <div class="form-group">
                        <span>Placa</span>
                        <input type="text" id="placa" placeholder="Ingrese la placa" required>
                    </div>
                    <div class="form-group">
                        <span>Tipo</span>
                        <select id="tipo" name="tipo" required>
                            <option value="Carro">Carro</option>
                            <option value="Moto">Moto</option>
                            <option value="Bus">Bus</option>
                            <option value="Camioneta">Camioneta</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <span>Hora de salida</span>
                        <input type="time" id="hora" name="hora" required>
                    </div>
                    <div class="button">
                        <input type="submit" value="Actualizar ${valorEditable[0].placa}">
                    </div>
                </form>
                `;
        document.getElementById("placa").value = valorEditable[0].placa;
        document.getElementById("tipo").value = valorEditable[0].tipo;
        todosLosBotones.forEach((boton) => {
            boton.classList.remove("active");
        })
            })
    });
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
            console.log("Ver")
            mostrarDatos();
            break;
        default:
            console.log("Opcion no valida");
    }})}
)};

botonesEventoFuncion()
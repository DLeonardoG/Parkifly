const URL = "https://66d39804184dce1713d08825.mockapi.io/gotpark/vehiculos";
const crearBoton = document.getElementById("crear");
const VerBoton = document.getElementById("ver");
const main = document.getElementById("main");
const contenedorElementos = document.getElementById("contenedor-elementos");
const todosLosBotones = document.querySelectorAll(".boton-categoria")

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

// Agregar los eventos a las funciones necesarias
function botonesEventoFuncion(){
todosLosBotones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
    todosLosBotones.forEach((boton) => {
        boton.classList.remove("active");
    })
    main.className = "";
    contenedorElementos.className = "";
    e.currentTarget.classList.add("active");
    const per = e.currentTarget.id;
    switch (per) {
        case "crear":
            crearForm();
        case "ver":
            console.log("Ver")
    }})}
)};

botonesEventoFuncion()
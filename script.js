const URL = "https://66d39804184dce1713d08825.mockapi.io/gotpark/vehiculos";


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

async function guardarForm(){
    if (document.querySelector("#form-registro")){
        let formRegistro = document.getElementById("form-registro");
        formRegistro.onsubmit = function(e){
            e.preventDefault();
            formGuardar();
        }
}}
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
// let apellido = document.getElementById("apellido").value;
// let email = document.getElementById("email").value;
// let contrasenia = document.getElementById("contrasenia").value;
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
guardarForm()
const URL = "https://66d39804184dce1713d08825.mockapi.io/gotpark/vehiculos";
const tablaBody = document.getElementById("tabla-body")

const obtenerDatos = async() =>{
    try {
        const res = await fetch(URL);
        if (res.ok) {
            const got = await res.json();
            console.log(got)
            return got
        }} catch (error) {
            console.error("error" + error);
        }
    };

async function mostrarDatos(){
    var vehiculo = await obtenerDatos()
    tablaBody.innerHTML = "";
    vehiculo.forEach(element => {
        let row = document.createElement("tr");
        row.innerHTML = "";
        row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.placa}</td>
            <td>${element.tipo}</td>
            <td>${element.hora}</td>
            <td>${element.espacio}</td>
            <td><button class="boton boton-editar">Editar</button><button class="boton boton-eliminar">Eliminar</button></td>
        `;
        tablaBody.appendChild(row);
    });
}
obtenerDatos(URL)
mostrarDatos()
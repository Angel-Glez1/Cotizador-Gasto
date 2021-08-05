//? VARIBLES
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');




//? EVENTOS
eventListeners();
function eventListeners() {

    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);

}

//? CLASES
class Presupuesto {

    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }


    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }


    calcularRestante() {
        const gastado = this.gastos.reduce((acc, gasto) => acc + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }


    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }



    //? Esta fue mi solucion. 
    // obtenerRestante(gasto) {
    //     return this.presupuesto -= gasto;
    // }


}

class UI {

    insertarPresupuesto(cantidad) {
        // Extrayendo los valores
        const { presupuesto, restante } = cantidad;

        // Agrergar HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }


    actualizarRestante(gasto) {
        document.querySelector('#restante').textContent = gasto;


        const btnAgregar = formulario.lastElementChild;
        if (gasto <= 0) {
            btnAgregar.disabled = true;
        }

    }


    // Cambia el color de alert dependiendo lo qeu tenemos de restante
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        // Comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
    }

    impirmirAlert(mensaje, tipo) {

        const div = document.createElement('div');
        div.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            div.classList.add('alert-danger');
        } else {
            div.classList.add('alert-success');
        }

        // Mensaje de error
        div.textContent = mensaje;

        // Insertar
        document.querySelector('.primario').insertBefore(div, formulario);

        setTimeout(() => {
            div.remove();
        }, 1700);


    }

    agregarGastoListado(gastos) {
        
        this.limparHTML();

        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;
            
            // Listar Gastos.
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id; /*Esta es una nueva forma de poner el atributo tipo data*/
            nuevoGasto.innerHTML = `
                ${nombre} <spam class="badge badge-primary badge-pill"> ${cantidad} </spam>            
            `;

            // Boton para borrar un gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);

        });


    }


    limparHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    
}

//? Instancias
const ui = new UI();
let presupuesto;


//? FUNCIONES 
// Muestra el promp
function preguntarPresupuesto() {
    const presupuestousuario = prompt('¿cual Es tu presupuesto');
    if (presupuestousuario === '' || presupuestousuario === null || isNaN(presupuestousuario) || presupuestousuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestousuario);
    ui.insertarPresupuesto(presupuesto);


    console.log(presupuesto)
}

function agregarGasto(e) {

    e.preventDefault();

    // Leer los inputs
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar campos
    if (nombre === '' || cantidad === '') {
        console.log('Ambos son obligatorios');
        ui.impirmirAlert('Todos los campos son obligatorios', 'error');

    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.impirmirAlert('Cantidad no valida', 'error');
        return;
    }

    // Generar un pbjeto de tipo datos
    const gasto = { nombre, cantidad, id: Date.now() };

    // Añadir un nuevo gasto al array de la clase Presupuesto.
    presupuesto.nuevoGasto(gasto);


    // Impirmir los gasto
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);

    // Actualizar el restante
    ui.actualizarRestante(restante);

    // Mostar alerta de exito y resetear formulario
    ui.impirmirAlert('Gasto Añadido', 'exito');

    // Cambiar el bg de restante segun lo que vamos gastando
    ui.comprobarPresupuesto(presupuesto);


    /*
    ?Esta fue mi solucion. A lo de sacar el restante para gastar
    const restante = presupuesto.obtenerRestante(cantidad);
    ui.actualizarRestante(restante); */


    // Resetop Formulario.
    formulario.reset();

    
}

// Elima un gasto
function eliminarGasto(id) {

    presupuesto.eliminarGasto(id);
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
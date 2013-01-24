

/*******************************************************************************/
/* TPV Estanco v.1 *************************************************************/
/* JAVASCRIPT by Raúl Moya Reyes ***********************************************/
/*******************************************************************************/


// llamada al programa principal al cargar la página
window.onload=function(){main(); centradoVertical();}
window.onresize=function(){centradoVertical();}

// variables globales
var objSelect;
var contenedorProductos;
var ticket;
var contenedorTickets;
var rowSelect;



/*******************************************************************************/
/* Funciones varias
/*******************************************************************************/

// funciones para el reloj con la fecha y la hora
function startTime(){
	var today=new Date();
	var d=today.getDate();
	var mt=today.getMonth()+1;
	var y=today.getFullYear();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	var m=checkTime(m);
	var s=checkTime(s);
	document.getElementById('reloj').innerHTML=d+"/"+mt+"/"+y+"</br><span class='tamaño26'>"+h+":"+m+":"+s+"</span>";
	setTimeout('startTime()',500);
}
function checkTime(i){
	if (i<10) {i="0" + i;}
	return i;
}


// funciones para colocar la aplicación en el centro de la ventana
function centradoVertical(){

	var container = document.getElementById("contenedor");
	var heightC = 700; //container.style.height;
	var heightV = window.innerHeight;
	var marginC = 0;

	if(((heightV - heightC) / 2 ) > 0) {marginC = ((heightV - heightC) / 2 );}

	container.style.margin = marginC + "px";

	var popUp = document.getElementById("espacio");
	heightC = 500;

	if(((heightV - heightC) / 2 ) > 0) {marginC = ((heightV - heightC) / 2 );}

	popUp.style.margin = marginC + "px auto";

	popUp = document.getElementById("espacio2");
	heightC = 300;

	if(((heightV - heightC) / 2 ) > 0) {marginC = ((heightV - heightC) / 2 );}

	popUp.style.margin = marginC + "px auto";
}
 

// funciones para añadir y quitar lineas del ticket
function addRow() {
	vaciarTabla("ticket");
	ticket.insertar("Sin nombre", 1, 0, 1);
	rellenarTabla("ticket");
	document.getElementById("valores").focus();
}

function deleteRow() {

	var codigo = document.getElementById("codigo");
	var cantidad = document.getElementById("cantidad");
	var precio = document.getElementById("precio");
	var total = document.getElementById("total");

	if(rowSelect > -1){
		var cAntigua = ticket.devolverC(rowSelect);
		var producto = contenedorProductos.buscar(codigo.value);
		if(producto != undefined && producto != 0){
			contenedorProductos.buscar(codigo.value).setStock(-cAntigua);
		}
		ticket.eliminar(ticket.lineas() - rowSelect - 1);
		
		vaciarTabla("ticket");

		total.value = ticket.getTotal().toFixed(2) + " €";

		var entregado = document.getElementById("entregado").value;
		document.getElementById("cambio").value = eval(parseFloat(entregado)-parseFloat(total.value)).toFixed(2) + " €";

		codigo.value = 0;
		cantidad.value = 1;
		precio.value = 0.00;
		rowSelect = -1;

		rellenarTabla("ticket");
	}


	document.getElementById("valores").focus();
	document.getElementById("valores").value="";

}


// funciones para rellenar la tabla del ticket
function rellenarTabla(id){

	var table = document.getElementById(id);
	var rowCount = table.rows.length;

	for(var i=0; i<ticket.lineas(); i++){

		var row = table.insertRow(rowCount);
		var cell1 = row.insertCell(0);
		row.cells[0].className = "td1"
		var cell2 = row.insertCell(1);
		row.cells[1].className = "td2"
		var cell3 = row.insertCell(2);
		row.cells[2].className = "td2"
		var cell4 = row.insertCell(3);
		row.cells[3].className = "td2"

		row.addEventListener("click", clickTable, false);

		cell1.innerHTML = ticket.devolverP(i).nombre;
		cell2.innerHTML = ticket.devolverC(i);
		cell3.innerHTML = ticket.devolverP(i).precio;
		cell4.innerHTML = (ticket.devolverC(i)*ticket.devolverP(i).precio).toFixed(2);

	}

}


// 
function clickTable() {


	rowSelect = this.rowIndex;

	var table = document.getElementById("ticket");
	for(var i=0; i<table.rows.length; i++){
		if(i == rowSelect){
			table.rows[rowSelect].style.border = "1px solid #666666";
			document.getElementById("codigo").value = ticket.devolverP(ticket.lineas() - rowSelect - 1).codigo;
			document.getElementById("cantidad").value = ticket.devolverC(ticket.lineas() - rowSelect - 1);
			document.getElementById("precio").value = ticket.devolverP(ticket.lineas() - rowSelect - 1).precio;
		}else{
			table.rows[i].style.border = "none";
		}
	}

	objSelect = document.getElementById("codigo");
	document.getElementById("valores").value = "";
	document.getElementById("valores").focus();
}


function vaciarTabla(id){

	var table = document.getElementById(id);
	var rowCount = table.rows.length;


	for(var i=0; i<rowCount; i++) {
		table.deleteRow(0);
	}
}

function eliminarTicket(){

	var today=new Date();
	var d=today.getDate();
	var mt=today.getMonth()+1;
	var y=today.getFullYear();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();

	var fecha = d+"/"+mt+"/"+y;
	var hora = h+":"+m+":"+s;

	ticket = new Ticket(contenedorTickets.length, fecha, hora);
	vaciarTabla("ticket");

	document.getElementById("total").value = "0.00 €";
	document.getElementById("entregado").value = 0.00;
	document.getElementById("cambio").value = "0.00 €";
	document.getElementById("valores").value = "";
	document.getElementById("codigo").value = 0;
	document.getElementById("cantidad").value = 1;
	document.getElementById("precio").value = 0;

	objSelect = document.getElementById("codigo");
	document.getElementById("valores").focus();

}

// funciones para aceptar cambios
function aceptar(){

	vaciarTabla("ticket");

	var codigo = document.getElementById("codigo");
	var cantidad = document.getElementById("cantidad");
	var precio = document.getElementById("precio");
	var producto = contenedorProductos.buscar(codigo.value);
	var nombre = "Sin nombre";
	var total = document.getElementById("total");

	if(producto != undefined && producto != 0) { 
		nombre=producto.nombre;
		
		//actualizar stock
		var cAntigua = ticket.devolverC(rowSelect);
		contenedorProductos.buscar(codigo.value).setStock(-cAntigua);
		
		// controlar stock
		if(contenedorProductos.buscar(codigo.value).stock - cantidad.value >= 0){
			contenedorProductos.buscar(codigo.value).setStock(cantidad.value);

			if(codigo.value != 0 && rowSelect == -1){
				ticket.insertar(nombre, codigo.value, precio.value, cantidad.value);
			}else if(rowSelect > -1){
				ticket.actualizar((ticket.lineas() - rowSelect - 1), nombre, codigo.value, precio.value, cantidad.value);
			}

		} else {
			alert("No hay stock suficiente.");
		}

	} else if(codigo.value != 0 && rowSelect == -1){
		ticket.insertar(nombre, codigo.value, precio.value, cantidad.value);
	} else if(codigo.value != 0 && rowSelect > -1){
		ticket.actualizar((ticket.lineas() - rowSelect - 1), nombre, codigo.value, precio.value, cantidad.value);
	}
	total.value = ticket.getTotal() + " €";

	var entregado = document.getElementById("entregado").value;
	document.getElementById("cambio").value = eval(parseFloat(entregado)-parseFloat(total.value)).toFixed(2) + " €";

	codigo.value = 0;
	cantidad.value = 1;
	precio.value = 0.00;
	rowSelect = -1;

	rellenarTabla("ticket");
	objSelect = codigo;

	document.getElementById("valores").focus();
	document.getElementById("valores").value="";

}


// funciones para selecionar objetos
function select(){

	objSelect = this;

	var valores = document.getElementById("valores");
	valores.value = ""; //this.value
	valores.focus();

}


// funciones para borrar en el teclado
function borrar(){
	var valores = document.getElementById("valores");
	valores.value = valores.value.substring(0, valores.value.length-1);
	//objSelect.value = valores.value;
	actualiza();
	valores.focus();
}


// funciones para actualizar desde valores
function actualiza(){
	var valor = document.getElementById("valores").value;
    patron =/[A-Za-zñÑ\s]/;
    var letra = patron.test(String.fromCharCode(valor.charCodeAt(valor.length-1)));

	if(!letra && valor != "" && valor != " " && valor != 0){
		// buscar alguna forma para corregir el error 6/ y los decimales si es el precio
		if (objSelect.id == "entregado" || objSelect.id == "precio"){
			objSelect.value = eval(valor).toFixed(2);
		}else {
			objSelect.value = eval(valor).toFixed(0);
		}
	}else{
		objSelect.value = 0;
		this.value = "";
	}

	if(objSelect == document.getElementById("codigo")) {
		var datos = contenedorProductos.buscar(objSelect.value);
		if(datos != 0) {
			document.getElementById("precio").value = datos.precio;
		} else {
			document.getElementById("precio").value = 0.00;
		}
	}

	var total = document.getElementById("total").value;
	var entregado = document.getElementById("entregado").value;
	document.getElementById("cambio").value = eval(parseFloat(entregado)-parseFloat(total)).toFixed(2) + " €";

}


// funciones para cambiar entre producto, buscar o lista
function divProducto(){

	var id = this.id;

	document.getElementById("sProducto").style.display = "none";
	document.getElementById("sBuscar").style.display = "none";
	document.getElementById("sLista").style.display = "none";

	document.getElementById("bProducto").className = "boton2 tamaño18";
	document.getElementById("bBuscar").className = "boton2 tamaño18";
	document.getElementById("bListaProductos").className = "boton2 tamaño18";

	if(id == "bProducto"){
		document.getElementById("sProducto").style.display = "block";
		document.getElementById("bProducto").className = "boton2 tamaño18 cGreen";
	}else if(id == "bBuscar"){
		document.getElementById("sBuscar").style.display = "block";
		document.getElementById("bBuscar").className = "boton2 tamaño18 cGreen";
	}else {
		document.getElementById("sLista").style.display = "block";
		document.getElementById("bListaProductos").className = "boton2 tamaño18 cGreen";
	}

}


// funciones para rellenar el div de la lista de productos
function rellenarListaProductos(){

}


// funciones para realizar una busqueda de un producto
function busqueda(){

}


// funciones para confirmar el cobro
function cobrar(){

	if(ticket.lineas() != 0) {
		contenedorTickets[contenedorTickets.length]=ticket;
		añadirTicketLista();
	}
	eliminarTicket();

}


// funciones para ver los tickets
function listaTickets(){

	if(document.getElementById("popUp").style.display == "block"){
		document.getElementById("popUp").style.display = "none";
	}else{
		document.getElementById("popUp").style.display = "block";
	}
}

function añadirTicketLista(){
	var element1 = document.createElement("div");
	element1.id = ticket.codigo;
	var cabecera = "<span class='tamaño26'>NOMBRE DEL ESTANCO</span><br><span class='tamaño18'>DIRECCION</span><br>CIF: 00000000<br>";
	var identificador = "Código Ticket: " + ticket.codigo + " - Fecha: " + ticket.fecha + " - Hora: " + ticket.hora + "<br>";
	element1.innerHTML = cabecera + identificador + "<br>";
	
	var element2 = document.createElement("table");
	//element2.style.border = "1px solid";
	var rowCount = element2.rows.length;

    for(var i=0; i<ticket.lineas(); i++){

		var row = element2.insertRow(rowCount);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);

		cell1.innerHTML = ticket.devolverP(i).nombre;
		cell2.innerHTML = ticket.devolverC(i);
		cell3.innerHTML = ticket.devolverP(i).precio;
		cell4.innerHTML = (ticket.devolverC(i)*ticket.devolverP(i).precio).toFixed(2);

	}
	element1.appendChild(element2);

	var element3 = document.createElement("span");
	element3.innerHTML = "Total: " + ticket.getTotal() + "€ - " + "Entregado: " + document.getElementById("entregado").value + "€ - " +"Cambio: " + document.getElementById("cambio").value;
	element1.appendChild(element3);

	document.getElementById("espaciot").appendChild(element1);
}


// funciones acerca de
function mAcercaDe() {

	if(document.getElementById("acercaDe").style.display == "block"){
		document.getElementById("acercaDe").style.display = "none";
	}else{
		document.getElementById("acercaDe").style.display = "block";
	}
}


// funciones para leer los productos desde donde sea necesario
function leerProductos(){

	var nProductos = 20; // numero de productos
	var vProductos = new ContenedorP(nProductos);

	for(var i=0; i<nProductos; i++){

		// creo unos valores aleatorios para meterlos como productos
        var codigo = 10000+i;
        var precio = (Math.floor(Math.random()*100)/100)+4;
        var stock = Math.floor((Math.random()*10)+5);

		vProductos.insertar("Tabaco "+i, codigo, precio, stock);

	}

	return vProductos;

}


// funciones para los botones del teclado
function teclado(){

	document.getElementById("valores").value += this.value;
	actualiza();
}

// evento tecla intro
function teclasEspeciales(event){

	//alert(event.keyCode);
	if((event.keyCode==13 && objSelect.id!="entregado") || (event.which ==13 && objSelect.id!="entregado")){
		aceptar();
	}
}


// funciones para los eventos
function callback(){

	// botones cobrar y ticket
	document.getElementById("bTickets").addEventListener ("click", listaTickets, false);
	document.getElementById("bCobrar").addEventListener ("click", cobrar, false);

	// zona del ticket
	document.getElementById("bAñadirProducto").addEventListener ("click", addRow, false);
	document.getElementById("bEliminarProducto").addEventListener ("click", deleteRow, false);
	document.getElementById("bEliminarTicket").addEventListener ("click", eliminarTicket, false);

	// input text
	document.getElementById("entregado").addEventListener ("click", select, false);
	document.getElementById("codigo").addEventListener ("click", select, false);
	document.getElementById("cantidad").addEventListener ("click", select, false);
	document.getElementById("precio").addEventListener ("click", select, false);

	// teclado
	document.getElementById("valores").addEventListener ("keyup", actualiza, false);
	document.getElementById("valores").addEventListener ("keypress", function(event) {teclasEspeciales(event);}, false);
	document.getElementById("bBorrar").addEventListener ("click", borrar, false);
	document.getElementById("bAceptar").addEventListener ("click", aceptar, false);
	document.getElementById("b1").addEventListener ("click", teclado, false);
	document.getElementById("b2").addEventListener ("click", teclado, false);
	document.getElementById("b3").addEventListener ("click", teclado, false);
	document.getElementById("b4").addEventListener ("click", teclado, false);
	document.getElementById("b5").addEventListener ("click", teclado, false);
	document.getElementById("b6").addEventListener ("click", teclado, false);
	document.getElementById("b7").addEventListener ("click", teclado, false);
	document.getElementById("b8").addEventListener ("click", teclado, false);
	document.getElementById("b9").addEventListener ("click", teclado, false);
	document.getElementById("b0").addEventListener ("click", teclado, false);
	document.getElementById("b.").addEventListener ("click", teclado, false);
	document.getElementById("b/").addEventListener ("click", teclado, false);
	document.getElementById("b*").addEventListener ("click", teclado, false);
	document.getElementById("b-").addEventListener ("click", teclado, false);
	document.getElementById("b+").addEventListener ("click", teclado, false);

	// botones
	document.getElementById("bProducto").addEventListener ("click", divProducto, false);
	document.getElementById("bBuscar").addEventListener ("click", divProducto, false);
	document.getElementById("bListaProductos").addEventListener ("click", divProducto, false);

	// popUp
	document.getElementById("bCerrarPop").addEventListener ("click", listaTickets, false);
	document.getElementById("AcercaDe").addEventListener ("click", mAcercaDe, false);
	document.getElementById("bCerrarAcerca").addEventListener ("click", mAcercaDe, false);

	// teclas especiales
	//document.getElementById("contenedor").addEventListener ()

}



/*******************************************************************************/
/* Programa principal
/*******************************************************************************/
function main() {

	startTime(); // crear el reloj

	contenedorProductos = leerProductos(); // leer los productos
	contenedorTickets = new Array();
	eliminarTicket();
	rowSelect=-1;

	if(contenedorProductos != undefined && contenedorProductos.tamaño() > 0) {
		rellenarListaProductos(); // si hay productos rellenar el div de la lista de productos
	} else {
		alert("Fallo al cargar los productos");
	}

	callback();
}


/*******************************************************************************/
/* TPV Estanco v.1 *************************************************************/
/* JAVASCRIPT by Raúl Moya Reyes ***********************************************/
/*******************************************************************************/


// clases


/*******************************************************************************/
/* Clase para crear objetos producto
/*******************************************************************************/

function Producto(){
	this.codigo = 0;
	this.precio = 0.00;
	this.stock = "0";
	this.nombre = "Sin nombre"

	this.set = function (nombre, codigo, precio, stock) {
		
		// comprobar que los valores sean correctos
		this.nombre = nombre;
		this.codigo = parseInt(codigo);
		this.precio = parseFloat(precio).toFixed(2);
		this.stock = parseInt(stock);
	};

	this.setStock = function (cantidad) {

		if(eval(this.stock - cantidad) > 0){
			this.stock = eval(this.stock - cantidad);
		} else {
			this.stock = eval(this.stock - cantidad);
			alert("Acaba de agotar el producto.");
		}

	};

	this.getStock = function (){
		return parseInt(this.stock);
	};
}



/*******************************************************************************/
/* Clase para contenedor de productos
/*******************************************************************************/
function ContenedorP (size) {
	this.size = size;
	this.realSize = 0;
	this.array = new Array(size);

	this.insertar = function (nombre, codigo, precio, stock){
		
		// comprobar que no me cuelo del tamaño y amplicar si es necesario

		this.array[this.realSize] = new Producto();
		this.array[this.realSize].set(nombre, codigo, precio, stock);
		this.realSize += 1;
	};

	this.actualizar = function(pos, nombre, codigo, precio, stock){
		this.array[pos].set(nombre, codigo, precio, stock);
	};

	this.devolver = function (posicion){

		// comprobar posicon

		return this.array[posicion];
	};

	this.tamaño = function(){

		return this.realSize;
	};

	this.eliminar = function(pos) {
		for(var i=pos; i<this.realSize; i++) {
			this.array[pos]=this.array[pos+1];
		}
		this.realSize--;
	};

	this.buscar = function(codigo){

		// mejorar la búsqueda y ordenar el array por codigo

		for(var i = 0; i < this.realSize; i++){
			if (codigo == this.array[i].codigo){
				return this.array[i];
			}
		}

		return 0;
	};
}




/*******************************************************************************/
/* Clase para crear objetos tickets
/*******************************************************************************/

function Ticket(codigo, fecha, hora){
	this.productos = new ContenedorP(100); // pongo 100 mientras que hago el contenedor dinámico
	this.cantidades = new Array(100);
	this.total = 0.00;
	this.codigo = codigo;
	this.fecha = fecha;
	this.hora = hora;

	this.insertar = function(nombre, codigo, precio, cantidad){
		
		var pos = -1;
		for(var i=0; i<this.productos.tamaño(); i++){
			if(this.productos.devolver(i).codigo == codigo && this.productos.devolver(i).precio == precio){
				pos=i;
			}
		}

		if(pos == -1){
			this.cantidades[this.productos.tamaño()] = cantidad;
			this.productos.insertar(nombre, codigo, precio, 0);
		} else {
			this.cantidades[pos] = eval(parseInt(this.cantidades[pos]) + parseInt(cantidad));
		}

		this.total = eval(parseFloat(this.total) + parseFloat(cantidad*precio));
		this.total = this.total.toFixed(2);
	};

	this.devolverP = function(pos){
		if(pos > -1 && pos < this.productos.tamaño()){
			return this.productos.devolver(pos);
		}else {
			return 0;
		}
	};

	this.devolverC = function(pos){
		if(pos > -1 && pos < this.productos.tamaño()){
			return this.cantidades[pos];
		}else {
			return 0;
		}
	};

	this.actualizar = function(pos, nombre, codigo, precio, cantidad){
		if(pos > -1 && pos < this.productos.tamaño()){
			this.total = eval(this.total - (this.productos.devolver(pos).precio*this.cantidades[pos])).toFixed(2);
			this.productos.actualizar(pos, nombre, codigo, precio, 0);
			this.cantidades[pos] = parseInt(cantidad);

			this.total = eval(parseFloat(this.total) + eval(this.productos.devolver(pos).precio*this.cantidades[pos])).toFixed(2);
		}
	};

	this.eliminar = function(pos){
		if(pos > -1 && pos < this.productos.tamaño()){
			this.total = this.total - (this.productos.devolver(pos).precio*this.cantidades[pos]);
			this.productos.eliminar(pos);
			for(var i=pos; i< this.productos.tamaño(); i++){
				this.cantidades[pos]=this.cantidades[pos+1];
			}
		}
	};

	this.getTotal = function(){
		return this.total;
	};

	this.lineas = function(){
		return this.productos.tamaño();
	};

}
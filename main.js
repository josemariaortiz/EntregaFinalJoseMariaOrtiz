
const contenedorProductos = document.getElementById("contenedorProductos");

const productos = [];
const mostrarProductos = async () => {
  const resp = await fetch("http://localhost:3000/productos");
  const data = await resp.json();

  data.forEach((producto) => {
    productos.push(producto);
    const card = document.createElement("div");
    card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
    card.innerHTML = `
        <div class="card">
               <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
               <div class="card-body">
               <h5 class="card-title"> ${producto.nombre} </h5>
               <p class="card.text"> $ ${producto.precio}</p>
               <button class="btn colorBoton" id="boton${producto.id}"> Agregar al Carrito </button>
               </div>
            </div>
            `;

    contenedorProductos.appendChild(card);

    const boton = document.getElementById(`boton${producto.id}`);
    boton.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
      swal("Producto agregado a tu carrito",'Presiona el botón "Ver carrito"');

    });
  });
};

mostrarProductos();

var carrito = [];
const carritoStorage = JSON.parse(localStorage.getItem("carrito"));

console.log(carritoStorage != null);
if (carritoStorage != null) {
  carritoStorage.map((prod) => carrito.push(prod));
  
}


console.log("carritoostorage", carrito);
const agregarAlCarrito = (id) => {
  const producto = productos.find((producto) => producto.id === id);
  const productoEnCarrito = carrito.find((producto) => producto.id === id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
  }
  calcularTotal();
  
};

const contenedorCarrito = document.getElementById("contenedorCarrito");

const verCarrito = document.getElementById("verCarrito");


verCarrito.addEventListener("click", () => {
  mostrarCarrito();
});

const mostrarCarrito = () => {
  contenedorCarrito.innerHTML = "";
  carrito.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
    card.innerHTML = `
        <div class="card">
               <img src="${producto.img}" class="card-img-top imgProductos"  alt="${producto.nombre}">
               <div class="card-body">
               <h5 class="card-title"> ${producto.nombre} </h5>
               <p class="card.text"> $ ${producto.precio}</p>
               <p class="card.text"> Cantidad : ${producto.cantidad}</p>
               <button class="btn colorBoton" id="eliminar${producto.id}"> Eliminar Producto </button>
               </div>
            </div>
            `;
    contenedorCarrito.appendChild(card);

    const boton = document.getElementById(`eliminar${producto.id}`);
    boton.addEventListener("click", () => {
      eliminarDelCarrito(producto.id);
    });
  });

  calcularTotal();
};
 
const eliminarDelCarrito = (id) => {
  const producto = carrito.find((producto) => producto.id === id);
  const indice = carrito.indexOf(producto);
  console.log("indicee",indice)
  carrito.splice(indice, 1)

  mostrarCarrito();
  const carrioStorage = JSON.parse(localStorage.getItem("carrito"));
  carrioStorage.splice(indice, 1)
  localStorage.setItem("carrito", JSON, stringify(carrioStorage));

  swal({
    title: "Estas Seguro?",
    text: "Estas seguro queres borrar tu producto?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "El producto fue borrado", "success");
    }
  });
  mostrarCarrito();
 
   

};

const vaciarCarrito = document.getElementById("vaciarCarrito");
vaciarCarrito.addEventListener("click", () => {
  eliminarTodoElCarrito();
  swal({
    title: "Estas seguro?",
    text: "Estas seguro que queres borrar todos los productos de tu carrito?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "Los productos fueron borrados!", "success");
    }
  });
});

const eliminarTodoElCarrito = () => {
  carrito = [];
  localStorage.clear();
  mostrarCarrito();
};

const total = document.getElementById("total");

const calcularTotal = () => {
  let totalCompra = 0;
  carrito.forEach((producto) => {
    totalCompra += producto.precio * producto.cantidad;
  });
  total.innerHTML = ` $${totalCompra}`;
};

calcularTotal();

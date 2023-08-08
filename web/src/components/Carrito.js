import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Carrito = () => {
  const [productos, setProductos] = useState([]);

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    setProductos([...productos, producto]);
  };

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (indice) => {
    const nuevosProductos = [...productos];
    nuevosProductos.splice(indice, 1);
    setProductos(nuevosProductos);
  };

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setProductos([]);
  };



  return (
    <div className="Carrito">
      {productos.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {productos.map((producto, index) => (
            <li key={index}>
              {producto.nombre} - ${producto.precio}
              <button onClick={() => eliminarDelCarrito(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={vaciarCarrito}>Vaciar Carrito</button>
    </div>
  );
};

export default Carrito;

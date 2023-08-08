import React, { useEffect, useState } from 'react';
import '../styles/productosConImagenes.css'
const ProductosConImagenes = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    // Obtener la lista de productos desde el servidor al cargar el componente
    fetch('http://localhost:5000/productos')
      .then((response) => response.json())
      .then((data) => {
        setProductos(data); // Guardar los productos en el estado
      })
      .catch((error) => console.error('Error al obtener la lista de productos:', error));
  }, []);

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    // Comprobar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find((item) => item.id_producto === producto.id_producto);

    if (productoEnCarrito) {
      // Si el producto ya está en el carrito, quitarlo del carrito
      setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id_producto !== producto.id_producto));
    } else {
      // Si el producto no está en el carrito, agregarlo al carrito
      setCarrito((prevCarrito) => [...prevCarrito, producto]);
    }
  };

  // Función para comprobar si un producto está en el carrito
  const estaEnCarrito = (producto) => {
    return carrito.some((item) => item.id_producto === producto.id_producto);
  };

  return (
    <div >
      <h2>Productos</h2>
      <div className='productos-container'>
        {productos.map((producto) => (
          <div className ="producto-card" key={producto.id_producto}>
            <h3>{producto.nombre_producto}</h3>
            <p>Descripción: {producto.descripcion}</p>
            <p>Precio: {producto.precio}</p>
            <p>Existencias: {producto.existencias}</p>
            <img
              src={`http://localhost:5000/${producto.url_imagen}`}
              alt={`Imagen de ${producto.nombre_producto}`}
            />
            <button onClick={() => agregarAlCarrito(producto)}>
              {estaEnCarrito(producto) ? 'Quitar del carrito' : 'Agregar al carrito'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosConImagenes;

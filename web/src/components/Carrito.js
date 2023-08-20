import React, { useEffect, useState } from 'react';

const Carrito = ({ userId, refreshCarrito }) => {
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);

  useEffect(() => {
    console.log('Realizando solicitud al servidor para obtener productos del carrito...');
    fetch(`http://localhost:5000/obtener-carrito/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Respuesta del servidor:', data);
        if (data.success) {
          console.log('Productos del carrito obtenidos:', data.carrito);
          setProductosEnCarrito(data.carrito);
        } else {
          console.error('Error al obtener productos del carrito:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error al obtener productos del carrito:', error);
      });
  }, [productosEnCarrito]); // Solo se ejecutará cuando cambie "productosEnCarrito"

  return (
    <div>
      <h2>Carrito de Compras</h2>
      <div className="productos-container">
        {productosEnCarrito.map((producto) => (
          <div className="producto-card" key={producto.id_producto}>
            <h3>{producto.nombre_producto}</h3>
            <p>Descripción: {producto.descripcion}</p>
            <p>Precio: {producto.precio}</p>
            <p>Cantidad: {producto.cantidad}</p>
            <img
              src={`http://localhost:5000/${producto.url_imagen}`}
              alt={`Imagen de ${producto.nombre_producto}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carrito;

 
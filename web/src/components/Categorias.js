import React, { useState, useEffect } from "react";
import { useCart } from "../context/ContextCarrito";
import "../styles/productosConImagenes.css";


const Categorias = ({ categoria }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Realiza una solicitud al servidor para obtener los productos de la categoría seleccionada
    if (categoria !== null) {
      fetch(`http://localhost:5000/producto-categoria/${categoria}`)
        .then((response) => response.json())
        .then((data) => {
          setProductos(data);
        })
        .catch((error) =>
          console.error("Error al obtener productos por categoría:", error)
        );
    }
  }, [categoria]);

  return (
    <div>
      <h2>Productos</h2>
      <div className="productos-container">
        {productos.map((producto) => (
          <div className="producto-card" key={producto.id_producto}>
            <img
              src={`http://localhost:5000/${producto.url_imagen}`}
              alt={`Imagen de ${producto.nombre_producto}`}
            />
            <h3>{producto.nombre_producto}</h3>
            <p className="p-productosImagenes">  Descripción: {producto.descripcion}</p>
            <p className="p-productosImagenes">  Precio: {producto.precio}</p>
            <p className="p-productosImagenes">  Existencias: {producto.existencias}</p>

            {cartItems.some((item) => item.id === producto.id_producto) ? (
              <button onClick={() => removeFromCart(producto.id_producto)}>
                Eliminar del carrito
              </button>
            ) : (
              <button onClick={() => addToCart(producto.id_producto, producto)}>
                Agregar al carrito
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorias;

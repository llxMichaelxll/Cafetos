import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importar Link desde React Router
import '../styles/productosConImagenes.css';

const ProductosConImagenes = ({ userId }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/productos')
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => console.error('Error al obtener la lista de productos:', error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/obtener-carrito/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCarrito(data.carrito);
        } else {
          console.error('Error al obtener el carrito:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el carrito:', error);
      });
  }, [userId]);

  const agregarProductoAlCarrito = async (productoId) => {
    if (!userId) {
      console.log('No se puede agregar al carrito: usuario no ha iniciado sesión');
      return;
    }

    console.log('Agregando producto al carrito. ID del producto:', productoId);

    try {
      const response = await fetch('http://localhost:5000/agregar-al-carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: userId,
          idProducto: productoId,
          cantidad: 1,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Producto agregado al carrito');
        setCarrito([...carrito, productoId]);

      } else {
        console.error('Error al agregar producto al carrito:', data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const eliminarProductoDelCarrito = async (productoId) => {
    if (!userId) {
      console.log('No se puede eliminar del carrito: usuario no ha iniciado sesión');
      return;
    }

    console.log('Eliminando producto del carrito. ID del producto:', productoId);

    try {
      const response = await fetch('http://localhost:5000/eliminar-del-carrito', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: userId,
          idProducto: productoId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Producto eliminado del carrito');
        setCarrito(carrito.filter((item) => item !== productoId));
      } else {
        console.error('Error al eliminar producto del carrito:', data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div>
      <h2>Productos</h2>
      <div className="productos-container">
        {productos.map((producto) => (
          <div className="producto-card" key={producto.id_producto}>
            <h3>{producto.nombre_producto}</h3>
            <p>Descripción: {producto.descripcion}</p>
            <p>Precio: {producto.precio}</p>
            <p>Existencias: {producto.existencias}</p>
            <img
              src={`http://localhost:5000/${producto.url_imagen}`}
              alt={`Imagen de ${producto.nombre_producto}`}
            />
            {userId ? (
              carrito.includes(producto.id_producto) ? (
                <div>
                  <button onClick={() => eliminarProductoDelCarrito(producto.id_producto)}>
                    Eliminar del carrito
                  </button>
                  <p>Producto en el carrito</p>
                </div>
              ) : (
                <button onClick={() => agregarProductoAlCarrito(producto.id_producto)}>
                  Agregar al carrito
                </button>
              )
            ) : (
              <Link to="/login"><button>Agregar al carrito</button></Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default ProductosConImagenes;
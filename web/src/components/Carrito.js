import React, { useState, useEffect } from 'react';
import { useCart } from '../context/ContextCarrito';

const Carrito = () => {
  const { cartItems } = useCart();
  
  // Estado para mantener los precios totales por producto
  const [preciosTotales, setPreciosTotales] = useState({});

  // Calcular el total inicial sumando los precios totales
  const totalInicial = cartItems.reduce((total, item) => {
    const totalProducto = preciosTotales[item.id] || 0;
    return total + totalProducto;
  }, 0);

  // Estado para mantener el total actual
  const [total, setTotal] = useState(totalInicial);

  useEffect(() => {
    // Actualizar el total cuando cambian los precios totales
    setTotal(cartItems.reduce((total, item) => {
      const totalProducto = preciosTotales[item.id] || 0;
      return total + totalProducto;
    }, 0));
  }, [preciosTotales, cartItems]);

  const aumentar = (itemId, existencias, categoria, valor, precio) => {
    const newMinimo = categoria === 2 ? 10 : 1;

    const currentTotal = preciosTotales[itemId] || 0;
    const newTotal = Math.max(currentTotal + valor * precio, newMinimo * precio); // Asegurar mínimo

    const newCantidad = Math.max(newTotal / precio, newMinimo);

    if (existencias >= newMinimo && existencias >= newCantidad) {
      setPreciosTotales(prevPreciosTotales => ({
        ...prevPreciosTotales,
        [itemId]: newTotal
      }));
    }
  };

  const calcularCantidad = (itemId, precio, categoria) => {
    const totalProducto = preciosTotales[itemId] || 0;
    const newMinimo = categoria === 2 ? 10 : 1;
    return totalProducto > 0 ? Math.max(Math.floor(totalProducto / precio), newMinimo) : newMinimo;
  };

  return (
    <div>
      <h2>Carrito de compras</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            <div>
              <h3>{item.nombre_producto}</h3>
              <img
                src={`http://localhost:5000/${item.url_imagen}`}
                alt={`Imagen de ${item.nombre_producto}`}
                style={{ width: '100px', height: '100px' }}
              />
              <p>Cantidad: {calcularCantidad(item.id, item.precio, item.id_categoria)}</p>
              <p>Precio por unidad: ${item.precio}</p>
              <p>Precio total por producto: ${item.id in preciosTotales ? preciosTotales[item.id] : 0}</p>
              <button onClick={() => aumentar(item.id, item.existencias, item.id_categoria, 1, item.precio)}>+</button>
              <button onClick={() => aumentar(item.id, item.existencias, item.id_categoria, -1, item.precio)}>-</button>
            </div>
          </li>
        ))}
      </ul>
      <p>Total del carrito: ${total}</p>
    </div>
  );
};

export default Carrito;

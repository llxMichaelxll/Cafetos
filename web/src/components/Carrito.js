import React, { useState, useEffect } from 'react';
import { useCart } from '../context/ContextCarrito';
import { json } from 'react-router-dom';

const Carrito = ({userId}) => {
  const { cartItems,vaciarCarrito} = useCart();
  const id = userId;
  
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

  const EnviarPedido = async (total) => {
    if(cartItems){
    const Pedido = {
      id_usuario: id,
      monto_total: total,
      productos: cartItems,
      estado: 'Pendiente'}
  

  const PedidoUsuario = await fetch('http://localhost:5000/nuevo-pedido',{
  method: 'POST',
  headers :{
    'Content-Type': 'application/json'
  },
  body:JSON.stringify(Pedido),

  })
  const PedidoResponse = await PedidoUsuario.json()

  if(PedidoResponse.success){
    alert('Compra realizada: '+ PedidoResponse.message);
  }

  else{alert('No se pudo realizar la compra: '+ PedidoResponse.message)}
    }
  
  else{alert('el carrito esta vacio')}
}
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
      <button onClick={()=>{EnviarPedido(total)}}>Comprar</button>
      <button onClick={()=>{vaciarCarrito()}}>Vaciar Carrito</button>
    </div>
  );
};

export default Carrito;

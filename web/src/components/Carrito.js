import React, { useState, useEffect } from "react";
import { useCart } from "../context/ContextCarrito";
import { Link, json } from "react-router-dom";

const Carrito = ({ userId }) => {
  const { cartItems, vaciarCarrito } = useCart();
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
    setTotal(
      cartItems.reduce((total, item) => {
        const totalProducto = preciosTotales[item.id] || 0;
        return total + totalProducto;
      }, 0)
    );
  }, [preciosTotales, cartItems]);

  const aumentar = (itemId, existencias, categoria, valor, precio) => {
    const newMinimo = categoria === 2 ? 10 : 1;

    const currentTotal = preciosTotales[itemId] || 0;
    const newTotal = Math.max(
      currentTotal + valor * precio,
      newMinimo * precio
    ); // Asegurar mínimo

    const newCantidad = Math.max(newTotal / precio, newMinimo);

    if (existencias >= newMinimo && existencias >= newCantidad) {
      setPreciosTotales((prevPreciosTotales) => ({
        ...prevPreciosTotales,
        [itemId]: newTotal,
      }));
    }
  };

  const calcularCantidad = (itemId, precio, categoria) => {
    const totalProducto = preciosTotales[itemId] || 0;
    const newMinimo = categoria === 2 ? 10 : 1;
    return totalProducto > 0
      ? Math.max(Math.floor(totalProducto / precio), newMinimo)
      : newMinimo;
  };

  const EnviarPedido = async (total) => {
    if (cartItems) {
      const Pedido = {
        id_usuario: id,
        monto_total: total,
        productos: cartItems,
        estado: "Pendiente",
      };

      const PedidoUsuario = await fetch("http://localhost:5000/nuevo-pedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Pedido),
      });
      const PedidoResponse = await PedidoUsuario.json();

      if (PedidoResponse.success) {
        alert("Compra realizada: " + PedidoResponse.message);
      } else {
        alert("No se pudo realizar la compra: " + PedidoResponse.message);
      }
    } else {
      alert("el carrito esta vacio");
    }
  };
  return (
    <div className="modal-content-carrito">
      <h2>Carrito de compras</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="carrito-item">
            <div className="carrito-item__imagen">
              <img
                src={`http://localhost:5000/${item.url_imagen}`}
                alt={`Imagen de ${item.nombre_producto}`}
              />
            </div>
            <div className="carrito-item__inner">
              <h3 className="carrito-item__nombre">{item.nombre_producto}</h3>
              <p className="carrito-item__precio">
                Precio por unidad: ${item.precio}
              </p>
              <p className="carrito-item__subtotal">
                Subtotal: $
                {item.id in preciosTotales ? preciosTotales[item.id] : 0}
              </p>
              <div className="carrit_acciones">
                <button
                  className="carrito-item__disminuir"
                  onClick={() =>
                    aumentar(
                      item.id,
                      item.existencias,
                      item.id_categoria,
                      -1,
                      item.precio
                    )
                  }
                >
                  -
                </button>
                <p className="carrito-item__cantidad">
                  {calcularCantidad(item.id, item.precio, item.id_categoria)}
                </p>
                <button
                  className="carrito-item__aumentar"
                  onClick={() =>
                    aumentar(
                      item.id,
                      item.existencias,
                      item.id_categoria,
                      1,
                      item.precio
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p>Total del carrito: ${total}</p>
      <div className="modal-carrito__acciones">
        <button
          onClick={() => {
            EnviarPedido(total);
          }}
        >
          Comprar
        </button>
        {/* <Link to={"/login"}></Link> */}
        <button
          onClick={() => {
            vaciarCarrito();
          }}
        >
          Vaciar Carrito
        </button>
      </div>
    </div>
  );
};

export default Carrito;

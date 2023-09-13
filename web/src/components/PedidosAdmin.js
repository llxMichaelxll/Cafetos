import React, { useState, useEffect } from "react";
import "../styles/pedidos.css";
import { Link } from "react-router-dom";

const PedidosAdmin = () => {
  //   const { idUsuario } = useCart(); // Accede al idUsuario desde el contexto
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Realizar la solicitud GET para obtener los pedidos del usuario
    fetch("http://localhost:5000/traer-pedidos-admin/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPedidos(data);
      })
      .catch((error) => {
        console.error("Error al obtener los pedidos:", error);
      });
    console.log("esto:", pedidos);
  }, []); // Asegúrate de incluir idUsuario en la lista de dependencias

  return (
    <div className="targeta__pedidos-container">
      <h1>Pedidos</h1>
      {pedidos.map((pedido) => (
        <div key={pedido.id_pedido} className="targeta__pedidos">
          <div className="targeta__pedidos__contenido">
            <p><strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleDateString()}</p>
            <p><strong>Monto Total:</strong> {parseFloat(pedido.monto_total).toFixed(2)}</p>
            <p><strong>Estado:</strong> {pedido.estado}</p>
            <button>Cambiar estado del pedido</button>
          </div>
          <div className="targeta__pedidos__producto">
            {JSON.parse(pedido.productos).map((producto, index) => (
              <div key={index}>
                <img className="targeta__pedidos__producto-img"
                  src={`http://localhost:5000/${producto.url_imagen}`}
                  alt={`Imagen de ${producto.nombre_producto}`}
                />
                <p>{producto.nombre_producto}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Link to="/menu-admin"><button className="pedidos__button-atras">Atras</button></Link>
    </div>
  );
};

export default PedidosAdmin;

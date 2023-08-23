import React, { useState, useEffect } from "react";
import '../styles/pedidos.css'

const PedidosAdmin = () => {
//   const { idUsuario } = useCart(); // Accede al idUsuario desde el contexto
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Realizar la solicitud GET para obtener los pedidos del usuario
    fetch('http://localhost:5000/traer-pedidos-admin/')
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
    <div>
      {pedidos.map((pedido) => (
        <div key={pedido.id_pedido} className="targeta.pedidos">
          <p>Fecha: {new Date(pedido.fecha_pedido).toLocaleDateString()}</p>
          <p>Monto Total: {parseFloat(pedido.monto_total).toFixed(2)}</p>
          <p>Estado: {pedido.estado}</p>
          <div className="targeta-producto">
            {JSON.parse(pedido.productos).map((producto, index) => (
              <div key={index}>
                <img src={`http://localhost:5000/${producto.url_imagen}`}
              alt={`Imagen de ${producto.nombre_producto}`} />
                <p>Nombre Producto: {producto.nombre_producto}</p>
              </div>
            ))}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default PedidosAdmin;
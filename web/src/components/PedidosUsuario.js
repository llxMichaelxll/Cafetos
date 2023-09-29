import React, { useState, useEffect } from "react";
import { useCart } from "../context/ContextCarrito";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/pedidos.css";

const PedidosUsuario = () => {
  //   const { idUsuario } = useCart(); // Accede al idUsuario desde el contexto
  const [pedidos, setPedidos] = useState([]);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [detallesPedido, setDetallesPedido] = useState({});

  // const {idUsuario} = useCart();
  const history = useNavigate();
  // Recuperar la cadena JSON del localStorage
  const userJSON = localStorage.getItem("user");

  // Convertir la cadena JSON a un objeto JavaScript
  const user = JSON.parse(userJSON);

  // Acceder al valor de id_usuario
  const idUsuario = user.id_usuario;

  const mostrarDetallesPedido = (detalles) => {
    const detallesObj = JSON.parse(detalles)

    setDetallesPedido(detallesObj);

  };

  //***************************************************** */
  useEffect(() => {
    // Realizar la solicitud GET para obtener los pedidos del usuario
    fetch(`http://localhost:5000/traer-pedidos-usuario/${idUsuario}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPedidos(data);
      })
      .catch((error) => {
        console.error("Error al obtener los pedidos:", error);
      });
    console.log("esto:", pedidos);
    console.log("usuario id: ", idUsuario);
  }, [idUsuario]); // Asegúrate de incluir idUsuario en la lista de dependencias

  return (
    <div className="targeta__pedidos-container">
      <h1>Pedidos</h1>
      {pedidos.map((pedido) => (
        <div key={pedido.id_pedido} className="targeta__pedidos">
          <div className="targeta__pedidos__contenido">
            <p className="pedidos-p">
               Fecha:{" "}{new Date(pedido.fecha_pedido).toLocaleDateString()}
            </p>
            <p className="pedidos-p">
               Monto Total:{" "}
              {parseFloat(pedido.monto_total).toFixed(2)}
              $
              
            </p>
            <p className="pedidos-p">
               Estado: {pedido.estado}
            </p>
            <button onClick={() => {mostrarDetallesPedido(pedido.detalles); mostrarDetalles?    setMostrarDetalles(false):setMostrarDetalles(true);
;
}}>
              Detalles
            </button>
          </div>
          {mostrarDetalles && (
            <div className="ventana-detalles">
              <div className="detalles-pedido">
              <p className="detalels-pedido-p">
                   Nombre del Cliente:{" "}
                  {detallesPedido[0].nombre_cliente}
                </p>
                <p className="detalels-pedido-p">
                   Correo Electrónico:{" "}
                  {detallesPedido[0].correo_electronico}
                </p>
                <p className="detalels-pedido-p">
                   Dirección: {detallesPedido[0].direccion}
                </p>
                <p className="detalels-pedido-p">
                   Ciudad: {detallesPedido[1]}
                </p>
                <div className="detalels-pedido-p p-div" onClick={()=>{mostrarDetalles?setMostrarDetalles(false):setMostrarDetalles(true)}}>Cerrar</div >
              </div>
            </div>
          )}

          <div className="targeta__pedidos__producto">
            {JSON.parse(pedido.productos).map((producto, index) => (
              <div key={index}>
                <img
                  className="targeta__pedidos__producto-img"
                  src={`http://localhost:5000/${producto.url_imagen}`}
                  alt={`Imagen de ${producto.nombre_producto}`}
                />
                <p className="pedidos-p">{producto.nombre_producto}</p>
                <p className="pedidos-p">Cantidad:  {producto.cantidad}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          history("/");
        }}
        className="pedidos__button-atras"
      >
        Atras
      </button>
    </div>
  );
};

export default PedidosUsuario;

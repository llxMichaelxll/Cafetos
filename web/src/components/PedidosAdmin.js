
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pedidos.css";

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [detallesPedido, setDetallesPedido] = useState({});
  const [Alerta, setAlerta] = useState(false);
  const [texAlert, SetTexAlert] = useState("");
  const [clase, stepClase] = useState("");  // const [nuevoEstado, setNuevoEstado] = useState(""); // Nuevo estado seleccionado

  const history = useNavigate();

  const mostrarDetallesPedido = (detalles) => {
    const detallesObj = JSON.parse(detalles);
    setDetallesPedido(detallesObj);
    setMostrarDetalles(!mostrarDetalles); // Alternar el estado de mostrarDetalles
  };

  useEffect(() => {
    // Realizar la solicitud GET para obtener los pedidos del administrador
    fetch("http://localhost:5000/traer-pedidos-admin/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPedidos(data);
      })
      .catch((error) => {
        console.error("Error al obtener los pedidos:", error);
      });
  }, []); // No hay dependencias ya que no se espera que cambien


  const enviarEstado = (idPedido, nuevoEstado) => {
    console.log(idPedido);
    console.log(nuevoEstado)
    // Realiza la solicitud de actualización al servidor
    fetch(`http://localhost:5000/actualizar-estado/${idPedido}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.success){
          SetTexAlert("Estado Actualizado");
          stepClase("alerta-verde-estado");
          setAlerta(true);
  
          // Actualiza el estado de los pedidos aquí
          setPedidos((prevPedidos) =>
            prevPedidos.map((pedido) =>
              pedido.id_pedido === idPedido
                ? { ...pedido, estado: nuevoEstado }
                : pedido
            )
          );
  
          setTimeout(() => {
            setAlerta(false);
          }, 3000);
        
        }
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
      });
  };

  return (
    <div className="targeta__pedidos-container">
      <h1>Pedidos del Administrador</h1>
      {pedidos.map((pedido) => (
        <div key={pedido.id_pedido} className="targeta__pedidos">
          <div className="targeta__pedidos__contenido">
            <p className="pedidos-p">
              Fecha:{" "}
              {new Date(pedido.fecha_pedido).toLocaleDateString()}
            </p>
            <p className="pedidos-p">
              Monto Total:{"  "}
              {parseFloat(pedido.monto_total).toFixed(2)}
              $
            </p>
            <p className="pedidos-p">
              Estado: {" "}{pedido.estado}
            </p>
            <select className="select-pedido"
             s onChange={(e) => {
                if (
                  e.target.value === "Enviado" ||
                  e.target.value === "Entregado"
                ) {
                  enviarEstado(pedido.id_pedido, e.target.value); // Llama a enviarEstado si se seleccionó "Enviado" o "Entregado"
                }
              }}
            >
              <option>Cambiar estado</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
            </select>
            <button onClick={() => mostrarDetallesPedido(pedido.detalles)}>
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
                <div
                  className="detalels-pedido-p p-div"
                  onClick={() => mostrarDetallesPedido(pedido.detalles)} // Alternar el estado de mostrarDetalles
                >
                  Cerrar
                </div>
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
                <p className="pedidos-p">Cantidad: {producto.cantidad}</p>
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
      {Alerta&&<p className={clase}>{texAlert}</p>}
    </div>
  );
};

export default PedidosAdmin;

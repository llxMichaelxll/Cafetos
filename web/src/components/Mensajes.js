import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import "../styles/mensajes.css";

function Mensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [notification, setNotification] = useState("");
  const [notification2, setNotification2] = useState("");
  const history = useNavigate();

  useEffect(() => {
    async function fetchMensajes() {
      try {
        const response = await fetch("http://localhost:5000/obtener-mensajes");
        const data = await response.json();
        setMensajes(data);
      } catch (error) {
        console.error("Error al obtener mensajes:", error);
      }
    }

    fetchMensajes();
  }, []);

  const eliminarMensaje = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que deseas eliminar este mensaje?"
      );
      if (confirmDelete) {
        const response = await fetch(
          `http://localhost:5000/eliminar-mensaje/${id}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (data.success) {
          const updatedMensajes = mensajes.filter(
            (mensaje) => mensaje.id !== id
          );
          setMensajes(updatedMensajes);
        } else {
          console.error("Error al eliminar el mensaje:", data.message);
        }
      }
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }
  };

  const handleReply = (mensaje) => {
    setShowReplyBox(true);
    setSelectedMessage(mensaje);
  };

  const handleCloseReply = () => {
    setShowReplyBox(false);
    setSelectedMessage(null);
    setReplyText("");
  };

  const handleSendReply = async () => {
    try {
      const response = await fetch("http://localhost:5000/enviar-respuesta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: selectedMessage.correo,
          mensaje: replyText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification("Mensaje enviado con éxito");
        setTimeout(() => setNotification(""), 3000); // Limpia la notificación después de 3 segundos
        handleCloseReply();
      } else {
        setNotification2("Error al enviar respuesta");
        setTimeout(() => setNotification2(""), 3000);
      }
    } catch (error) {
      console.error("Error al enviar el correo de respuesta:", error);
    }
  };

  return (
    <div className="mensajes-container">
      <h2 className="mensajes-h2">Mensajes Guardados</h2>
      <p onClick={()=>{history('/')}} className="mensajes-p">Volver</p>
      <ul className="menu-mensaje-ul">
        {mensajes.map((mensaje) => (
          <li key={mensaje.id} className="mensaje-item">
            <p className="mensaje-menu-p">Nombre: {mensaje.nombre}</p>
            <p className="mensaje-menu-p">Correo: {mensaje.correo}</p>
            <p className="mensaje-menu-p">Asunto: {mensaje.asunto}</p>
            <p className="mensaje-menu-p">Solicitud: {mensaje.solicitud}</p>
            <p className="mensaje-menu-p">
              Fecha de Creación: {mensaje.fecha_creacion}
            </p>{" "}
            <button className="button-mensaje b-eliminar" onClick={() => eliminarMensaje(mensaje.id)}>
              Eliminar
            </button>
            <button className="button-mensaje b-responder" onClick={() => handleReply(mensaje)}>Responder</button>
          </li>
        ))}
      </ul>
      {showReplyBox && (
        <div className="reply-box">
          <textarea className="textarea-mensaje"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Responder a ${selectedMessage?.correo}`}
          />
          <div className="button-group">
            <button className="button-mensaje" onClick={handleSendReply}>Enviar</button>
            <button className="button-mensaje" onClick={handleCloseReply}>Cerrar</button>
          </div>
        </div>
      )}
      {notification && <div className="notification">{notification}</div>}
      {notification2 && <div className="notification">{notification2}</div>}
    </div>
  );
}

export default Mensajes;

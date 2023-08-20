import React, { useEffect, useState } from 'react';
import '../styles/mensajes.css';

function Mensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    async function fetchMensajes() {
      try {
        const response = await fetch('http://localhost:5000/obtener-mensajes');
        const data = await response.json();
        setMensajes(data);
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
      }
    }

    fetchMensajes();
  }, []);

  const eliminarMensaje = async (id) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este mensaje?');
      if (confirmDelete) {
        const response = await fetch(`http://localhost:5000/eliminar-mensaje/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          const updatedMensajes = mensajes.filter((mensaje) => mensaje.id !== id);
          setMensajes(updatedMensajes);
        } else {
          console.error('Error al eliminar el mensaje:', data.message);
        }
      }
    } catch (error) {
      console.error('Error al eliminar el mensaje:', error);
    }
  };

  const handleReply = (mensaje) => {
    setShowReplyBox(true);
    setSelectedMessage(mensaje);
  };

  const handleCloseReply = () => {
    setShowReplyBox(false);
    setSelectedMessage(null);
    setReplyText('');
  };

  const handleSendReply = async () => {
    try {
      const response = await fetch('http://localhost:5000/enviar-respuesta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: selectedMessage.correo,
          mensaje: replyText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification('Mensaje enviado con éxito');
        setTimeout(() => setNotification(''), 3000); // Limpia la notificación después de 3 segundos
        handleCloseReply();
      } else {
        console.error('Error al enviar el correo de respuesta:', data.message);
      }
    } catch (error) {
      console.error('Error al enviar el correo de respuesta:', error);
    }
  };

  return (
    <div className="mensajes-container">
      <h2>Mensajes Guardados</h2>
      <ul>
        {mensajes.map((mensaje) => (
          <li key={mensaje.id} className="mensaje-item">
<p>Nombre: {mensaje.nombre}</p>
            <p>Correo: {mensaje.correo}</p>
            <p>Asunto: {mensaje.asunto}</p>
            <p>Solicitud: {mensaje.solicitud}</p>
            <p>Fecha de Creación: {mensaje.fecha_creacion}</p>            <button onClick={() => eliminarMensaje(mensaje.id)}>Eliminar</button>
            <button onClick={() => handleReply(mensaje)}>Responder</button>
          </li>
        ))}
      </ul>
      {showReplyBox && (
        <div className="reply-box">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Responder a ${selectedMessage?.correo}`}
          />
          <div className="button-group">
            <button onClick={handleSendReply}>Enviar</button>
            <button onClick={handleCloseReply}>Cerrar</button>
          </div>
        </div>
      )}
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default Mensajes;

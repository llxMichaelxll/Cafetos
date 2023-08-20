import React, { useState } from 'react';
import '../styles/contacto.css'; // Importar el archivo CSS para estilos

function Contacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [solicitud, setSolicitud] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensajeRespuesta, setMensajeRespuesta] = useState('');

  const handleEnviarMensaje = async () => {
    try {
      const response = await fetch('http://localhost:5000/guardar-mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          correo,
          solicitud,
          asunto,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMensajeRespuesta('Mensaje enviado exitosamente');
      } else {
        setMensajeRespuesta('Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setMensajeRespuesta('Error al enviar el mensaje');
    }
  };


  return (
    <div className="contacto-container">
      <h2>Contacto</h2>
      <label>
        Asunto:
        <input
          type="text"
          value={asunto}
          onChange={(e) => {
            setAsunto(e.target.value);
          }}
        />
      </label>
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
          }}
        />
      </label>

      <label>
        Correo:
        <input
          type="email"
          value={correo}
          onChange={(e) => {
            setCorreo(e.target.value);
          }}
        />
      </label>

      <label>
        Solicitud:
        <textarea
          value={solicitud}
          onChange={(e) => {
            setSolicitud(e.target.value);
          }}
        />
      </label>

      <button onClick={handleEnviarMensaje}>Enviar</button>
      {mensajeRespuesta && <p>{mensajeRespuesta}</p>}
    </div>
  );
}

export default Contacto;

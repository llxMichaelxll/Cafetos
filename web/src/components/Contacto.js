import React, { useState } from 'react';
import '../styles/contacto.css'; // Importar el archivo CSS para estilos

function Contacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [solicitud, setSolicitud] = useState('');

  return (
    <div className="contacto-container">
      <h2>Contacto</h2>
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

      <button>Enviar</button>
    </div>
  );
}

export default Contacto;

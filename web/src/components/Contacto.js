import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/contacto.css"; // Importar el archivo CSS para estilos

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [solicitud, setSolicitud] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensajeRespuesta, setMensajeRespuesta] = useState("");
  const [alerta,setAlerta] = useState('');
  const [mostrarAlerta,setMostrarAlerta] = useState(null)
  const [mostrarRespuesta, setMostrarRespuesta] = useState(null);
  const history = useNavigate();

  const handleEnviarMensaje = async () => {

    const reset=()=>{
      setNombre('');
      setAsunto('');
      setSolicitud('');
      setCorreo('');
    }
   if(!correo || !nombre || !asunto || !solicitud){
    setAlerta('Debes de completar todos los campos')
    setMostrarAlerta(true);
        setTimeout(() => {
          setMostrarAlerta(false);
        }, 3000);
   }else if(!correo.includes("@")){
    setAlerta('El correo debe de tener @');
    setMostrarAlerta(true)
        setTimeout(() => {
          setMostrarAlerta(false);
        }, 3000);
   }else{
    try {
      const response = await fetch("http://localhost:5000/guardar-mensaje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        setMensajeRespuesta("Mensaje enviado exitosamente");
        setMostrarRespuesta(true);
        setTimeout(() => {
          setMostrarRespuesta(false);
        }, 3000);
        setTimeout(()=>{
          reset()},3000
        )
      } else {
        setMensajeRespuesta("Error al enviar el mensaje");
        setMostrarRespuesta(true);
        setTimeout(() => {
          setMostrarRespuesta(false);
        }, 3000);
        setTimeout(()=>{
          reset()},3000
        )
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setMensajeRespuesta("Error al enviar el mensaje");
    }
   }
  };

  return (

    <div className="container-total">
      <div className="contacto-container">
      <h2 className="Contacto-h2">Contacto</h2>
      <label className="contacto-label">
        Asunto *
        <input
          type="text"
          value={asunto}
          onChange={(e) => {
            setAsunto(e.target.value);
          }}
        />
      </label>
      <label className="contacto-label">
        Nombre *
        <input
          type="text"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
          }}
        />
      </label>

      <label className="contacto-label">
        Correo *
        <input
          type="email"
          value={correo}
          onChange={(e) => {
            setCorreo(e.target.value);
          }}
        />
      </label>

      <label className="contacto-label">
        Solicitud *
        <textarea
          value={solicitud}
          onChange={(e) => {
            setSolicitud(e.target.value);
          }}
        />
      </label>

      <button
        className=" contacto-botones contatcto-enviar-boton"
        onClick={handleEnviarMensaje}
      >
        Enviar
      </button>
      <button
        className=" contacto-botones contatcto-atras-boton"
        onClick={() => history("/")}
      >
        Atras
      </button>
      {mostrarRespuesta && <p className="respuesta-p">{mensajeRespuesta}</p>}
      {mostrarAlerta && <p className="respuesta-error-p">{alerta}</p>}
    </div>

    </div>  );
}

export default Contacto;

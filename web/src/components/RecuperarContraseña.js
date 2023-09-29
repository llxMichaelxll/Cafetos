import React, { useState } from 'react';
import '../styles/recuprarContraseña.css';
import { useNavigate } from "react-router-dom";





const RecuperarContraseña = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [Alerta, setAlerta] = useState(false)
  const [texAlert,SetTexAlert] = useState('');
  const[clase,setClase] = useState('')
  const history = useNavigate()

  const handleEnviarCorreo = async () => {
   if(!email){
      SetTexAlert('debes completar el campo')
      setClase('alerta-roja-recu')
      setAlerta(true)
      setTimeout(()=>{setAlerta(false)},2000)
   }else if(!email.includes('@')){
    setClase('alerta-roja-recu')
    SetTexAlert('el correo debe de tener el @')
    setAlerta(true)
      setTimeout(()=>{setAlerta(false)},2000)
   }
   else{
    try {
      const response = await fetch(`http://localhost:5000/recuperar-contrasena/${email}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        setMostrarCodigo(true);
        setClase('alerta-info-recu')
        SetTexAlert('se ha enviado un codigo de validacion a tu correo');
        setAlerta(true);
        setTimeout(()=>{
          setAlerta(false)
        },3000)

      } else {
        setClase('alerta-roja-recu')
        SetTexAlert(data.message);
        setAlerta(true);
        setTimeout(()=>{
          setAlerta(false)
        },2000)
      }
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      SetTexAlert('Error al enviar el correo de recuperación');
      setClase('alerta-roja-recu');
        setAlerta(true);
        setTimeout(()=>{
          setAlerta(false)
        },2000)
    }
   }
  };

  const handleRecuperarContraseña = async () => {
    try {
      const response = await fetch('http://localhost:5000/verificar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, codigo, nuevaContraseña }),
      });

      const data = await response.json();

      if (data.success) {
        // Una vez verificado el código, puedes redirigir al usuario a la página de inicio de sesión o a donde necesites
        setClase('alerta-verde-recu')
        SetTexAlert(data.message);
        setAlerta(true)
        setTimeout(()=>{setAlerta(false);history('/')},2000)
      } else {
        SetTexAlert(data.message);
        setAlerta(true)
      setTimeout(()=>{setAlerta(false);},2000)
      }
    } catch (error) {
      console.error('Error al recuperar la contraseña:', error);
      alert('Error al recuperar la contraseña');
    }
  };

  return (
    <div className='Contenedor-recuperar-contraseña'>
      <h2>Recuperación de Contraseña</h2>
      {!mostrarCodigo && (
        <div className='recupuperar-contraseña-div'>
          <label className='recuperar-contraseña-label'>Ingrese su correo Electrónico</label>
          <input className='recuperar-contraseña-input' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className='b-enviar recuperar-contraseña-button' onClick={handleEnviarCorreo}>Enviar Correo de Recuperación</button>
          <button onClick={()=>history('/')} className='b-cancelar recuperar-contraseña-button' >Cancelar</button>
        </div>
      )}
      {mostrarCodigo && (
        <div className='recupuperar-contraseña-div'>
          <label className='recuperar-contraseña-label'>Código de Recuperación</label>
          <input className='recuperar-contraseña-input' type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          {!mostrarFormulario ? (
            <>
            <button className='b-enviar recuperar-contraseña-button' onClick={() => setMostrarFormulario(true)}>Continuar</button>
            <button onClick={()=>history('/')} className='b-cancelar recuperar-contraseña-button' >Cancelar</button>
            </>
          ) : (
            <div className='recupuperar-contraseña-div'>
              <label className='recuperar-contraseña-label'>Nueva Contraseña</label>
              <input className='recuperar-contraseña-input2'
                type="password"
                value={nuevaContraseña}
                onChange={(e) => setNuevaContraseña(e.target.value)}
              />
              <button className='b-enviar recuperar-contraseña-button' onClick={handleRecuperarContraseña}>Recuperar Contraseña</button>
            </div>
          )}
        </div>
      )}
      {Alerta&&<p className={clase}>{texAlert}</p>}
    </div>
  );
};

export default RecuperarContraseña;

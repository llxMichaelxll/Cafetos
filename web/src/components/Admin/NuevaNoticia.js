import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/NuevaNoticia.css'

const NuevaNoticia = () => {
  const [encabezado, setEncabezado] = useState('');
  const [urlImagen, setUrlImagen] = useState('');
  const [textoNoticia, setTextoNoticia] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const history = useNavigate();
  const [Alerta, setAlerta] = useState(false);
  const [texAlert, setTexAlert] = useState("");
  const [clase, setClase] = useState("");

  const handleImageChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const limpiar = () =>{
      setEncabezado('');
      setTextoNoticia('');
      setSelectedFile(null);


    }

    if (!encabezado || !selectedFile || !textoNoticia) {
      setTexAlert('Por favor complete todos los campos');
      setClase('alerta-roja-noticia');
      setAlerta(true);
      setTimeout(()=>{
        setAlerta(false)
      },2000)
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/uploadFiles', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();
        
        setUrlImagen(data.url);

        // Ahora podemos continuar con el proceso de agregar la noticia
        const nuevaNoticia = {
          encabezado,
          url_imagen: data.url,
          texto_noticia: textoNoticia,
        };

        const noticiaResponse = await fetch('http://localhost:5000/nueva-noticia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevaNoticia),
        });

        if (noticiaResponse.status === 201) {
          setTexAlert('Noticia agregada correctamente');
          setClase('alerta-verde-noticia');
          setAlerta(true);
          setTimeout(()=>{
            setAlerta(false);
            limpiar();
          },2000)
        } else {
          setTexAlert('Error al agregar la noticia');
          setClase('alerta-roja-noticia');
          setAlerta(true);
          setTimeout(()=>{
            setAlerta(false)
          },2000)
        }
      } else {
        setAlerta('Error al subir la imagen');
        setClase('alerta-roja-noticia');
          setAlerta(true);
          setTimeout(()=>{
            setAlerta(false)
          },2000)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='contenedor-nuevaNoticia'>
      <h2 className='nuevaNoticia-h2'>Agregar Nueva Noticia</h2>
      <form className='nuevaNoticia-form' onSubmit={handleSubmit}>
        <div className='contenedor-info'>
          <label className='nuevaNoticia-label'>Encabezado:</label>
          <input className='nuevaNoticia-input'
            type="text"
            value={encabezado}
            onChange={(e) => setEncabezado(e.target.value)}
          />
        </div>
        <div className='contenedor-info'>
          <label className='nuevaNoticia-label'>Imagen:</label>
          <input className='nuevaNoticia-input' type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className='contenedor-info'>
          <label className='nuevaNoticia-label'>Texto de la Noticia:</label>
          <textarea className='nuevaNoticia-textarea'
            value={textoNoticia}
            onChange={(e) => setTextoNoticia(e.target.value)}
          />
        </div>
        <button className='button-nuevaNoticia' type="submit">Agregar Noticia</button>

        <button onClick={()=>{history('/noticias')}} className='button-nuevaNoticia' type="button">Atras</button>
      </form>
      {Alerta&&<p className={clase}>
          {texAlert}
        </p>}
    </div>
  );
};

export default NuevaNoticia;

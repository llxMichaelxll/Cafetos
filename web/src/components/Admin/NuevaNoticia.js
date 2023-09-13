import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NuevaNoticia = () => {
  const [encabezado, setEncabezado] = useState('');
  const [urlImagen, setUrlImagen] = useState('');
  const [textoNoticia, setTextoNoticia] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const history = useNavigate()

  const handleImageChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!encabezado || !selectedFile || !textoNoticia) {
      console.error('Por favor complete todos los campos');
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
        console.log('Imagen subida con éxito:', data.url);
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
          console.log('Noticia agregada correctamente');
          // Lógica para redirigir o mostrar un mensaje de éxito
          history('/noticias')
        } else {
          console.error('Error al agregar la noticia');
        }
      } else {
        console.error('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Agregar Nueva Noticia</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Encabezado:</label>
          <input
            type="text"
            value={encabezado}
            onChange={(e) => setEncabezado(e.target.value)}
          />
        </div>
        <div>
          <label>Imagen:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <label>Texto de la Noticia:</label>
          <textarea
            value={textoNoticia}
            onChange={(e) => setTextoNoticia(e.target.value)}
          />
        </div>
        <button type="submit">Agregar Noticia</button>
      </form>
    </div>
  );
};

export default NuevaNoticia;

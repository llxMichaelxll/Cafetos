import React, { useState, useEffect } from 'react';
import { useCart } from '../context/ContextCarrito'; 
import { Link } from 'react-router-dom';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ encabezado: '', url_imagen: '', texto_noticia: '' });
  const {admind} = useCart()


  useEffect(() => {
    // Aquí puedes realizar la llamada a la API para obtener las noticias
    fetch('http://localhost:5000/noticias')  // Asegúrate de que la ruta coincida con tu servidor
      .then(response => response.json())
      .then(data => setNoticias(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);

    // Encuentra la noticia actual y prellena los datos
    const noticiaActual = noticias.find(noticia => noticia.id === id);
    if (noticiaActual) {
      setEditedData({ ...noticiaActual });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/editar-noticia/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(editedData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Realizar alguna acción después de la edición exitosa
        setEditingId(null);
        setEditedData({ encabezado: '', url_imagen: '', texto_noticia: '' });
      } else {
        console.error('Error al editar la noticia');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/eliminar-noticia/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNoticias(noticias.filter(noticia => noticia.id !== id));
      } else {
        console.error('Error al eliminar la noticia');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
  <div>
    <h1>Noticias</h1>
    
    <ul>
      {noticias.map(noticia => (
        <li key={noticia.id}>
          {editingId === noticia.id ? (
            <div>
              <input
                type="text"
                value={editedData.encabezado}
                onChange={(e) => setEditedData({ ...editedData, encabezado: e.target.value })}
              />
              <input
                type="text"
                value={editedData.url_imagen}
                onChange={(e) => setEditedData({ ...editedData, url_imagen: e.target.value })}
              />
              <textarea
                value={editedData.texto_noticia}
                onChange={(e) => setEditedData({ ...editedData, texto_noticia: e.target.value })}
              />
              <button onClick={handleSaveEdit}>Guardar</button>
            </div>
          ) : (
            <div>
              <h2>{noticia.encabezado}</h2>
              <img src={`http://localhost:5000/${noticia.url_imagen}`}
              alt={`Imagen de ${noticia.nombre_producto}`} />
              <p>{noticia.texto_noticia}</p>
              
              {admind && (
                <div>
                  <button onClick={() => handleEdit(noticia.id)}>Editar</button>
                  <button onClick={() => handleDelete(noticia.id)}>Eliminar</button>
                </div>
              )}
              {admind && <Link to="/Nnoticia"><button>Nueva Noticia</button></Link>}
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);

};

export default Noticias;

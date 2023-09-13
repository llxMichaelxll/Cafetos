import React, { useState, useEffect } from 'react';
import { useCart } from '../context/ContextCarrito'; 
import { Link } from 'react-router-dom';
import '../styles/noticias.css'
import { useNavigate } from 'react-router-dom';{}
 
const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ encabezado: '', url_imagen: '', texto_noticia: '' });
  const {admind} = useCart()
  const history = useNavigate()


  const Atras=()=>{
    history('/')
  }
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
  <div className='noticias-container'>
    <h1>Noticias</h1>
    
    <ul className='noticias__menu'>
      {noticias.map(noticia => (
        <li className='noticias__menu-li' key={noticia.id}>
          {editingId === noticia.id ? (
            <div className='editar-noticia'>
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
            <div className='noticas__menu-noticia'>
              <img className='noticias__menu-noticia-img' src={`http://localhost:5000/${noticia.url_imagen}`}
              alt={`Imagen de ${noticia.nombre_producto}`} />
              <div className='noticias__menu-contenido'>
              <h2>{noticia.encabezado}</h2>
              <p>{noticia.texto_noticia}</p>
              </div>
              {admind && (
                <div className='noticias__menu__botones'>
                  <button className='noticias__menu__botones-botones' onClick={() => handleEdit(noticia.id)}>Editar</button>
                  <button className='last noticias__menu__botones-botones' onClick={() => handleDelete(noticia.id)}>Eliminar</button>
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
    {admind && <>
      <Link to="/Nnoticia"><button className='  noticias__menu__botones-botones'>Nueva Noticia</button></Link>
      </>}
      <button onClick={()=>{Atras()}} className='last noticias__menu__botones-botones'>Atras</button>
    
  </div>
);

};

export default Noticias;

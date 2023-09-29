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
  const [Alerta, setAlerta] = useState(false);
  const [texAlert, SetTexAlert] = useState("");
  const [clase, stepClase] = useState("");


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
    if( editedData.encabezado === "" ||
    editedData.url_imagen === "" ||
    editedData.texto_noticia === ""){
      SetTexAlert('debes completar todos los campos');
      stepClase('alerta-roja-editar');
      setAlerta(true);
      setTimeout(()=>{setAlerta(false)},2000)
      return;
    }else{
    try {
      const response = await fetch(`http://localhost:5000/editar-noticia/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(editedData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {

        SetTexAlert('Noticia actualizada');
        stepClase('alerta-verde-editar');
        setAlerta(true);
        setTimeout(()=>{setAlerta(false)},2000)
        
        setEditingId(null);
        setEditedData({ encabezado: '', url_imagen: '', texto_noticia: '' });
      } else {
        SetTexAlert('Error al editar la noticia');
        stepClase('alerta-roja-editar');
        setAlerta(true);
        setTimeout(()=>{setAlerta(false)},2000)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/eliminar-noticia/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNoticias(noticias.filter(noticia => noticia.id !== id));
        SetTexAlert('Noticia eliminada');
        stepClase('alerta-verde-editar');
        setAlerta(true);
        setTimeout(()=>{setAlerta(false)},2000)
      } else {
        SetTexAlert('Error al eliminar la noticia');
        stepClase('alerta-roja-editar');
        setAlerta(true);
        setTimeout(()=>{setAlerta(false)},2000)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
  <div className='noticias-container'>

    <h1 className='noticias-container-h1'>Noticias</h1>

    <p onClick={()=>{history('/')}} className="Notic-p">Volver</p>
    <ul className='noticias__menu'>
      {noticias.map(noticia => (
        <li className='noticias__menu-li' key={noticia.id}>
          {editingId === noticia.id ? (
            <div className='covertor-editar'>
              <div className='editar-noticia'>
                <label className='label-editar'>Titulo</label>
              <input className='noticia-input'
                type="text"
                value={editedData.encabezado}
                onChange={(e) => setEditedData({ ...editedData, encabezado: e.target.value })}
              />
              <label className='label-editar'>Contenido</label>
              <input className='nada'
                type="text"
                value={editedData.url_imagen}
                onChange={(e) => setEditedData({ ...editedData, url_imagen: e.target.value })}
              />
              <textarea className='noticia-textarea'
                value={editedData.texto_noticia}
                onChange={(e) => setEditedData({ ...editedData, texto_noticia: e.target.value })}
              />
              <button className='button-guardar' onClick={handleSaveEdit}>Guardar</button>
              <button className='button-cancelar' onClick={()=>setEditingId('')}>Cancelar</button>
            </div>
            </div>
          ) : (
            <div className='noticas__menu-noticia'>
              <img className='noticias__menu-noticia-img' src={`http://localhost:5000/${noticia.url_imagen}`}
              alt={`Imagen de ${noticia.nombre_producto}`} />
              <div className='noticias__menu-contenido'>
              <h2>{noticia.encabezado}</h2>
              <p className='p-noticia'>{noticia.texto_noticia}</p>
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
      {Alerta&&<p className={clase}>
                {texAlert}</p>}
    </ul>
    {admind && <>
      <Link to="/Nnoticia"><button className='  noticias__menu__botones-botones'>Nueva Noticia</button></Link>
      </>}
      <button onClick={()=>{Atras()}} className='last noticias__menu__botones-botones'>Atras</button>    
  </div>
);

};

export default Noticias;

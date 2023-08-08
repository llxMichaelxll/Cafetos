import React, { useEffect, useState } from 'react';
import './styles/NuevoProducto.css'
import { Link } from 'react-router-dom';

const NuevoProducto = () => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [precio, setPrecio] = useState();
  const [imagen, setImagen] = useState(null);
  const [urlImagen, setUrlImagen] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [existencias,setExistecias] = useState('');

  useEffect(() => {
    // Obtener la lista de categorías desde el servidor al cargar el componente
    fetch('http://localhost:5000/categorias')
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error('Error al obtener la lista de categorías:', error));
  }, []);

  const resetForm = () => {
    setNombreProducto('');
    setDescripcion('');
    setIdCategoria('');
    setPrecio('');
    setUrlImagen('');
    setExistecias('');
  };

  const handleUploadImageAndSaveProduct = async (e) => {
    e.preventDefault();

    try {
      if (!imagen) {
        console.error('Error al subir la imagen: No se ha seleccionado un archivo');
        return;
      }
      else if(!nombreProducto|| !descripcion || !idCategoria || !precio || !urlImagen || !categorias || !existencias)
      {
        
      }

      const formData = new FormData();
      formData.append('file', imagen);

      const response = await fetch('http://localhost:5000/uploadFiles', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.status === 200) {
         console.log('Imagen subida con éxito:', data.url);

        // Actualizamos el estado con la URL de la imagen generada
        setUrlImagen(data.url);

        // Creamos un objeto con los datos del producto
        const dataProducto = {
          nombre_producto: nombreProducto,
          descripcion: descripcion,
          precio: precio,
          id_categoria: idCategoria,
          url_imagen: data.url, // Usamos la URL generada para la imagen
          existencias: existencias,
        };

        // Realizamos la solicitud POST al backend para guardar el nuevo producto
        const responseProducto = await fetch('http://localhost:5000/productos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Indicamos que estamos enviando JSON en el cuerpo de la solicitud
          },
          body: JSON.stringify(dataProducto), // Convertimos el objeto a JSON y lo enviamos en el cuerpo
        });

        const dataProductoResponse = await responseProducto.json();

        // Verificamos si el registro fue exitoso
        if (dataProductoResponse.success) {
          alert('Producto guardado:', dataProductoResponse.message);
          // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito

          resetForm()
        } else {
          alert.error('Error al guardar producto:', dataProductoResponse.message);
          // Aquí puedes mostrar un mensaje de error al usuario si el registro no fue exitoso
        }
      } else {
        console.error('Error al subir la imagen:', data.message);
      }
    } catch (error) {
      console.error('Error al subir la imagen o guardar el producto:', error);
    }
  };

  return (
    <div className='nuevo-producto-container'>
      <h2>Agregar Nuevo Producto</h2>
      <form onSubmit={handleUploadImageAndSaveProduct}>
      <div>
          <label>Nombre del Producto:</label>
          <input
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
          />
        </div>
        <div><label>Precio</label> <input type='number' value={precio} onChange={(e)=>setPrecio(e.target.value)}></input></div>

        <div><label>Existencias</label> <input type='number' value={existencias} onChange={(e)=>setExistecias(e.target.value)}></input></div>
        <div>
          <label>Descripción:</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div>
          <label>Imagen:</label>
          <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
        </div>
        <div>
          <label>Categoría:</label>
          <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)}>
            <option value="">Seleccionar Categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre_categoria}
              </option>
            ))}
          </select>
        </div>
        <div>
          {urlImagen && <p>Ruta de la imagen: {urlImagen}</p>}
          <button type="submit">Subir Imagen y Guardar Producto</button>
          <Link to="/menu-admin">Volver a la página de inicio</Link>
        </div>
      </form>
    </div>
  );
};

export default NuevoProducto;

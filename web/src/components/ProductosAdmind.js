// import React, { useEffect, useState } from 'react';
// import EditarProducto from './EditarProducto';
// import '../styles/productosConImagenes.css'

// const ProductosAdmin = () => {
//   const [productos, setProductos] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);
//   const [Alerta, setAlerta] = useState(false);
//   const [texAlert, SetTexAlert] = useState("");
//   const [clase, stepClase] = useState("");

//   useEffect(() => {
//     // Obtener la lista de productos desde el servidor al cargar el componente
//     fetch('http://localhost:5000/productos')
//       .then((response) => response.json())
//       .then((data) => {
//         setProductos(data); // Guardar los productos en el estado
//       })
//       .catch((error) => console.error('Error al obtener la lista de productos:', error));
//   }, [setProductos]);

//   const handleEliminarProducto = (idProducto) => {
//     const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
  
//     if (confirmDelete) {
//       // Realizar una solicitud DELETE al servidor para eliminar el producto
//       fetch(`http://localhost:5000/productos/${idProducto}`, {
//         method: 'DELETE',
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.success) {
//             // Actualizar la lista de productos después de eliminar
//             const updatedProducts = productos.filter((producto) => producto.id_producto !== idProducto);
//             SetTexAlert("Producto Eliminado");
//             stepClase("alerta-verde-editar-producto");
//             setAlerta(true);
//             setTimeout(() => {
//               setAlerta(false);
//             }, 2000);
//             setProductos(updatedProducts);
//           } else {
//             console.error('Error al eliminar el producto:', data.message);
//           }
//         })
//         .catch((error) => console.error('Error al eliminar el producto:', error));
//     }
//   };

//   const handleEditarProducto = (producto) => {
//     setEditProduct(producto);
// }

//   return (
//     <div>
//       <h2>Productos</h2>
//       <div className="productos-container">
//         {productos.map((producto) => (
//           <div className="producto-card" key={producto.id_producto}>
//             <h3 className='productosAdmin-h3'>{producto.nombre_producto}</h3>
//             <p className='productosAdmin-p'>Descripción: 
//             {producto.descripcion}</p>
//             <p className='productosAdmin-p'>Precio: 
//             {producto.precio}</p>
//             <p className='productosAdmin-p'>Existencias: 
//             {producto.existencias}</p>
//             <img
//               src={`http://localhost:5000/${producto.url_imagen}`}
//               alt={`Imagen de ${producto.nombre_producto}`}
//             />
//             <button className='productosAdmin-button' onClick={() => handleEditarProducto(producto)}>Editar</button>
//             <button className='productosAdmin-button' onClick={() => handleEliminarProducto(producto.id_producto)}>Eliminar</button>
//           </div>
//         ))}
//       </div>
//       {/* Renderizar el componente EditarProducto si editProduct está definido */}
//       {editProduct && (
//        <div className='covertor-editar-productos'>
//          <EditarProducto
//          Alerrta={Alerta}
//           producto={editProduct}
//           onEdit={(editedProduct) => {
//             console.log('Producto editado:', editedProduct);
//             setEditProduct(null); 
//           }}
//           onCancel={() => setEditProduct(null)}
//         />
//        </div>
//       )}
//       {Alerta&&<p className={clase}>
//         {texAlert}</p>}
//     </div>
//   );
// };

// export default ProductosAdmin;
import React, { useEffect, useState } from 'react';
import '../styles/productosConImagenes.css';

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [alerta, setAlerta] = useState({ mostrar: false, texto: '', clase: '' });

  const [editedProductData, setEditedProductData] = useState({
    nombre_producto: '',
    descripcion: '',
    precio: '',
    existencias: '',
    id_categoria: '', // Agregar id_categoria aquí
    url_imagen: '',
  });

  useEffect(() => {
    // Obtener la lista de productos desde el servidor al cargar el componente
    fetch('http://localhost:5000/productos')
      .then((response) => response.json())
      .then((data) => {
        setProductos(data); // Guardar los productos en el estado
      })
      .catch((error) => console.error('Error al obtener la lista de productos:', error));
  }, []);

  const handleEliminarProducto = (idProducto) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');

    if (confirmDelete) {
      // Realizar una solicitud DELETE al servidor para eliminar el producto
      fetch(`http://localhost:5000/productos/${idProducto}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Actualizar la lista de productos después de eliminar
            const updatedProducts = productos.filter((producto) => producto.id_producto !== idProducto);
            setAlerta({ mostrar: true, texto: 'Producto Eliminado', clase: 'alerta-verde-editar-producto' });

            setTimeout(() => {
              setAlerta({ mostrar: false, texto: '', clase: '' });
            }, 2000);

            setProductos(updatedProducts);
          } else {
            console.error('Error al eliminar el producto:', data.message);
          }
        })
        .catch((error) => console.error('Error al eliminar el producto:', error));
    }
  };

  const handleEditarProducto = (producto) => {
    setEditProduct(producto);
    // Establecer los datos del producto seleccionado en el formulario de edición
    setEditedProductData({
      nombre_producto: producto.nombre_producto,
      descripcion: producto.descripcion,
      precio: producto.precio,
      existencias: producto.existencias,
      id_categoria: producto.id_categoria, // Agregar id_categoria aquí
      url_imagen: producto.url_imagen,
    });
  };

  const handleGuardarEdicion = () => {
    // Verificar que los campos necesarios estén definidos
    if (
      editedProductData.nombre_producto === '' ||
      editedProductData.descripcion === '' ||
      editedProductData.precio === '' ||
      editedProductData.existencias === '' ||
      editedProductData.id_categoria === '' ||
      editedProductData.url_imagen === ''
    ) {
      setAlerta({ mostrar: true, texto: 'Porfavor completa todos los campos', clase: 'alerta-roja-editar-producto' });

          setTimeout(() => {
            setAlerta({ mostrar: false, texto: '', clase: '' });
          }, 2000);
      return;
    }

    // Realizar una solicitud PUT al servidor para actualizar el producto
    fetch(`http://localhost:5000/productos/${editProduct.id_producto}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedProductData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Actualizar la lista de productos después de la edición
          const updatedProducts = productos.map((producto) => {
            if (producto.id_producto === editProduct.id_producto) {
              return { ...producto, ...editedProductData };
            }
            return producto;
          });

          setAlerta({ mostrar: true, texto: 'Producto Editado', clase: 'alerta-verde-editar-producto' });

          setTimeout(() => {
            setAlerta({ mostrar: false, texto: '', clase: '' });
          }, 2000);

          setProductos(updatedProducts);
          setEditProduct(null); // Desactivar el modo de edición
        } else {
          console.error('Error al editar el producto:', data.message);
        }
      })
      .catch((error) => console.error('Error al editar el producto:', error));
  };

  const handleCancelarEdicion = () => {
    setEditProduct(null); // Desactivar el modo de edición
  };

  return (
    <div>
      <h2>Productos</h2>
      <div className="productos-container">
        {productos.map((producto) => (
          <div className="producto-card" key={producto.id_producto}>
            <h3 className='productosAdmin-h3'>{producto.nombre_producto}</h3>
            <p className='productosAdmin-p'>Descripción: {producto.descripcion}</p>
            <p className='productosAdmin-p'>Precio: {producto.precio}</p>
            <p className='productosAdmin-p'>Existencias: {producto.existencias}</p>
            <img
              src={`http://localhost:5000/${producto.url_imagen}`}
              alt={`Imagen de ${producto.nombre_producto}`}
            />
            {editProduct && editProduct.id_producto === producto.id_producto ? (
              <div>
                <input className='input-productos-admin'
                  type="text"
                  value={editedProductData.nombre_producto}
                  onChange={(e) =>
                    setEditedProductData({ ...editedProductData, nombre_producto: e.target.value })
                  }
                />
                <input className='input-productos-admin'
                  type="text"
                  value={editedProductData.descripcion}
                  onChange={(e) =>
                    setEditedProductData({ ...editedProductData, descripcion: e.target.value })
                  }
                />
                <input className='input-productos-admin'
                  type="number"
                  value={editedProductData.precio}
                  onChange={(e) =>
                    setEditedProductData({ ...editedProductData, precio: e.target.value })
                  }
                />
                <input className='input-productos-admin'
                  type="number"
                  value={editedProductData.existencias}
                  onChange={(e) =>
                    setEditedProductData({ ...editedProductData, existencias: e.target.value })
                  }
                />
                <input className='input-productos-admin'
                  type="text"
                  value={editedProductData.id_categoria}
                  onChange={(e) =>
                    setEditedProductData({ ...editedProductData, id_categoria: e.target.value })
                  }
                />
                {/* <input className='input-productos-admin'
                  type="text"
                  value={editedProductData.url_imagen}
                  onChange={(e) =>
                    setEditedProductData({ ...editedProductData, url_imagen: e.target.value })
                  }
                /> */}
                <button className='producto-card-button' onClick={handleGuardarEdicion}>Guardar</button>
                <button className='producto-card-button' onClick={handleCancelarEdicion}>Cancelar</button>
              </div>
            ) : (
              <>
                <button className='producto-card-button' onClick={() => handleEditarProducto(producto)}>Editar</button>
                <button className='producto-card-button' onClick={() => handleEliminarProducto(producto.id_producto)}>Eliminar</button>
              </>
            )}
          </div>
        ))}
      </div>
      {alerta.mostrar && <p className={alerta.clase}>{alerta.texto}</p>}
    </div>
  );
};

export default ProductosAdmin;

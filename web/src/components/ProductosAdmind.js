import React, { useEffect, useState } from 'react';
import EditarProducto from './EditarProducto'; 

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

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
  };

  return (
    <div>
      <h2>Productos</h2>
      <div className="productos-container">
        {productos.map((producto) => (
          <div className="producto-card" key={producto.id_producto}>
            <h3>{producto.nombre_producto}</h3>
            <p>Descripción: {producto.descripcion}</p>
            <p>Precio: {producto.precio}</p>
            <p>Existencias: {producto.existencias}</p>
            <img
              src={`http://localhost:5000/${producto.url_imagen}`}
              alt={`Imagen de ${producto.nombre_producto}`}
            />
            <button onClick={() => handleEditarProducto(producto)}>Editar</button>
            <button onClick={() => handleEliminarProducto(producto.id_producto)}>Eliminar</button>
          </div>
        ))}
      </div>
      {/* Renderizar el componente EditarProducto si editProduct está definido */}
      {editProduct && (
        <EditarProducto
          producto={editProduct}
          onEdit={(editedProduct) => {
            // Lógica para enviar los cambios al servidor y actualizar la lista
            console.log('Producto editado:', editedProduct);
            // Aquí puedes enviar los cambios al servidor y luego actualizar la lista de productos
            setEditProduct(null); // Cerrar el formulario de edición
          }}
          onCancel={() => setEditProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductosAdmin;

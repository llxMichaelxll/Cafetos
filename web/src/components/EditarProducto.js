import React, { useState } from 'react';
import '../styles/editarProducto.css'

const EditarProducto = ({ producto, onEdit, onCancel }) => {
  const [editedProduct, setEditedProduct] = useState(producto);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Realizar una solicitud PUT al servidor para actualizar el producto
    fetch(`http://localhost:5000/productos/${editedProduct.id_producto}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Lógica para actualizar la lista de productos
          console.log('Producto actualizado con éxito');
          onEdit(editedProduct); // Actualizar el producto en la lista
          onCancel(); // Cerrar el formulario de edición
        } else {
          console.error('Error al actualizar el producto:', data.message);
        }
      })
      .catch((error) => console.error('Error al actualizar el producto:', error));
  };

  return (
    <div className="editar-producto">
      <h2>Editar Producto</h2>
      <form className='fromProducto' onSubmit={handleSubmit}>
      <label>
  Descripción:
  <input
    type="text"
    name="descripcion"
    value={editedProduct.descripcion}
    onChange={handleInputChange}
  />
</label>
<label>
  Precio:
  <input
    type="number"
    name="precio"
    value={editedProduct.precio}
    onChange={handleInputChange}
  />
</label>
<label>
  Existencias:
  <input
    type="number"
    name="existencias"
    value={editedProduct.existencias}
    onChange={handleInputChange}
  />
</label>

<img
              src={`http://localhost:5000/${producto.url_imagen}`}
              alt={`Imagen de ${producto.nombre_producto}`}
/>
{/* Agregar más campos de edición aquí */}

        {/* Agregar más campos de edición aquí */}
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditarProducto;

import React, { useState } from "react";
import "../styles/editarProducto.css";
import { useCart } from "../context/ContextCarrito";


const EditarProducto = ({ producto, onEdit, onCancel,Alerrta }) => {
  const [editedProduct, setEditedProduct] = useState(producto);
  const [Alerta, setAlerta] = useState(false);
  const [texAlert, SetTexAlert] = useState("");
  const [clase, stepClase] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const limpiar =()=>{
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      editedProduct.nombre_producto === "" ||
      editedProduct.descripcion === "" ||
      editedProduct.precio === "" ||
      editedProduct.existencias === ""
    ) {
      // Mostrar una alerta o mensaje de error
      SetTexAlert("Por favor, complete todos los campos.");
      stepClase("alerta-roja-editar-producto");
      setAlerta(true);
      setTimeout(() => {
        setAlerta(false);
      }, 2000);
      return;
    } else {
      // Realizar una solicitud PUT al servidor para actualizar el producto
      fetch(`http://localhost:5000/productos/${editedProduct.id_producto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Actualizar el producto en la lista
            onEdit(editedProduct)
            setAlerta(true)
            Alerrta(Alerta)
          } else {
            SetTexAlert("Error al actualizar el producto:");
            stepClase("alerta-roja-editar-producto");
            setAlerta(true);
            setTimeout(() => {
              setAlerta(false);
            }, 2000);
          }
        })
        .catch((error) =>
          console.error("Error al actualizar el producto:", error)
        );
    }
  };

  return (
    <div className="editar-producto">
      <h2>Editar Producto</h2>
      <form className="fromProducto" onSubmit={handleSubmit}>
        <label className="label-producto-editar">
          Nombre:
          <input
            className="editar-producto-input"
            type="text"
            name="nombre_producto"
            value={editedProduct.nombre_producto}
            onChange={handleInputChange}
          />
        </label>
        <label className="label-producto-editar">
          Descripción:
          <input
            className="editar-producto-input"
            type="text"
            name="descripcion"
            value={editedProduct.descripcion}
            onChange={handleInputChange}
          />
        </label>
        <label className="label-producto-editar">
          Precio:
          <input
            className="editar-producto-input"
            type="number"
            name="precio"
            value={editedProduct.precio}
            onChange={handleInputChange}
          />
        </label>
        <label className="label-producto-editar">
          Existencias:
          <input
            className="editar-producto-input"
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
        <button className="button-guardar-editar-producto" type="submit">
          Guardar Cambios
        </button>
        <button
          className="button-Cancelar-editar-producto"
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </form>
      {Alerta && <p className={clase}>{texAlert}</p>}
    </div>
  );
};

export default EditarProducto;

import React, { useState,refreshCarrito } from 'react';
import Carrito from '../Carrito'; // Importar el componente Carrito
import '../ventanaModal/carritoModal.css'

const CarritoModal = ({userId}) => {
  console.log(userId)
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar si la ventana emergente está abierta o cerrada

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Botón o enlace para abrir la ventana emergente */}
      <button onClick={openModal}>Ver Carrito</button>

      {/* Ventana emergente (modal) */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span> {/* Botón para cerrar la ventana emergente */}
            <h2>Carrito de Compras</h2>
            <Carrito userId={userId}/> {/* Mostrar el contenido del carrito utilizando el componente Carrito */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoModal;

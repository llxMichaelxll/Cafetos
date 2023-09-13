import React, { useState} from 'react';
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
      <img onClick={openModal} src='http://localhost:5000/uploads/carrito.png'/>

      {/* Ventana emergente (modal) */}
      {isModalOpen && (
        <div className="modal-carrito">
          <span className="close" onClick={closeModal}>&times;</span> {/* Botón para cerrar la ventana emergente */}
          <Carrito userId = {userId}/> {/* Mostrar el contenido del carrito utilizando el componente Carrito */}
        </div>
      )}
    </div>
  );
};

export default CarritoModal;

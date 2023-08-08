import React, { useState } from 'react';
import Registro from '../Registro'; // Importar el componente Carrito
import '../ventanaModal/contactoModal.css'

const RegistroModal = () => {
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
      <button onClick={openModal}>Registro</button>

      {/* Ventana emergente (modal) */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span> {/* Botón para cerrar la ventana emergente */}
            <Registro /> {/* Mostrar el contenido del carrito utilizando el componente Carrito */}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroModal;

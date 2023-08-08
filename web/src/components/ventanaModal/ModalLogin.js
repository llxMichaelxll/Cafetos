import React, { useState } from 'react';
import Login from '../Login'
import '../ventanaModal/carritoModal.css'

const LoginModal = () => {
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
      <button onClick={openModal}>Login</button>

      {/* Ventana emergente (modal) */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span> {/* Botón para cerrar la ventana emergente */}
            <h2>Login</h2>
            <Login /> {/* Mostrar el contenido del carrito utilizando el componente Carrito */}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;

import React, { useState } from 'react';
import Contacto from '../Contacto'; // Importar el componente Carrito
import '../ventanaModal/contactoModal.css'

const ContactoModal = () => {
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
      <li onClick={openModal}>Contacto</li>

      {/* Ventana emergente (modal) */}
      {isModalOpen && (
          <div className="ventana-conacto-modal__content">
            <span className="close" onClick={closeModal}>&times;</span> {/* Botón para cerrar la ventana emergente */}
            <Contacto /> {/* Mostrar el contenido del carrito utilizando el componente Carrito */}
          </div>
      )}
    </div>
  );
};

export default ContactoModal;

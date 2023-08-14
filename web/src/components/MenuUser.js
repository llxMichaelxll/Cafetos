// MenuUser.js
import React from 'react';
import { Link } from 'react-router-dom';
import CarritoModal from './ventanaModal/ModalCarrito';
import ContactoModal from './ventanaModal/ModalContacto';
import CarouselComponent from './Carousel';
import ProductosConImagenes from './ProductosConImagen';
import Footer from './Footer';
import '../styles/menu.css';

const MenuUser = ({ userToken }) => {
  const handleLogoutClick = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <>
      <div className="menu-container">
        <ul className='menu'>
          <Link to="/"><li>Inicio</li></Link>
          <li>Categorías</li>
          <Link to="/noticias"><li>Noticias</li></Link>
          <Link to="/sobre_nosotros"><li>Sobre Nosotros</li></Link>
          <ContactoModal/>
        </ul>
        <button>Mi Perfil</button>
        <CarritoModal/>
        <button onClick={handleLogoutClick}>Cerrar Sesión</button>
      </div>
      <CarouselComponent/>
      <ProductosConImagenes/>
      <Footer/>
    </>
  );
};

export default MenuUser;

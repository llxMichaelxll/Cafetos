// MenuUser.js
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CarritoModal from './ventanaModal/ModalCarrito';
import ContactoModal from './ventanaModal/ModalContacto';
import CarouselComponent from './Carousel';
import ProductosConImagenes from './ProductosConImagen';
import Footer from './Footer';
import '../styles/menu.css';

const MenuUser = ({ userToken, userId }) => {
  
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
          <Link to="/pedidos-usuario"><li>Pedidos</li></Link>
          <ContactoModal/>
        </ul>
        <button>Mi Perfil</button>
        <CarritoModal  userId={userId} />
             {/* <Link to={{ pathname: '/carrito', state: { userId: userId } }}>
  <button>Carrito</button>
</Link> */}
        <button onClick={handleLogoutClick}>Cerrar Sesión</button>
      </div>
      <CarouselComponent/>
      <ProductosConImagenes userId={userId}/> 
      <Footer/>
    </>
  );
};

export default MenuUser;


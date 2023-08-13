import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarritoModal from './ventanaModal/ModalCarrito';
import ProductosConImagenes from './ProductosConImagen';
import Footer from './Footer';
import RegistroModal from './ventanaModal/ModalRegistro';

import CarouselComponent from './Carousel';
import '../styles/menu.css'

const Menu = ({ onLoginClick, userRole, onLogoutClick }) => {



 

  return (
    <>
    <div className="menu-container">

      <div className='Logo'><img src='http://localhost:5000/uploads/1690768506675Logo.png'/>
      </div>
      <div className='menu-nav'>
      <ul>
        <Link to="/"><li>Inicio</li></Link>
        <li>Categorías</li>
        <Link to="/noticias"><li>Noticias</li></Link>
      </ul>
      </div>
      <div className='botones'>
        {userRole === 'guest' ? (
          <button onClick={onLoginClick}>Login</button>
        ) : (
          <button onClick={onLogoutClick}>Cerrar Sesión</button>
        )}
        {/* Utilizamos el componente Link para redireccionar al componente de registro */}
        <RegistroModal/>
        
          <CarritoModal/>
        
      </div>
     
    </div>
    <CarouselComponent/>
    <ProductosConImagenes/>
    <Footer/>
            

</>
  );
};

export default Menu;

// MenuAdmin.js
import React from 'react';
import { Link } from 'react-router-dom';
import ProductosAdmind from './ProductosAdmind';
import CarouselComponent from './Carousel';
import Mensajes from './Mensajes';
import '../styles/menuAdmind.css';

const MenuAdmin = ({ userToken }) => {
  const handleLogoutClick = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <>
      <div className='contenedor-menu'>
        <div className="Menu">
          <ul>
            <li><Link to="/admin-pedidos">Pedidos</Link></li>
            <li><Link to ="/mensajes" >Mensajes</Link></li>
            <Link to="/noticias"><li>Noticias</li></Link>
            <li>
              <Link to="/nuevo-producto">Agregar producto</Link>
            </li>
          </ul>
        </div>
        <div className='Botones'>
          <button>Perfil</button>
          <button onClick={handleLogoutClick}>Cerrar Sesión</button>
        </div>
      </div>
      <CarouselComponent/>
      <ProductosAdmind/>
      {/* Resto de componentes */}
    </>
  );
};

export default MenuAdmin;

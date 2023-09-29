// MenuAdmin.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductosAdmind from './ProductosAdmind';
import CarouselComponent from './Carousel';
import '../styles/menuAdmind.css';

const MenuAdmin = ({ userToken }) => {
  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  const [menuUl, setMenuUl] = useState('menuAdmin-ul')
  const [ocultar,setOcultar] = useState('menuAdmin-li-ocultar')

  return (

      <div className='contenedor-menuAdmin'>
        <ul className={menuUl}>
          <li className='menuAdmin-li contenedor-admin-logo'>
          <img className='admin-logo'  src='http://localhost:5000/uploads/Cafetos-Navbar-Logo.png'/></li>

          <div onClick={()=>{ocultar==='menuAdmin-li'?setOcultar('menuAdmin-li-ocultar'):setOcultar('menuAdmin-li');menuUl==='menuAdmin-ul'?setMenuUl('menuAdmin-ul2'):setMenuUl('menuAdmin-ul')}} className="depliegue-menuAdmin">
            <div className="menu-forma"></div>
            <div className="menu-forma"></div>
            <div className="menu-forma"></div>
          </div>
          <li className={ocultar}><Link className='Link-li' to="/admin-pedidos">Pedidos</Link></li>
          <li className={ocultar}><Link className='Link-li' to="/ventas">Ventas</Link></li>
          <li className={ocultar}><Link className='Link-li' to ="/mensajes" >Mensajes</Link></li>
          <li className={ocultar}><Link className='Link-li' to="/noticias">Noticias</Link></li>
          <li className={ocultar}>
            <Link className='Link-li' to="/nuevo-producto">Agregar producto</Link>
          </li>
      
        <div className='contendor-li-buttons'>
          <li className='menuAdmin-li li-buttons'><Link to={'/perfil'}><img className='menuAdmin-li-img-perfil' src='http://localhost:5000/uploads/icono Usuario.png'/></Link></li>
          <li className='menuAdmin-li li-buttons'>
          <img className='menuAdmin-li-img-cerrar-sesion' onClick={handleLogoutClick} src='http://localhost:5000/uploads/cerrar-sesion.png'/>
          </li>
        </div>
        
        </ul>
      
    <CarouselComponent/>
    <ProductosAdmind/>
      </div>
    
  );
};

export default MenuAdmin;

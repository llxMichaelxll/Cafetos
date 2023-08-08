import React from 'react';
import CarritoModal from './ventanaModal/ModalCarrito';
import ProductosConImagenes from './ProductosConImagen';
import CarouselComponent from './Carousel';
import { Link } from 'react-router-dom'; // Importar el componente Link para manejar la navegación
import '../styles/menu.css'


const MenuUser = () => {
  // Función para manejar el clic en "Cerrar Sesión"
  const handleLogoutClick = () => {
    // Aquí puedes agregar cualquier lógica que necesites antes de cerrar sesión, por ejemplo, limpiar datos de sesión o hacer una solicitud al servidor.

    // Luego, redirige al menú de inicio
    window.location.href = '/'; // Redirecciona a la ruta raíz (menú de inicio)
  };

  return (
    <>
    <div className="menu-container">
      <ul className='menu'>
      <Link to="/"><li>Inicio</li></Link>
        <li>Categorías</li>
        <Link to="/noticias"><li>Noticias</li></Link>
        <Link to="/sobre_nosotros"><li>Sobre Nosotros</li></Link>
        <Link to="/contacto"><li>Contacto</li></Link>
      </ul>
      <button>Mi Perfil</button>
      
        <CarritoModal/>
            
      <button onClick={handleLogoutClick}>Cerrar Sesión</button>
    </div>
    <CarouselComponent/>
    <ProductosConImagenes/>
    </>
  );
};

export default MenuUser;

import React from 'react';
import { Link } from 'react-router-dom'; // Importar el componente Link para manejar la navegación
import ProductosAdmind from './ProductosAdmind';
import CarouselComponent from './Carousel';


const MenuAdmin = () => {
  // Función para manejar el clic en "Cerrar Sesión"
  const handleLogoutClick = () => {
    // Aquí se puede agregar cualquier lógica que se necesite antes de cerrar sesión, por ejemplo, limpiar datos de sesión o hacer una solicitud al servidor.

    // Luego, redirige al menú de inicio
    window.location.href = '/'; // Redirecciona a la ruta raíz (menú de inicio)
  };

  return (
    <>
    <div className="Menu">
      <ul>
        <li>Inicio</li>
        <li>Categorías</li>
        <li>Noticias</li>
        <li>Editar productos</li>
        <li>Editar noticias</li>
        <li>
        <Link to="/nuevo-producto">Agregar producto</Link>
        </li>
        <li>Agregar noticia</li>
      </ul>
      <button>Perfil</button>
      <button onClick={handleLogoutClick}>Cerrar Sesión</button>
    </div>
    <CarouselComponent/>
<ProductosAdmind/>

</>
  );
};

export default MenuAdmin;



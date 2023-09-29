import React from 'react';
import '../styles/footer.css'; // Importar el archivo CSS para estilos
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-contact-info">
        <p className='footer-p'>Número de contacto: +123456789</p>
        <p className='footer-p'>Correo electrónico: info@cafetos.com</p>
      </div>
        <Link className="footer-sobre-nosotros" to="/sobre_nosotros">Sobre nosotros</Link>
      <div className="iconos-redes-contenedor">
        <a href="https://www.facebook.com/Cafetosscafe" target="_blank" className="iconos-sociales">

          <img className='icono-img' src="http://localhost:5000/uploads/facebook.png" alt="Facebook"/>

        </a>
        <a href='https://www.instagram.com/cafetos_/' target='_blank' className="iconos-sociales">
          <img className='icono-img' src='http://localhost:5000/uploads/instagram.png' alt="Instagram" />
        </a>
        <a href='https://chatwith.io/es/s/cafetos-tienda-de-cafe' target='_blank' className="iconos-sociales">
          <img className='icono-img' src='http://localhost:5000/uploads/whatsapp.png' alt="whatssap" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import '../styles/footer.css'; // Importar el archivo CSS para estilos
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="contact-info">
        <p>Número de contacto: +123456789</p>
        <p>Correo electrónico: info@cafetos.com</p>
      </div>
        <Link to="/sobre_nosotros"> <div>Sobre Nosotros</div></Link>
      <div className="social-media">
        <div className="social-icon">
          {/* Aquí puedes usar un componente de imagen o una etiqueta <img> para mostrar el ícono */}
          <img src="http://localhost:5000/uploads/logo-facebook.png" alt="Facebook" />
        </div>
        <div className="social-icon">
          {/* Aquí puedes usar un componente de imagen o una etiqueta <img> para mostrar el ícono */}
          <img src='http://localhost:5000/uploads/16907671251110twit.png' alt="Twitter" />
        </div>
        <div className="social-icon">
          {/* Aquí puedes usar un componente de imagen o una etiqueta <img> para mostrar el ícono */}
          <img src='http://localhost:5000/uploads/Instagram-Logo.png' alt="Instagram" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

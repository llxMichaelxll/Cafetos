import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SobreNosotros.css';

const SobreNosotros = () => {
    const history= useNavigate();
  return (
    <div className="sobre-nosotros">
      <h2>Bienvenidos a Cafetos: Pasión por el Café</h2>
      <p>¡Bienvenidos al mundo de Cafetos, donde la pasión por el café cobra vida! ☕</p>
      <p>Descubre la calidad inigualable de nuestro café, cultivado con amor en las montañas de Pradera, Valle del Cauca. Desde el caficultor Don José Joaquín Pineda hasta tu taza, cada grano cuenta una historia de dedicación y sabor auténtico.</p>
      <p>¿Estás listo para vivir la experiencia Cafetos? 🌱💛</p>
      <p>Recuerda que nuestro delicioso café está a tu alcance. Contáctanos al siguiente número: 📲 310 6856745</p>
      <p>En Cafetos, nos enorgullece llevar la tradición y el sabor del café colombiano a todos los amantes del café en el mundo. Nuestro compromiso es brindar café de alta calidad, cultivado de manera sostenible y con pasión. Te invitamos a unirte a nosotros en este apasionante viaje del café.</p>
      <p>¡Cafetos: Del Campo a la Taza, Sabor Auténtico con Pasión!</p>
      <p>#cafetoscafe #delcampoalataza #saborauténtico #caféconpasión #cafetosorigen</p>

      <button className='sobreNosotros-button' onClick={()=>{history('/')}}>Atras</button>
    </div>
  );
};

export default SobreNosotros;

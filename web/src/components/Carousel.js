import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importar los estilos del carrusel
import '../styles/carousel.css'


const images = [
  'http://localhost:5000/uploads/16936360836121.png',
  'http://localhost:5000/uploads/16936362493452.png',
  'http://localhost:5000/uploads/16936362727613.png',
  // Agrega más rutas de imagen si es necesario
];

const CarouselComponent = () => {
  return (
    <div className="carousel-container">
      <Carousel autoPlay infiniteLoop showThumbs={false} interval={3000}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;

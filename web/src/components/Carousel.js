import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importar los estilos del carrusel
import '../styles/carousel.css'


const images = [
  'http://localhost:5000/uploads/169076727802814.png',
  'http://localhost:5000/uploads/169076764263112.jpg',
  'http://localhost:5000/uploads/16907677175269.jpg',
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

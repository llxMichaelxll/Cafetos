import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null)
  const [rol,setUserRol]= useState(null)
  const admind = (rol === 'admin'? true: false);
  const [mostrarB,setMostrarB] = useState(true);
  const [detalles,setDetalles] = useState([]);
  const [correo,setCorreo] = useState('')


  const vaciarCarrito = () => {
    setCartItems([])
  }
  const addToCart = (productId, productDetails) => {
    console.log('Agregando al carrito:', productId, productDetails); // Agrega este console.log
    setCartItems((prevItems) => [...prevItems, { id: productId, ...productDetails }]);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{detalles,setDetalles,mostrarB,setMostrarB,idUsuario,admind,setUserRol,setIdUsuario,vaciarCarrito, cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

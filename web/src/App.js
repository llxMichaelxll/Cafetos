import React, { useEffect,useState } from 'react';
import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuAdmin from './components/MenuAdmin';
import MenuUser from './components/MenuUser';
import Menu from './components/Menu';
import Login from './components/Login';
import Registro from './components/Registro';
import NuevoProducto from './components/Admin/NuevoProducto';
import Carrito from './components/Carrito';
import SobreNosotros from './components/SobreNosotros';
import Noticias from './components/Noticias';
import ContactoModal from '../src/components/ventanaModal/ModalContacto';
// import jwt from 'jsonwebtoken'; // Importa jsonwebtoken



const App = () => {
  const [userRole, setUserRole] = useState('guest');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showNombre, setShownombre] = useState('');
  const [userToken, setUserToken] = useState(localStorage.getItem('authToken') || null);

 
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      console.log('authToken:', storedToken);
      setUserToken(storedToken);
      // Realizar cualquier otra acción necesaria con el token, como verificar su validez
      
    }
  }, [userToken]);
  

  

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleLogoutClick = () => {
    console.log('Antes de eliminar:', localStorage.getItem('authToken'));
    setUserRole('guest');
    setShownombre('');
    setUserToken(null); // Elimina el token del estado
    localStorage.removeItem('authToken'); // Elimina el token del almacenamiento local
    console.log('Después de eliminar:', localStorage.getItem('authToken'));
  };
  
  

  const handleLoginSuccess = (role, nombre, token) => {
    setUserRole(role);
    setShownombre(nombre);
    setUserToken(token);
    setShowLoginForm(false);
    localStorage.setItem('authToken', token);
  };

  
  
  
  return (
    <Router>
      <div>
        {showLoginForm ? (
          // Mostrar el formulario de inicio de sesión si showLoginForm es verdadero
          <Login setRol={handleLoginSuccess} />
        ) : (
          // Mostrar el menú adecuado según el rol del usuario
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* {showNombre && <h1>{showNombre}</h1>} */}

                  {userRole === 'admin' && (
                    <>
                      <MenuAdmin />
                    </>
                  )}
                  {userRole === 'user' && <MenuUser />}
                  {userRole === 'guest' && (
                    <Menu
                      onLoginClick={handleLoginClick}
                      userRole={userRole}
                      onLogoutClick={handleLogoutClick}
                    />
                  )}
                </>
              }
            />
            <Route path="/registro" element={<Registro />} /> {/* Agregamos esta línea para la ruta de registro */}
            <Route path="/nuevo-producto" element={<NuevoProducto />} />
            <Route path="/menu-admin" element={<MenuAdmin />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/contacto-modal" element={<ContactoModal />} />
            <Route path="/sobre_nosotros" element={<SobreNosotros />} />
            <Route path="/noticias" element={<Noticias/>} />
            <Route path="/" element={<Menu onLoginClick={handleLoginClick} userRole={userRole} onLogoutClick={handleLogoutClick} />} />


          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;

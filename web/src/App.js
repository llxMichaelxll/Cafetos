import React, { useEffect,useState } from 'react';
import './styles/App.css'
import { useCart } from './context/ContextCarrito';
import { BrowserRouter as Router, Routes, Route,useLocation } from 'react-router-dom';
import MenuAdmin from './components/MenuAdmin';
import NuevaNoticia from './components/Admin/NuevaNoticia';
import Mensajes from './components/Mensajes';
import MenuUser from './components/MenuUser';
import Menu from './components/Menu';
import Login from './components/Login';
import Registro from './components/Registro';
import NuevoProducto from './components/Admin/NuevoProducto';
import Carrito from './components/Carrito';
import SobreNosotros from './components/SobreNosotros';
import Noticias from './components/Noticias';
import ContactoModal from '../src/components/ventanaModal/ModalContacto';
import PedidosUsuario from './components/PedidosUsuario';
import PedidosAdmin from './components/PedidosAdmin';
import CarritoModal from './components/ventanaModal/ModalCarrito';
import Categorias from './components/Categorias';
import RecuperarContraseña from './components/RecuperarContraseña';
import Contacto from './components/Contacto';
import Ventas from './components/Ventas';
import Perfil from './components/Perfil';



const App = () => {
  return (
    <Router>
      <Inner></Inner>
    </Router>
  );
};

function Inner() {
  const location = useLocation();
  const [userRole, setUserRole] = useState('guest');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showNombre, setShownombre] = useState('');
  const [userToken, setUserToken] = useState(localStorage.getItem('authToken') || null);
  const [userId, setUserId] = useState('')
  const {setUserRol} = useCart()

 
  useEffect(() => {
    let storedUser = localStorage.getItem('user');
    if (storedUser) {
      storedUser = JSON.parse(storedUser);
      handleLoginSuccess(storedUser.rol, storedUser.nombre, storedUser.token, storedUser.id_usuario);
      console.log('este es: ',storedUser)
    }
  }, [location]);
  
  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleLogoutClick = () => {
    console.log('Antes de eliminar:', localStorage.getItem('authToken'));
    setUserRole('guest');
    setShownombre('');
    setUserToken(null); // Elimina el token del estado
    localStorage.removeItem('authToken'); // Elimina el token del almacenamiento local
  };
  
  

  const handleLoginSuccess = (role, nombre, token, userId) => {
    setUserRole(role);
    setUserRol(role)
    setUserId(userId);
    setShownombre(nombre);
    setUserToken(token);
    setShowLoginForm(false);
    localStorage.setItem('authToken', token);
  };

  return (
      <div>
        {/* {showLoginForm ? (
          // Mostrar el formulario de inicio de sesión si showLoginForm es verdadero
          <Login setRol={handleLoginSuccess} />
        ) : (
          // Mostrar el menú adecuado según el rol del usuario */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {userRole === 'admin' && (
                    <>
                      <MenuAdmin />
                    </>
                  )}
                  {userRole === 'user' && <MenuUser userId ={userId}/>}
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
            <Route path="/registro" element={<Registro />} />
            <Route path="/nuevo-producto" element={<NuevoProducto />} />
            <Route path="/menu-admin" element={<MenuAdmin />} />
            <Route path='/categorias' element={<Categorias/>} />
            <Route path="/carrito" element={<Carrito/>} />
            <Route path="/mensajes" element={<Mensajes />} />
            <Route path="/contacto-modal" element={<ContactoModal />} />
            <Route path="/contacto" element={<Contacto/>} />
            <Route path="/sobre_nosotros" element={<SobreNosotros />} />
            <Route path='/perfil' element={<Perfil/>}/>
            <Route path="/noticias" element={<Noticias/>} />
            <Route path="/carrito-modal" element={<CarritoModal/>} />
            <Route path="/login" element={<Login/>} />
            <Route path='/ventas' element={<Ventas/>} />
            <Route path="/Nnoticia" element={<NuevaNoticia/>}/>
            <Route path="/admin-pedidos" element={<PedidosAdmin/>} />
            <Route path="/Recuperar-contraseña" element = {<RecuperarContraseña/>}/>
            <Route path="/pedidos-usuario" element={<PedidosUsuario/>} />
            <Route path="/" element={<Menu onLoginClick={handleLoginClick} userRole={userRole} onLogoutClick={handleLogoutClick} />} />


          </Routes>
        {/* )} */}
      </div>
  );
}

export default App;

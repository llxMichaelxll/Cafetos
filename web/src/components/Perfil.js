import React, { useState, useEffect } 
from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Perfil.css'

const Perfil = () => {
  const history = useNavigate();
  const [Alerta, setAlerta] = useState(false);
  const [texAlert, SetTexAlert] = useState("");
  const [clase, stepClase] = useState("");
  const [cliente, setCliente] = useState({
    id_cliente: null,
    nombre_cliente: "",
    correo_electronico: "",
    contrasena: "",
    id_ciudad: null,
    direccion: "",
  });
  const [ciudades, setCiudades] = useState([]);
  const [ciudadd, setCiudadd] = useState([]);
  const [ciudad, setCiudad] = useState(null);

  const [departamento, setDepartamento] = useState([]);
  const [departamentos, setDepartamentos] = useState(null);
  const [Editar, setEdtar] = useState(false);

  // Obtener la id_usuario del localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Obtener la id_usuario del objeto 'user'
  const id_usuario = user ? user.id_usuario : null;
  // Cargar datos del cliente y las ciudades al cargar el componente

  // Resto del código

  useEffect(() => {
    // Comprobar si la id_usuario existe en el localStorage
    if (id_usuario) {
      // Realizar una solicitud para obtener los datos del cliente usando la id_usuario
      fetch(`http://localhost:5000/traer-cliente/${id_usuario}`)
        .then((response) => response.json())
        .then((data) => {
          setCliente(data);
        })
        .catch((error) => {
          console.error("Error al obtener los detalles del cliente:", error);
        });
    }

    fetch("http://localhost:5000/departamentos")
      .then((response) => response.json())
      .then((data) => setDepartamentos(data))
      .catch((error) =>
        console.error("Error al obtener la lista de departamentos:", error)
      );

    fetch(`http://localhost:5000/datos-cliente/${id_usuario}`)
      .then((response) => response.json())
      .then((daata) => {
        if (daata.success) {
          setCiudadd(daata.ciudad);
        } else {
          console.error("Error al obtener los datos del usuario");
        }
      });

    // Obtener la lista de ciudades por departamento desde el servidor cuando se seleccione un departamento
    if (departamento) {
      fetch(`http://localhost:5000/ciudades/${departamento}`)
        .then((response) => response.json())
        .then((data) => setCiudades(data))
        .catch((error) =>
          console.error("Error al obtener la lista de ciudades:", error)
        );
    }
    // Cargar lista de ciudades solo si se ha seleccionado un departamento
  }, [departamento]); // Agregamos id_usuario como dependencia

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  // Función para manejar cambios en la selección de departamento
  //   const handleDepartamentoChange = (e) => {
  //     const { value } = e.target;
  //     setSelectedDepartamento(value);
  //     // Puedes filtrar las ciudades según el departamento seleccionado si es necesario
  //   };
  {
    
    // Función para enviar la actualización de datos
    const handleActualizarPerfil = () => {

      if(!cliente.nombre_cliente || !cliente.contrasena || !ciudad || !cliente.direccion){
        SetTexAlert("Completa todos los campos");
            stepClase("alerta-roja-perfil");
            setAlerta(true);
            setTimeout(() => {
              setAlerta(false);
            }, 3000);
            return;
      }else{
        const actCliente = {
          nombre_cliente: cliente.nombre_cliente,
          contrasena: cliente.contrasena,
          id_ciudad: ciudad,
          direccion: cliente.direccion,
        };
    
        // Realizar la solicitud para actualizar el perfil del cliente
        fetch(`http://localhost:5000/act-cliente/${cliente.id_cliente}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(actCliente),
        })
          .then((response) => {
            if (response.status === 200) {
              // Actualización exitosa, puedes manejarlo aquí
              SetTexAlert("´Perfil actualizado");
              stepClase("alerta-verde-perfil");
              setAlerta(true);
              setTimeout(() => {
                setAlerta(false);
              }, 3000);
              console.log("Perfil actualizado con éxito");
            } else {
              // Manejar errores
              console.error("Error al actualizar el perfil");
            }
          })
          .catch((error) => {
            console.error("Error al enviar la solicitud:", error);
          });
      };
      }

      

    return (
      <div className="perfil-contenedor">
        <h1 className="perfil-h1">Perfil de Cliente</h1>
        {Editar ? (
          <div className="contenido-perfil">
            <div className="from-perfil" >
              <label className="perfil-label">Nombre de Cliente</label>
              <input className="perfil-input"
                type="text"
                name="nombre_cliente"
                value={cliente.nombre_cliente}
                onChange={handleInputChange}
              />
            </div>
            <div className="from-perfil">
              <label className="perfil-label">Correo Electrónico</label>
              <input className="perfil-input correo-input"
                type="email"
                name="correo_electronico"
                value={cliente.correo_electronico}
                onChange={handleInputChange}
              />
            </div>
            <div className="from-perfil">
              <label className="perfil-label">Contraseña</label>
              <input className="perfil-input"
                type="password"
                name="contrasena"
                value={cliente.contrasena}
                onChange={handleInputChange}
              />
            </div>
            <div className="from-perfil">
              <label className="perfil-label">Departamento</label>
              <select
                className="perfil-select"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
              >
                <option value="">Seleccionar Departamento</option>
                {departamentos.map((dep) => (
                  <option key={dep.id_departamento} value={dep.id_departamento}>
                    {dep.nombre_departamento}
                  </option>
                ))}
              </select>
              {departamento && (
                <>
                <label className="perfil-label">Ciudad</label>
                <select
                  className="perfil-select"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                >
                  <option value="">Seleccionar Ciudad</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                      {ciudad.nombre_ciudad}
                    </option>
                  ))}
                </select>
                </>
              )}
            </div>
            <div className="from-perfil">
              <label className="perfil-label">Dirección</label>
              <input className="perfil-input"
                name="direccion"
                value={cliente.direccion}
                onChange={handleInputChange}
              />
            </div>
          </div>
        ) : (
          <div 
 className="contenido-perfil">
            <p className="perfil-p">Nombre: {cliente.nombre_cliente}</p>
            <p className="perfil-p">Correo Electrónico: {cliente.correo_electronico}</p>
            <p className="perfil-p">Ciudad: {ciudadd}</p>

            <p className="perfil-p">Direccion: {cliente.direccion}</p>
          </div>
        )}
        <div>
          {Editar ? (
            <>
              <button className="perfil-button"
                onClick={() => {
                  handleActualizarPerfil();
                }}
              >
                Actualizar Perfil
              </button>

              <button 
              onClick={()=>{setEdtar(false)}}
              className="perfil-b-cancelar perfil-button">Atras</button>
            </>
          ) : (
            <>
            <button className="perfil-button"
              onClick={() => {
                setEdtar(true);
              }}
            >
              Editar informacion
            </button>
            <button className="perfil-b-cancela perfil-button" onClick={()=>{history('/')}}>Atras</button>
            </>
          )}
        </div>
      {Alerta && <p className={clase}>{texAlert}</p>}
      </div>
    );
  }
};

export default Perfil;

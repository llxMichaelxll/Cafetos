import React, { useEffect, useState } from "react";
import "../styles/FormularioCompra.css";
import { useCart } from "../context/ContextCarrito";

const FormularioCompra = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editar, setEditar] = useState(false);
  const {setMostrarB,setDetalles,detalles} = useCart();

  const [ciudad, setCiudad] = useState("");
  const [datos, setDatos] = useState({});
  const [editedData, setEditedData] = useState({}); // Estado para almacenar los datos editados
  const [formData, setFormData] = useState({
    id_cliente: '', // ID del cliente que se está actualizando
    direccion: '',
    nombre_cliente: '',
    id_departamento: '', // ID del departamento seleccionado
    id_ciudad: '', // ID de la ciudad seleccionada
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    // Obtener la lista de departamentos al cargar el componente
    fetch('http://localhost:5000/departamentos')
      .then(response => response.json())
      .then(data => {
        setDepartamentos(data);
      })
      .catch(error => {
        console.error('Error al obtener la lista de departamentos:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Si el campo seleccionado es "id_departamento", obtener la lista de ciudades
    if (name === 'id_departamento') {
      // Realizar una solicitud GET al servidor para obtener la lista de ciudades en función del departamento seleccionado
      fetch(`http://localhost:5000/ciudades/${value}`) // Reemplaza con la ruta adecuada en tu servidor
        .then(response => response.json())
        .then(data => {
          setCiudades(data);
        })
        .catch(error => {
          console.error('Error al obtener la lista de ciudades:', error);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      direccion: formData.direccion,
      nombre_cliente: formData.nombre_cliente,
      id_ciudad: formData.id_ciudad,
    };

    // Realizar la solicitud PUT para actualizar el cliente
    fetch(`http://localhost:5000/clientes/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {

        if(data.success){
          console.log('Cliente actualizado:', data)
          setEditar(false)
        }

        ;
        // Puedes realizar acciones adicionales después de la actualización si es necesario
      })
      .catch(error => {
        console.error('Error al actualizar el cliente:', error);
        // Manejo de errores si es necesario
      });
  };

  useEffect(() => {
    // Reemplaza "URL_DE_TU_API" con la URL real de tu API
    fetch(`http://localhost:5000/datos-cliente/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCiudad(data.ciudad);
          setEditedData(data.rows[0]); // Inicializa los datos editados con los datos iniciales
          setDatos(data.rows[0]);
          setLoading(false);
          setDetalles([data.rows[0],data.ciudad])
          // console.log(detalles)
        } else {
          console.error("Error al obtener los datos del usuario");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos del usuario:", error);
        setLoading(false);
      });
  }, [handleSubmit]);


  // Función de manejo de eventos para capturar cambios en los campos de entrada
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setEditedData({ ...editedData, [name]: value });
  // };
  

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {!editar&&
            <div className="datos-usuario-contenedor">
            <p className="datos-usuario-p">Nombre : <span>{datos.nombre_cliente}</span></p>
            <p className="datos-usuario-p">Correo: <span>{datos.correo_electronico}</span> </p>
            <p className="datos-usuario-p">Ciudad: <span>{ciudad}</span> </p>
            <p className="datos-usuario-p">Direccon: <span>{datos.direccion}</span> </p>
            <button onClick={() => {setMostrarB(false);setEditar(true)}}>Editar</button>
          </div>
          }
          {editar && (
            <div className="covertor-formulario-editar">
                <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="nombre_cliente">Nombre del Cliente:</label>
          <input
            type="text"
            id="nombre_cliente"
            name="nombre_cliente"
            value={formData.nombre_cliente}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="id_departamento">Departamento:</label>
          <select
            id="id_departamento"
            name="id_departamento"
            value={formData.id_departamento}
            onChange={handleChange}
          >
            <option value="">Seleccione un departamento</option>
            {departamentos.map(depto => (
              <option key={depto.id_departamento} value={depto.id_departamento}>
                {depto.nombre_departamento}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="id_ciudad">Ciudad:</label>
          <select
            id="id_ciudad"
            name="id_ciudad"
            value={formData.id_ciudad}
            onChange={handleChange}
          >
            <option value="">Seleccione una ciudad</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                {ciudad.nombre_ciudad}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="boton-formulario-editar"  onClick={() => {setMostrarB(true);} }>Confirmar</button>
                <button className="boton-formulario-editar" onClick={() => {setEditar(false); setMostrarB(true)}}>Cancelar</button>
      </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormularioCompra;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ventas.css'

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [sortBy, setSortBy] = useState(""); // Estado para rastrear el criterio de ordenación
  const history = useNavigate()

  useEffect(() => {
    // Hacer una solicitud GET al servidor para obtener los datos de ventas
    fetch("http://localhost:5000/ventas")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setVentas(data.data);
          // Calcular el total de ventas
          const total = data.data.reduce((accumulator, venta) => {
            // Sumar el subtotal de cada venta
            return accumulator + parseFloat(venta.subtotal);
          }, 0);
          setTotalVentas(total);
        } else {
          console.error("Error al obtener los datos de ventas");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de ventas:", error);
      });
  }, []);

  // Función para calcular el porcentaje en base al subtotal
  const calcularPorcentaje = (subtotal) => {
    return (subtotal / totalVentas) * 100;
  };

  // Función para ordenar los datos según el criterio seleccionado
  const ordenarVentas = (criterio) => {
    const sortedVentas = [...ventas];
    if (criterio === "cantidad") {
      sortedVentas.sort((a, b) => b.cantidad_vendida - a.cantidad_vendida);
    } else if (criterio === "subtotal") {
      sortedVentas.sort((a, b) => b.subtotal - a.subtotal);
    }
    setVentas(sortedVentas);
    setSortBy(criterio);
  };

  return (
    <div className="ventas-contenedor1">
      <h2>Registro de Ventas</h2>
      <div>
        <button onClick={() => ordenarVentas("cantidad")}>Más Vendidos</button>
        <button onClick={() => ordenarVentas("subtotal")}>Mayor Ganancia</button>
      </div>
      <table className="ventas-tabla">
        <thead>
          <tr>
            <th>Venta</th>
            <th>Nombre Producto</th>
            <th>Cantidad Vendida</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{venta.nombre_producto}</td>
              <td>{venta.cantidad_vendida}</td>
               <td>${Math.floor(venta.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>Total de Ventas: ${totalVentas.toFixed(1)}</div>
      <button onClick={()=>{history('/')}}>Atras</button>
    </div>
  );
};

export default Ventas;

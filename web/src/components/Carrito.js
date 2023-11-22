import React, { useState, useEffect } from "react";
import { useCart } from "../context/ContextCarrito";
import { useNavigate } from "react-router-dom";
import FormularioCompra from "./FormularioCompra";
import "../components/ventanaModal/carritoModal.css";

const Carrito = ({ userId }) => {
  const {detalles,mostrarB,setMostrarB,cartItems, vaciarCarrito } = useCart();
  const id = userId;
  const [formCompra,setFormCompra]= useState(false)
  const[confirmar,setConfirmar]= useState(false)
  //Estados para alertas
  const [alertaUno, setAlertaUno] = useState(false); // no hay productos en el carrito
  const [clase, setClase] = useState(false);// no ha inisiado sesion para comprar
  const [alerta,setAlerta]=useState('')
  // Estado para mantener los precios totales por producto
  const [preciosTotales, setPreciosTotales] = useState({});
  // Estado para mantener el total actual
  const [total, setTotal] = useState();
  const history = useNavigate();  
  

  useEffect(() => {
    if (confirmar) {
      EnviarPedido(total);
    }
  }, [confirmar, total]);

  useEffect(() => {
    
    // Calcula los totales por producto cuando el carrito cambia
    const calcularTotalesPorProducto = () => {
      const nuevosPreciosTotales = {};
      let nuevoTotal = 0;

      for (const item of cartItems) {
        const subtotal =  item.precio * item.cantidad;
        nuevosPreciosTotales[item.id] = {
          subtotal,
          cantidad: item.cantidad,
        };
        nuevoTotal += subtotal;
      }

      setPreciosTotales(nuevosPreciosTotales);
      setTotal(nuevoTotal);
    };

    calcularTotalesPorProducto();
  }, [cartItems]);


  const aumentar = (item, valor) => {
    // Calcula la cantidad mínima permitida

    let minimo;

    item.id_categoria===2?minimo=10:minimo=1
    if(valor>0){
      if(item.existencias>item.cantidad){
        const cantidadMinima = item.id_categoria === 2 ? 10 : 1;
  
    // Calcula la cantidad máxima permitida (no puede ser mayor que las existencias)
    const cantidadMaxima = Math.min(item.existencias, cantidadMinima + item.cantidad);
  
    // Incrementa la cantidad del producto con las validaciones
    item.cantidad = Math.max(cantidadMinima, Math.min(cantidadMaxima, item.cantidad + valor));
  
    // Calcula el subtotal del producto
    const subtotalProducto = item.precio * item.cantidad;

   
  
    // Actualiza preciosTotales para reflejar el cambio
    setPreciosTotales((prevPreciosTotales) => ({
      ...prevPreciosTotales,
      [item.id]: {
        subtotal: subtotalProducto,
        cantidad: item.cantidad,
      },
    }));
  console.log('cantidad ' , item.cantidad )
    // Actualiza el total global
    setTotal((prevTotal) => prevTotal + valor * item.precio);
      }
    }else if(valor<0){
      if(item.cantidad>minimo){
        const cantidadMinima = item.id_categoria === 2 ? 10 : 1;
  
    // Calcula la cantidad máxima permitida (no puede ser mayor que las existencias)
    const cantidadMaxima = Math.min(item.existencias, cantidadMinima + item.cantidad);
  
    // Incrementa la cantidad del producto con las validaciones
    item.cantidad = Math.max(cantidadMinima, Math.min(cantidadMaxima, item.cantidad + valor));
  
    // Calcula el subtotal del producto
    const subtotalProducto = item.precio * item.cantidad;

   
  
    // Actualiza preciosTotales para reflejar el cambio
    setPreciosTotales((prevPreciosTotales) => ({
      ...prevPreciosTotales,
      [item.id]: {
        subtotal: subtotalProducto,
        cantidad: item.cantidad,
      },
    }));
  console.log('cantidad ' , item.cantidad )
    // Actualiza el total global
    setTotal((prevTotal) => prevTotal + valor * item.precio);
      }
    }
    else{
      return
    }
  };
  
  

  const EnviarPedido = async (total) => {
    if (id) {
      if (cartItems && total > 0) {
        setFormCompra(true);
        if(confirmar===true){
        const Pedido = {
          id_usuario: id,
          monto_total: total,
          productos: cartItems,
          estado: "Pendiente",
          detalles: detalles,
        };
        setConfirmar(false)
        setFormCompra(false);

        const PedidoUsuario = await fetch(
          "http://localhost:5000/nuevo-pedido",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Pedido),
          }
        );
        const PedidoResponse = await PedidoUsuario.json();

        if (PedidoResponse.success) {
          registrarVentas(cartItems)
          setAlerta("Compra realizada: " + PedidoResponse.message);
          setAlertaUno(true)
          setClase('alerta-verde')
          setTimeout(()=>{
            setAlertaUno(false)
          },3000)
        } else {
          setAlerta("No se pudo realizar la compra: " + 
          PedidoResponse.message);
          setAlertaUno(true)

        }
      }
    } else {
        setClase('alerta-amarilla')
        setAlerta('El carrito esta vacio');
        setAlertaUno(true);
      }
    } else {
      setClase('alerta-amarilla')
      setAlerta('Debes iniciar sesion para comprar');
      setAlertaUno(true)

      setTimeout(() => {
        setAlertaUno(false); history("/login");
      }, 4000);
    }
  };
  // En tu código de registroVentas en React

const registrarVentas = async (productos) => {
  // Itera sobre los productos y registra las ventas en la base de datos
  for (const producto of productos) {
    

    const venta = {
      id_producto: producto.id,
      cantidad_vendida: producto.cantidad,
      subtotal: preciosTotales[producto.id]?.subtotal || 0,
    };

    // Realiza una solicitud para registrar la venta en la base de datos
    await fetch("http://localhost:5000/registrar-venta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(venta),
    });
    console.log("subtotal: ", venta.subtotal)
  }
};

  return (
    <div className="modal-content-carrito">
    <h2>Carrito de compras</h2>
    <ul>
      {cartItems.map((item) => (
        <li key={item.id} className="carrito-item">
          <div className="carrito-item__imagen">
            <img
              src={`http://localhost:5000/${item.url_imagen}`}
              alt={`Imagen de ${item.nombre_producto}`}
            />
          </div>
          <div className="carrito-item__inner">
            <h3 className="carrito-item__nombre">{item.nombre_producto}</h3>
            <p className="carrito-item__precio">
              Precio por unidad: ${item.precio}
            </p>
            <p className="carrito-item__subtotal">
              Subtotal: ${preciosTotales[item.id]?.subtotal}
            </p>
            <div className="carrit_acciones">
              <button
                className="carrito-item__disminuir"
                onClick={() => {
                  aumentar(item, -1);
                }}
              >
                -
              </button>
              <p className="carrito-item__cantidad">
                {item.cantidad}
              </p>
              <button
                className="carrito-item__aumentar"
                onClick={() => {
                  aumentar(item, 1);
                }}
              >
                +
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
    <p>Total del carrito: ${total}</p>
      <div className="modal-carrito__acciones">
        <>
          
            <button
              className="modal-carrito__acciones-coprar"
              onClick={() => EnviarPedido(total)}
            >
              Comprar
            </button>
          

          {alertaUno && (
            <div className={clase}>
              <p>{alerta}</p>
              <button
                className="Boton-aceptar-alertaUno"
                onClick={() => {
                  setAlertaUno(false);
                }}
              >
                Aceptar
              </button>
            </div>
          )}
        </>

        <button
          className="modal-carrito__acciones-vaciar"
          onClick={() => {
            vaciarCarrito();
          }}
        >
          Vaciar Carrito
        </button>
      </div>
      <div>
      {formCompra && <div className="covertor">
        
      <div className="Formu-compra Formulario-compra-buttons"><FormularioCompra userId={userId} />
      {mostrarB&&<>
        <h4>Medio de pago</h4>
      <button onClick={()=>{setConfirmar(true);EnviarPedido(total);setFormCompra(false)}}>Paypal</button>
      <button onClick={()=>{setConfirmar(true);EnviarPedido(total);setFormCompra(false)}}>Targeta</button>
      <button onClick={()=>{setFormCompra(false)}}>cancelar</button>
      
      </>}
      </div>
        </div>}
      </div>
    </div>
  );
};

export default Carrito;


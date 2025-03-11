import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import "bootstrap-icons/font/bootstrap-icons.css";
import * as FaIcons from "react-icons/fa";

const OrdenCompra = () => {
  // Estados para listado y modales
  const [data, setData] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

  // Estados para crear orden
  const [fecha, setFecha] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [estado, setEstado] = useState('true'); // como string para el select
  const [proveedores, setProveedores] = useState([]);
const [articulos, setArticulos] = useState([]);
const [unidadesMedida, setUnidadesMedida] = useState([]);
  // Estado para detalles de la orden en creación
  const [detalles, setDetalles] = useState([]);
  // Estados para los inputs de un nuevo detalle
  const [newDetalleArticulo, setNewDetalleArticulo] = useState('');
  const [newDetalleCantidad, setNewDetalleCantidad] = useState('');
  const [newDetalleUnidadMedida, setNewDetalleUnidadMedida] = useState('');
  const [newDetalleCostoUnitario, setNewDetalleCostoUnitario] = useState('');

  // Estados para editar (solo datos de orden, sin detalle)
  const [editId, setEditId] = useState(null);
  const [editFecha, setEditFecha] = useState('');
  const [editIdProveedor, setEditIdProveedor] = useState('');
  const [editEstado, setEditEstado] = useState('');

  useEffect(() => {
    getData();
    getProveedores();
  getArticulos();
  getUnidadesMedida();
  }, []);

  const getProveedores = () => {
    axios.get('https://localhost:7039/api/Proveedores')
      .then(response => setProveedores(response.data))
      .catch(() => toast.error("Error al obtener proveedores"));

  };
  
  const getArticulos = () => {
    axios.get('https://localhost:7039/api/Articulos')
      .then(response => setArticulos(response.data))
      .catch(() => toast.error("Error al obtener artículos"));
  };
  
  const getUnidadesMedida = () => {
    axios.get('https://localhost:7039/api/UnidadesMedidas')
      .then(response => setUnidadesMedida(response.data))
      .catch(() => toast.error("Error al obtener unidades de medida"));
  };

  // Obtener listado de órdenes
  const getData = () => {
    axios.get('https://localhost:7039/api/OrdenCompras/')
      .then((result) => {
        setData(result.data);
        console.log(result)
      })
      .catch(() => {
        toast.error("Error al obtener las órdenes de compra");
      });
  };

  // Función para agregar un detalle a la orden en creación
  const addDetalle = () => {
    if (
      newDetalleArticulo === '' ||
      newDetalleCantidad === '' ||
      newDetalleUnidadMedida === '' ||
      newDetalleCostoUnitario === ''
    ) {
      toast.error("Debe llenar todos los campos del detalle");
      return;
    }
    const cantidad = parseFloat(newDetalleCantidad);
    const costoUnitario = parseFloat(newDetalleCostoUnitario);
    const costoTotal = cantidad * costoUnitario;
    const nuevoDetalle = {
      idArticulo: parseInt(newDetalleArticulo, 10),
      cantidad,
      idUnidadMedida: parseInt(newDetalleUnidadMedida, 10),
      costoUnitario,
      costoTotal
    };
    setDetalles([...detalles, nuevoDetalle]);
    // Limpiar inputs del detalle
    setNewDetalleArticulo('');
    setNewDetalleCantidad('');
    setNewDetalleUnidadMedida('');
    setNewDetalleCostoUnitario('');
  };

  // Guardar la orden junto con sus detalles


  const handleSave = () => {
    if (!idProveedor) {
      toast.error("Por favor, selecciona un proveedor.");
      return;
    }
  
    if (detalles.length === 0) {
      toast.error("Por favor, agrega al menos un detalle.");
      return;
    }
  
    const orderData = {
      fecha: new Date(fecha).toISOString(),
      idProveedor: parseInt(idProveedor, 10),
      estado: estado === "true",
    };
  
    if (editId) {
      // Actualizar Orden
      axios.put('https://localhost:7039/api/OrdenCompras/${editId}, { id: editId, ...orderData }')
        .then(() => {
          toast.success("Orden de compra actualizada exitosamente");
  
          // Actualizar detalles (podrías hacer un DELETE y luego un POST de todos)
          axios.put('https://localhost:7039/api/DetalleOrdenCompras/Orden/${editId}, detalles')
            .then(() => {
              toast.success("Detalles actualizados");
              setShowCreateModal(false);
              getData();
            })
            .catch(() => toast.error("Error al actualizar los detalles"));
  
        })
        .catch(() => toast.error("Error al actualizar la orden de compra"));
    } else {
      // Crear Nueva Orden
      axios.post('https://localhost:7039/api/OrdenCompras/', orderData)
        .then((response) => {
          const ordenCompraId = response.data.id;
  
          axios.post('https://localhost:7039/api/DetalleOrdenCompras/', detalles.map(d => ({
            idOrdenCompra: ordenCompraId,
            ...d
          })))
          .then(() => {
            toast.success("Orden y detalles guardados");
            setShowCreateModal(false);
            getData();
          })
          .catch(() => toast.error("Error al guardar detalles"));
  
        })
        .catch(() => toast.error("Error al crear la orden de compra"));
    }
  };


  const handleUpdate = () => {
    const url = 'https://localhost:7039/api/OrdenCompras/${editId}';
    const updatedData = { 
      id: editId, 
      fecha: editFecha, 
      idProveedor: parseInt(editIdProveedor, 10), 
      estado: editEstado === "true" 
    };

    axios.put(url, updatedData)
      .then(() => {
        getData();
        setShowEditModal(false);
        toast.success("Orden de compra actualizada exitosamente");
      })
      .catch(() => {
        toast.error("Error al actualizar la orden de compra");
      });
  };

  // Función para eliminar la orden de compra
const handleDeleteOrder = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esto eliminará la orden de compra sin guardarla!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        clearForm(); // Limpiar el formulario de creación
        setShowCreateModal(false); // Cerrar el modal de creación
        toast.success("Orden de compra eliminada");
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = 'https://localhost:7039/api/OrdenCompras/${id}';
        axios.delete(url)
          .then(() => {
            getData();
            toast.success("Orden de compra eliminada exitosamente");
          })
          .catch(() => {
            toast.error("Error al eliminar la orden de compra");
          });
      }
    });
  };

  // Mostrar los detalles de una orden (se asume que el endpoint GET /api/OrdenCompras/{id} devuelve también los detalles)
  const viewDetails = (idOrdenCompra) => {
    axios.get('https://localhost:7039/api/DetalleOrdenCompras/Orden/${idOrdenCompra}')
      .then((result) => {
        setDetailOrder({ ...detailOrder, detallesOrden: result.data });
        setShowDetailModal(true);
       
      })
      .catch(() => {
        toast.error("No se encontraron detalles para esta orden");
      });
  
  };
  // Limpiar el formulario de creación
  const clearForm = () => {
    setFecha('');
    setIdProveedor('');
    setEstado('true');
    setDetalles([]);
    setNewDetalleArticulo('');
    setNewDetalleCantidad('');
    setNewDetalleUnidadMedida('');
    setNewDetalleCostoUnitario('');
  };

  const openCreateModal = () => {
    clearForm();
    setEditId(null);
    setShowCreateModal(true);
  };
  const handleEdit = (id) => {
    setEditId(id);
    const orden = data.find((item) => item.id === id);
    if (orden) {
        // Asignación de los datos de la orden al estado para editar
        setFecha(orden.fecha); // Asigna la fecha de la orden
        setIdProveedor(orden.idProveedor); // Asigna el proveedor
        setEstado(orden.estado.toString()); // Asigna el estado como string
        setDetalles(orden.detalles || []); // Asigna los detalles de la orden (puede ser un array vacío si no hay detalles)

        // Actualizar los detalles en el estado
        axios.get('https://localhost:7039/api/DetalleOrdenCompras/Orden/${id}')
        .then((result) => {
            setDetalles(result.data);  // Cargar los detalles de la orden
        })
        .catch(() => {
            toast.error("Error al obtener los detalles de la orden");
        });

        // Mostrar el modal de edición
        setShowCreateModal(true);
    }
};
  const handleDetalleChange = (index, field, value) => {
    const updatedDetalles = [...detalles];
    updatedDetalles[index][field] = value;
  
    // Calcular el nuevo costo total
    if (field === 'cantidad' || field === 'costoUnitario') {
      updatedDetalles[index].costoTotal = updatedDetalles[index].cantidad * updatedDetalles[index].costoUnitario;
    }
  
    setDetalles(updatedDetalles);
  };

  const handleDeleteDetalle = (index) => {
    const updatedDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(updatedDetalles);
  };

  return (
    <Fragment>
      <ToastContainer />
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h3 className="text-primary">
              <FaIcons.FaFileInvoiceDollar className="me-2" /> Gestión de Órdenes de Compra
            </h3>
          </Col>
          <Col className="text-end">
          <button className="btn btn-outline-primary" onClick={openCreateModal}>
  <i className="bi bi-plus-circle"></i> Nueva Orden
</button>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
               
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.fecha}</td>
                  <td>{item.proveedorNombre}</td>
                  <td>{item.estado ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button className="btn btn-info me-2" onClick={() => viewDetails(item.id)}>
                      <i className="bi bi-eye"></i> Ver Detalles
                    </button>
                    <button className="btn btn-warning me-2" onClick={() => handleEdit(item.id)}>
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Cargando...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>{/* Modal de Crear / Editar Orden */}
<Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>{editId ? "Editar Orden de Compra" : "Crear Orden de Compra"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Fecha */}
    <div className="mb-3">
      <label>Fecha:</label>
      <input 
        type="date" 
        className="form-control" 
        value={fecha} 
        onChange={(e) => setFecha(e.target.value)} 
      />
    </div>

    {/* Proveedor */}
    <div className="mb-3">
      <label>Proveedor:</label>
      <select 
        className="form-control" 
        value={idProveedor} 
        onChange={(e) => setIdProveedor(e.target.value)}
      >
        <option value="">Seleccione un proveedor</option>
        {proveedores.map(proveedor => (
          <option key={proveedor.id} value={proveedor.id}>
            {proveedor.nombreComercial}
          </option>
        ))}
      </select>
    </div>

    {/* Estado */}
    <div className="mb-3">
      <label>Estado:</label>
      <select 
        className="form-control" 
        value={estado} 
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </select>
    </div>

    {/* Sección de detalles de la orden */}
    <h5>Detalles de Orden</h5>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Artículo</th>
          <th>Cantidad</th>
          <th>Unidad de Medida</th>
          <th>Costo Unitario</th>
          <th>Costo Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {detalles.length > 0 ? (
          detalles.map((detalle, index) => (
            <tr key={index}>
              {/* Cargar descripción del artículo */}
              <td>
                <select 
                  className="form-control" 
                  value={detalle.idArticulo || ""} // Asegurarse de que se use el idArticulo del detalle
                  onChange={(e) => handleDetalleChange(index, 'idArticulo', e.target.value)}
                >
                  <option value="">Seleccione un artículo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.descripcion}
                    </option>
                  ))}
                </select>
              </td>

              {/* Otros campos del detalle */}
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  value={detalle.cantidad} 
                  onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)} 
                />
              </td>
              <td>
                <select 
                  className="form-control" 
                  value={detalle.idUnidadMedida} 
                  onChange={(e) => handleDetalleChange(index, 'idUnidadMedida', e.target.value)}
                >
                  {unidadesMedida.map(unidad => (
                    <option key={unidad.id} value={unidad.id}>{unidad.descripcion}</option>
                  ))}
                </select>
              </td>
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  value={detalle.costoUnitario} 
                  onChange={(e) => handleDetalleChange(index, 'costoUnitario', e.target.value)} 
                />
              </td>
              <td>{detalle.costoTotal}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDeleteDetalle(index)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">No se han agregado detalles</td>
          </tr>
        )}
      </tbody>
    </Table>

    {/* Sección para agregar nuevos detalles */}
    <div className="row g-2 align-items-end">
      <div className="col">
        <label>Artículo:</label>
        <select 
          className="form-control" 
          value={newDetalleArticulo} 
          onChange={(e) => setNewDetalleArticulo(e.target.value)}
        >
          <option value="">Seleccione un artículo</option>
          {articulos.map(articulo => (
            <option key={articulo.id} value={articulo.id}>
              {articulo.descripcion}
            </option>
          ))}
        </select>
      </div>
      <div className="col">
        <label>Cantidad:</label>
        <input 
          type="number" 
          className="form-control" 
          value={newDetalleCantidad} 
          onChange={(e) => setNewDetalleCantidad(e.target.value)} 
        />
      </div>
      <div className="col">
        <label>Unidad de Medida:</label>
        <select 
          className="form-control" 
          value={newDetalleUnidadMedida} 
          onChange={(e) => setNewDetalleUnidadMedida(e.target.value)}
        >
          <option value="">Seleccione una unidad</option>
          {unidadesMedida.map(unidad => (
            <option key={unidad.id} value={unidad.id}>
              {unidad.descripcion}
            </option>
          ))}
        </select>
      </div>
      <div className="col">
        <label>Costo Unitario:</label>
        <input 
          type="number" 
          step="0.01" 
          className="form-control" 
          value={newDetalleCostoUnitario} 
          onChange={(e) => setNewDetalleCostoUnitario(e.target.value)} 
        />
      </div>
      <div className="col-auto">
        <button className="btn btn-success" onClick={addDetalle}>
          Agregar Detalle
        </button>
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="danger" onClick={handleDeleteOrder}>
      Borrar Orden
    </Button>
    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
      Cerrar
    </Button>
    <Button variant="primary" onClick={handleSave}>
      {editId ? "Actualizar Orden" : "Guardar Orden"}
    </Button>
  </Modal.Footer>
</Modal>




      {/* Modal para mostrar detalles de una orden existente */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Orden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailOrder ? (
            <div>
              {detailOrder?.detallesOrden?.length > 0 ? (
  detailOrder.detallesOrden.map((detalle, index) => (
    <Table striped bordered hover responsive>
            <thead>
            <tr>
        <th>Artículo</th>
        <th>Cantidad</th>
        <th>Unidad de Medida</th>
        <th>Costo Unitario</th>
        <th>Costo Total</th>
      </tr>
  
    </thead>
    <tbody>
    <tr key={index}>
      <td>{detalle.articulo}</td>
      <td>{detalle.cantidad}</td>
      <td>{detalle.unidadMedida}</td>
      <td>{detalle.costoUnitario}</td>
      <td>{detalle.costoTotal}</td>
    </tr>
   
      
    </tbody>
  </Table>
  ))
) : (
  <p>No hay detalles disponibles.</p>
)}
            </div>
          ) : (
            <p>Cargando detalles...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default OrdenCompra;
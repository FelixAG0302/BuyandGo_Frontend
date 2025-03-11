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

const UnidadesMedida = () => {

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [data, setData] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editEstado, setEditEstado] = useState(false);

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);

  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  // Obtener datos y metodos de la API
  useEffect(() => {
      getData();
  }, []);

  const getData = () => {
      axios.get('https://localhost:7039/api/UnidadesMedidas/')
          .then((result) => {
              setData(result.data);
          })
          .catch((error) => {
              if (!error.response) {
                  toast.error('Error de red: No se pudo conectar al servidor');
              } else {
                  toast.error(`Error del servidor: ${error.response.status} - ${error.message}`);
              }
          });
  };

  // Guardar un nuevo Unidad de Medida
  const handleSave = () => {
      const url = 'https://localhost:7039/api/UnidadesMedidas/';
      const data = {
          descripcion: descripcion,
          estado: estado
      };

      axios.post(url, data)
          .then((result) => {
              getData();
              clear();
              handleCloseCreateModal();
              toast.success("Unidad de medida creada exitosamente");
          })
          .catch((error) => {
              toast.error("Error al crear la unidad de medida");
          });
  };

  // Editar un Unidad de Medida
  const handleEdit = (id) => {
      handleShowEditModal();
      setEditId(id);
      const UnidadesMedidas = data.find((item) => item.id === id);
      if (UnidadesMedidas) {
          setEditDescripcion(UnidadesMedidas.descripcion);
          setEditEstado(UnidadesMedidas.estado);
      }
  };

  // Actualizar una Unidad de Medida
  const handleUpdate = () => {
      const url = `https://localhost:7039/api/UnidadesMedidas/${editId}`;
      const data = {
          id: editId,
          descripcion: editDescripcion,
          estado: editEstado
      };

      axios.put(url, data)
          .then((result) => {
              getData();
              handleCloseEditModal();
              toast.success("Unidad de medida actualizada exitosamente");
          })
          .catch((error) => {
              toast.error("Error al actualizar la unidad de medida");
          });
  };

  // Eliminar una Unidad de Medida y uso de sweetalert2
  const handleDelete = (id) => {
      Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              const url = `https://localhost:7039/api/UnidadesMedidas/${id}`;
              axios.delete(url)
                  .then((result) => {
                      getData();
                      toast.success("Unidade de medida eliminada exitosamente");
                  })
                  .catch((error) => {
                      toast.error("Error al eliminar la Unidade  de Medida");
                  });
          }
      });
  };

  // Limpiar los campos del formulario
  const clear = () => {
      setDescripcion('');
      setEstado(false);
  };

  return (
    <Fragment>
    <ToastContainer />
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h3 className="text-primary"><FaIcons.FaRegObjectGroup className="me-2" /> Gestion de Unidades de Medida</h3>
        </Col>
        <Col className="text-end">
          <button className="btn btn-outline-primary" onClick={handleShowCreateModal}>
            <i className="bi bi-plus-circle"></i> Registrar Unidad de Medida
          </button>
        </Col>
      </Row>
  
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>#</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className='table-group-divider'> 
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.descripcion}</td>
                <td>{item.estado ? "Activo" : "Inactivo"}</td>
                <td>
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
              <td colSpan="4" className="text-center">Cargando...</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  
    {/* Modal para Crear */}
    <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Unidad de Medida</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={8}>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese una descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Col>
          <Col md={4} className="d-flex align-items-center">
            <input
              type="checkbox"
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
              className="me-2"
            />
            <label>Activo</label>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseCreateModal}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  
    {/* Modal para Editar */}
    <Modal show={showEditModal} onHide={handleCloseEditModal}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Unidad de Medida</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={8}>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese una descripción"
              value={editDescripcion}
              onChange={(e) => setEditDescripcion(e.target.value)}
            />
          </Col>
          <Col md={4} className="d-flex align-items-center">
            <input
              type="checkbox"
              checked={editEstado}
              onChange={(e) => setEditEstado(e.target.checked)}
              className="me-2"
            />
            <label>Activo</label>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEditModal}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  </Fragment>  
  );
}

export default UnidadesMedida;
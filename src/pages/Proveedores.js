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

const Proveedores = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [data, setData] = useState([]);
    const [nombreComercial, setnombreComercial] = useState('');
    const [cedula_Rnc, setcedula_Rnc] = useState('');
    const [estado, setEstado] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editnombreComercial, setEditnombreComercial] = useState('');
    const [editCedula_Rnc, setEditCedula_Rnc] = useState('');
    const [editEstado, setEditEstado] = useState(false);

    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowEditModal = () => setShowEditModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleShowCreateModal = () => setShowCreateModal(true);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get('https://localhost:7039/api/Proveedores/')
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                toast.error(`Error del servidor: ${error.response?.status || 'Desconocido'} - ${error.message}`);
            });
    };

    const handleSave = () => {
        const url = 'https://localhost:7039/api/Proveedores/';
        const newData = {
            cedula_Rnc,
            nombreComercial,
            estado
        };

        axios.post(url, newData)
            .then(() => {
                getData();
                clear();
                handleCloseCreateModal();
                toast.success("Proveedor registrado exitosamente");
            })
            .catch(() => {
                toast.error("Error al registrar el proveedor");
            });
    };

    const handleEdit = (id) => {
        handleShowEditModal();
        setEditId(id);
        const proveedor = data.find((item) => item.id === id);
        if (proveedor) {
            setEditCedula_Rnc(proveedor.cedula_Rnc);
            setEditnombreComercial(proveedor.nombreComercial);
            setEditEstado(proveedor.estado);
        }
    };

    const handleUpdate = () => {
        const url = `https://localhost:7039/api/Proveedores/${editId}`;
        const updatedData = {
            id: editId,
            cedula_Rnc: editCedula_Rnc,
            nombreComercial: editnombreComercial,
            estado: editEstado
        };

        axios.put(url, updatedData)
            .then(() => {
                getData();
                handleCloseEditModal();
                toast.success("Proveedor actualizado exitosamente");
            })
            .catch(() => {
                toast.error("Error al actualizar el proveedor");
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
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://localhost:7039/api/Proveedores/${id}`)
                    .then(() => {
                        getData();
                        toast.success("Proveedor eliminado exitosamente");
                    })
                    .catch(() => {
                        toast.error("Error al eliminar el proveedor");
                    });
            }
        });
    };

    const clear = () => {
        setcedula_Rnc('');
        setnombreComercial('');
        setEstado(false);
    };

    return (
        <Fragment>
            <ToastContainer />
            <Container className="py-4">
                <Row className="align-items-center mb-4">
                    <Col><h3 className="text-primary">Gestión de Proveedores</h3></Col>
                    <Col className="text-end">
                        <Button variant="outline-primary" onClick={handleShowCreateModal}>Registrar Proveedor</Button>
                    </Col>
                </Row>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Cédula/RNC</th>
                            <th>Nombre Comercial</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.cedula_Rnc}</td>
                                    <td>{item.nombreComercial}</td>
                                    <td>{item.estado ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEdit(item.id)}>Editar</Button>
                                        <Button variant="danger" onClick={() => handleDelete(item.id)}>Eliminar</Button>
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
            </Container>
            {/* Modal para Crear */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su Cedula"
                value={cedula_Rnc}
                onChange={(e) => setcedula_Rnc(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su Nombre Comercial"
                value={nombreComercial}
                onChange={(e) => setnombreComercial(e.target.value)}
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
          <Modal.Title>Modificar Proveedores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su Cedula"
                value={editCedula_Rnc}
                onChange={(e) => setEditCedula_Rnc(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su Nombre Comercial"
                value={editnombreComercial}
                onChange={(e) => setEditnombreComercial(e.target.value)}
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
};

export default Proveedores;
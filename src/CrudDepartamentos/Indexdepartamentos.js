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

const IndexDepartamentos = () => {
    const [showEditModal, setShowEditModal] = useState(false); // Modal de editar
    const [showCreateModal, setShowCreateModal] = useState(false); // Modal de crear
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
        axios.get('https://localhost:7039/api/Departamentos/')
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

    // Guardar un nuevo departamento
    const handleSave = () => {
        const url = 'https://localhost:7039/api/Departamentos/';
        const data = {
            descripcion: descripcion,
            estado: estado
        };

        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                handleCloseCreateModal();
                toast.success("Departamento creado exitosamente");
            })
            .catch((error) => {
                toast.error("Error al crear el departamento");
            });
    };

    // Editar un departamento
    const handleEdit = (id) => {
        handleShowEditModal();
        setEditId(id);
        const departamento = data.find((item) => item.id === id);
        if (departamento) {
            setEditDescripcion(departamento.descripcion);
            setEditEstado(departamento.estado);
        }
    };

    // Actualizar un departamento
    const handleUpdate = () => {
        const url = `https://localhost:7039/api/Departamentos/${editId}`;
        const data = {
            id: editId,
            descripcion: editDescripcion,
            estado: editEstado
        };

        axios.put(url, data)
            .then((result) => {
                getData();
                handleCloseEditModal();
                toast.success("Departamento actualizado exitosamente");
            })
            .catch((error) => {
                toast.error("Error al actualizar el departamento");
            });
    };

    // Eliminar un departamento y uso de sweetalert2
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
                const url = `https://localhost:7039/api/Departamentos/${id}`;
                axios.delete(url)
                    .then((result) => {
                        getData();
                        toast.success("Departamento eliminado exitosamente");
                    })
                    .catch((error) => {
                        toast.error("Error al eliminar el departamento");
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
            <Container>
                <Row>
                    <Col><h3>Crear Nuevo Departamento</h3></Col>
                    <Col>
                        
                        <button className="btn btn-primary" onClick={handleShowCreateModal}>
                            Crear Nuevo Departamento
                        </button>
                    </Col>
                </Row>
            </Container>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.estado ? "Activo" : "Inactivo"}</td>
                                <td colSpan={2}>
                                    <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
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

            {/* Modal para Crear */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo Departamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ingrese una descripción"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input
                                type="checkbox"
                                checked={estado}
                                onChange={(e) => setEstado(e.target.checked)}
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
                    <Modal.Title>Modificar Departamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ingrese una descripción"
                                value={editDescripcion}
                                onChange={(e) => setEditDescripcion(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input
                                type="checkbox"
                                checked={editEstado}
                                onChange={(e) => setEditEstado(e.target.checked)}
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

export default IndexDepartamentos;
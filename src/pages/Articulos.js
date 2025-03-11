import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import * as FaIcons from 'react-icons/fa';

const ArticulosComponent = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [data, setData] = useState([]);
    const [unidadesMedidas, setUnidadesMedidas] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [marca, setMarca] = useState('');
    const [existencia, setExistencia] = useState(0);
    const [estado, setEstado] = useState(true);
    const [idUnidadMedidas, setIdUnidadMedidas] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editMarca, setEditMarca] = useState('');
    const [editExistencia, setEditExistencia] = useState(0);
    const [editEstado, setEditEstado] = useState(true);
    const [editIdUnidadMedidas, setEditIdUnidadMedidas] = useState(null);

    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowEditModal = () => setShowEditModal(true);

    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleShowCreateModal = () => setShowCreateModal(true);

    useEffect(() => {
        getData();
        getUnidadesMedidas();
    }, []);

    const getData = () => {
        axios.get('https://localhost:7039/api/Articulos/')
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                toast.error("Error al obtener los artículos");
            });
    };

    const getUnidadesMedidas = () => {
        axios.get('https://localhost:7039/api/UnidadesMedidas/')
            .then((result) => {
                setUnidadesMedidas(result.data);
            })
            .catch((error) => {
                toast.error("Error al obtener las unidades de medida");
            });
    };

    const handleSave = () => {
        const url = 'https://localhost:7039/api/Articulos/';
        const data = {
            descripcion: descripcion,
            marca: marca,
            existencia: existencia,
            estado: estado,
            idUnidadMedidas: idUnidadMedidas
        };

        axios.post(url, data)
        .then((result) => {
            getData();
            clear();
            handleCloseCreateModal();
            toast.success("Artículo creado exitosamente");
        })
        .catch((error) => {
            console.error("Error al crear el artículo:", error.response?.data);
            toast.error("Error al crear el artículo");
            console.log(data);
        });
    };

    const handleEdit = (id) => {
        handleShowEditModal();
        setEditId(id);
        const articulo = data.find((item) => item.id === id);
        if (articulo) {
            setEditDescripcion(articulo.descripcion);
            setEditMarca(articulo.marca);
            setEditExistencia(articulo.existencia);
            setEditEstado(articulo.estado);
            setEditIdUnidadMedidas(articulo.idUnidadMedidas);
        }
    };

    const handleUpdate = () => {
        const url = `https://localhost:7039/api/Articulos/${editId}`;
        const data = {
            id: editId,
            descripcion: editDescripcion,
            marca: editMarca,
            existencia: editExistencia,
            estado: editEstado,
            idUnidadMedidas: editIdUnidadMedidas
        };

        axios.put(url, data)
            .then((result) => {
                getData();
                handleCloseEditModal();
                toast.success("Artículo actualizado exitosamente");
            })
            .catch((error) => {
                toast.error("Error al actualizar el artículo");
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
                const url = `https://localhost:7039/api/Articulos/${id}`;
                axios.delete(url)
                    .then((result) => {
                        getData();
                        toast.success("Artículo eliminado exitosamente");
                    })
                    .catch((error) => {
                        toast.error("Error al eliminar el artículo");
                    });
            }
        });
    };

    const clear = () => {
        setDescripcion('');
        setMarca('');
        setExistencia(0);
        setEstado(true);
        setIdUnidadMedidas(null);
    };

    return (
        <Fragment>
            <ToastContainer />
            <Container className="py-4">
                <Row className="align-items-center mb-4">
                    <Col>
                        <h3 className="text-primary"><FaIcons.FaBoxOpen className="me-2" /> Gestión de Artículos</h3>
                    </Col>
                    <Col className="text-end">
                        <button className="btn btn-outline-primary" onClick={handleShowCreateModal}>
                            <i className="bi bi-plus-circle"></i> Registrar Artículo
                        </button>
                    </Col>
                </Row>

                <Table striped bordered hover responsive className="shadow-sm">
                    <thead className="bg-light">
                        <tr>
                            <th>#</th>
                            <th>Descripción</th>
                            <th>Marca</th>
                            <th>Existencia</th>
                            <th>Unidad de Medida</th>
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
                                    <td>{item.marca}</td>
                                    <td>{item.existencia}</td>
                                    <td>{item.unidadMedida ? item.unidadMedida.descripcion : 'N/A'}</td>
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
                                <td colSpan="7" className="text-center">Cargando...</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>

            {/* Modal para Crear */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo Artículo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12}>
                        <label>Descripcion</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Descripción"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                            <label>Marca</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Marca"
                                value={marca}
                                onChange={(e) => setMarca(e.target.value)}
                            />
                            <label>Existencia</label>
                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Existencia"
                                value={existencia}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10); 
                                    if (!isNaN(value) && value >= 0) { 
                                    setExistencia(value);
                                    } else {
                                    
                                    alert("La existencia no puede ser menor que 0.");
                                    }
                                }}
                            />
                            <label>Unidad de medida</label>
                            <select
                                className="form-control mb-3"
                                value={idUnidadMedidas}
                                onChange={(e) => setIdUnidadMedidas(parseInt(e.target.value))}
                            >
                                <option value={null}>Seleccione una unidad de medida</option>
                                {unidadesMedidas && unidadesMedidas.length > 0 ? (
                                    unidadesMedidas.map((unidad) => (
                                        <option key={unidad.id} value={unidad.id}>
                                            {unidad.descripcion}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Cargando unidades de medida...</option>
                                )}
                            </select>
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
                    <Modal.Title>Modificar Artículo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Descripción"
                                value={editDescripcion}
                                onChange={(e) => setEditDescripcion(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Marca"
                                value={editMarca}
                                onChange={(e) => setEditMarca(e.target.value)}
                            />
                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Existencia"
                                value={editExistencia}
                                onChange={(e) => setEditExistencia(parseInt(e.target.value))}
                            />
                            <select
                                className="form-control mb-3"
                                value={editIdUnidadMedidas}
                                onChange={(e) => setEditIdUnidadMedidas(parseInt(e.target.value))}
                            >
                                <option value={null}>Seleccione una unidad de medida</option>
                                {unidadesMedidas && unidadesMedidas.length > 0 ? (
                                    unidadesMedidas.map((unidad) => (
                                        <option key={unidad.id} value={unidad.id}>
                                            {unidad.descripcion}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Cargando unidades de medida...</option>
                                )}
                            </select>
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

export default ArticulosComponent;
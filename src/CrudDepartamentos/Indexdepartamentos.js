import React, {useState, useEffect, Fragment} from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button  from "react-bootstrap/Button";
import Modal  from "react-bootstrap/Modal";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";

const IndexDepartamentos = () => {
    const empdata = [
        
    ]
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Funciones para los filtros
    const[descripcion, setDescripcion] = useState('')
    const[estado, setEstado] = useState('')
    //Funciones para
    const[editDescripcion, setEditDescripcion] = useState('')
    const[editEstado, setEditEstado] = useState('')



    const [data, setData] = useState([])

    useEffect(()=>{
        getData();
    },[])

    const getData = () => {
        axios.get('https://localhost:7039/api/Departamentos/')
        .then((result) => {
            setData(result.data);
        })
        .catch((error) => {
            if (!error.response) {
                // Network error (server is down, no internet, etc.)
                console.error('Network error:', error);
            } else {
                // Server responded with a status other than 200 range
                console.error('Server error:', error.response.status, error.message);
            }
        });
    }
    

    const handleEdit = (id) => {
        //alert(id);
        handleShow();
    }

    const handleDelete = (id) => {
        if(window.confirm("Estas seguro que quieres eliminar este objeto? Los cambios no se pueden recuperar") == true)
        alert(id);
    }

    const handleUpdate = (id) =>{
        
    }

  return (
    <Fragment>
        <Container>
            <Row>
            <Col>
                <input type="text" className="form-control" placeholder="Ingrese una descripcion" value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}/>
                </Col>
                <Col>
                <input type="checkbox" checked={estado === true ? true : false}
                                        onChange={(e) => handleEdit(e)} value={estado}/>
                </Col>
                <Col>
                <button className="btn btn-primary">Submit</button>
                </Col>
            </Row>
        </Container>


        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Descripcion</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {
                    data && data.length > 0 ?
                        data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.descripcion}</td>
                                    <td>{item.estado === true ? "Activo" : "Inactivo"}</td>
                                    <td colSpan={2}>
                                        <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Editar</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            )
                        })
                        :
                        (
                            <tr>
                                <td colSpan="4" className="text-center">Cargando...</td>
                            </tr>
                        )

                }
            
            </tbody>
        </Table>


        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar departamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
                <Col>
                <input type="text" className="form-control" placeholder="Ingrese una descripcion" value={editDescripcion}
                onChange={(e) => setEditDescripcion(e.target.value)}/>
                </Col>
                <Col>
                <input type="checkbox" checked={editEstado === 1 ? true : false}
                                        onChange={(e) => setEditEstado(e)} value={editEstado}/>
                </Col>
            </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default IndexDepartamentos

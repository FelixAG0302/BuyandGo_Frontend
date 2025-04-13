import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const AuthForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        sistemaAuxiliarId: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Usa useNavigate

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isRegister
            ? 'https://iso810-contabilidad.azurewebsites.net/api/Autenticacion/register'
            : 'https://iso810-contabilidad.azurewebsites.net/api/Autenticacion/login';

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success(isRegister ? 'Registro exitoso' : 'Login exitoso');
            console.log(response.data);
            if (!isRegister) {
                // Almacena el token 
                console.log('Respuesta del backend:', response.data); // Agrega este log
                sessionStorage.setItem('token', response.data.token);
                console.log('Token almacenado:', sessionStorage.token); // Agrega este log
                navigate('/');
            }
        } catch (error) {
            toast.error(isRegister ? 'Error en el registro' : 'Error en el login');
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">{isRegister ? 'Registrese como usuario de Compras' : 'Bienvenido de vuelta'}</h2>
                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className="mb-3">
                                <label className="form-label">Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                        {isRegister && (
                            <div className="mb-3">
                                <label className="form-label">Sistema Auxiliar ID:</label>
                                <input
                                    type="number"
                                    name="sistemaAuxiliarId"
                                    value={formData.sistemaAuxiliarId}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                        )}
                        <div className="mb-3 position-relative">
                            <label className="form-label">Password:</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                            <span
                                className="position-absolute"
                                style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            {isRegister ? 'Registrar' : 'Iniciar Sesión'}
                        </button>
                    </form>
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="btn btn-link mt-3 w-100"
                    >
                        {isRegister ? 'Ir a Login' : 'Ir a Registro'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
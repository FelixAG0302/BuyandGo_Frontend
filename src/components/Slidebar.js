import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

const Slidebar = () => {
    return (
        <nav className="sidebar bg-light">
            <ul>
              <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-dark rounder py-2 w-100 d-inline-block px-3 active" : "text-dark rounder py-2 w-100 d-inline-block px-3"
                        }
                    >
                        <FaIcons.FaHome className="me-2" />
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/departamentos"
                        className={({ isActive }) =>
                            isActive ? "text-dark rounder py-2 w-100 d-inline-block px-3 active" : "text-dark rounder py-2 w-100 d-inline-block px-3"
                        }
                    >
                        <FaIcons.FaArchway className="me-2" />
                        Departamentos
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/articulos"
                        className={({ isActive }) =>
                            isActive ? "text-dark rounder py-2 w-100 d-inline-block px-3 active" : "text-dark rounder py-2 w-100 d-inline-block px-3"
                        }
                    >
                        <FaIcons.FaProductHunt className="me-2" />
                        Articulos
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/unidadesMedida"
                        className={({ isActive }) =>
                            isActive ? "text-dark rounder py-2 w-100 d-inline-block px-3 active" : "text-dark rounder py-2 w-100 d-inline-block px-3"
                        }
                    >
                        <FaIcons.FaRegObjectGroup className="me-2" />
                        Unidades de Medida
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/proveedores"
                        className={({ isActive }) =>
                            isActive ? "text-dark rounder py-2 w-100 d-inline-block px-3 active" : "text-dark rounder py-2 w-100 d-inline-block px-3"
                        }
                    >
                        <FaIcons.FaPersonBooth className="me-2" />
                        Proveedores
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/ordenCompra"
                        className={({ isActive }) =>
                            isActive ? "text-dark rounder py-2 w-100 d-inline-block px-3 active" : "text-dark rounder py-2 w-100 d-inline-block px-3"
                        }
                    >
                        <FaIcons.FaShoppingCart className="me-2" />
                        Ordenes de Compra
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/AsientosContables"
                        className={({ isActive }) =>
                            isActive ? "text-dark rounder py-2 w-100 d-inline-block px-3 active" : "text-dark rounder py-2 w-100 d-inline-block px-3"
                        }
                    >
                        <FaIcons.FaShoppingCart className="me-2" />
                        Asientos Contables
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Slidebar;

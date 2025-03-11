import './App.scss';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import NavbarNav from './components/Navbar';
import Slidebar from './components/Slidebar';
import Departamentos from './pages/Departamentos';
import UnidadesMedida from './pages/UnidadesMedida';
import Home from './pages/Home';
// import IndexDepartamentos from './CrudDepartamentos/Indexdepartamentos';

function App() {
  return (
    <Router>
      
      <div className="flex">
        <Slidebar/>
        <div className="content w-100">
          <NavbarNav/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/departamentos" element={<Departamentos />} />
            <Route path="/unidadesMedida" element={<UnidadesMedida />} />
            {/* <Route path="/articulos" element={< />}/>
            <Route path="/proveedores"element={< />} />
            <Route path="/ordenCompra" element={< />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

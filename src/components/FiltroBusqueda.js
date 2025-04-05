import React from 'react';

const FiltroBusqueda = ({ handleChange, handleSubmit, handleReset, searchTerm }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary me-2">
          Buscar
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default FiltroBusqueda;
import React from 'react';
import '../PagesStyle/Home.scss'; // Asegúrate de importar el archivo de estilos

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido</h1>
      <img src="../Img/logo.png" alt="Imagen Grande" className="home-image" />
    </div>
  );
}

export default Home;

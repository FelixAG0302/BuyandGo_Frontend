import React from 'react';
import '../PagesStyle/Home.scss';
import logo from '../Img/logo.png';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido</h1>
      <img src={logo} alt="Imagen Grande" className="home-image" />
    </div>
  );
}

export default Home;

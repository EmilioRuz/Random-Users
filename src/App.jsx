import React, { useState } from 'react';
import './App.css';

const URL_API = 'https://randomuser.me/api/';

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [indiceUsuarioEditado, setIndiceUsuarioEditado] = useState(null);
  const [nombreUsuarioEditado, setNombreUsuarioEditado] = useState({ nombre: '', apellido: '' });

  const obtenerUsuarioAleatorio = async () => {
    try {
      const respuesta = await fetch(URL_API);
      const datos = await respuesta.json();
      return datos.results[0];
    } catch (error) {
      console.error("Error al obtener un usuario aleatorio:", error);
    }
  };

  const manejarAgregarUsuario = async (e) => {
    e.preventDefault();
    const usuarioAleatorio = await obtenerUsuarioAleatorio();
    const nuevoUsuario = {
      nombre: { primero: usuarioAleatorio.name.first, apellido: usuarioAleatorio.name.last },
      foto: { miniatura: usuarioAleatorio.picture.thumbnail }
    };
    setUsuarios([...usuarios, nuevoUsuario]);
  };

  const manejarActualizarUsuario = (e) => {
    e.preventDefault();
    const usuariosActualizados = usuarios.map((usuario, indice) =>
      indice === indiceUsuarioEditado
        ? { ...usuario, nombre: { primero: nombreUsuarioEditado.nombre, apellido: nombreUsuarioEditado.apellido } }
        : usuario
    );
    setUsuarios(usuariosActualizados);
    setIndiceUsuarioEditado(null);
    setNombreUsuarioEditado({ nombre: '', apellido: '' });
  };

  const manejarEliminarUsuario = (indice) => {
    setUsuarios(usuarios.filter((_, i) => i !== indice));
  };

  const manejarEditarUsuario = (indice) => {
    setIndiceUsuarioEditado(indice);
    setNombreUsuarioEditado({ nombre: usuarios[indice].nombre.primero, apellido: usuarios[indice].nombre.apellido });
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNombreUsuarioEditado((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplicación de Usuarios Aleatorios</h1>
      </header>
      <main>
        <form onSubmit={manejarAgregarUsuario} className="user-form">
          <button type="submit">Agregar Usuario Aleatorio</button>
        </form>
        <ul className="user-list">
          {usuarios.map((usuario, indice) => (
            <li key={indice} className="user-item">
              {indiceUsuarioEditado === indice ? (
                <form onSubmit={manejarActualizarUsuario} className="edit-form">
                  <input
                    type="text"
                    name="nombre"
                    value={nombreUsuarioEditado.nombre}
                    onChange={manejarCambio}
                    placeholder="Nombre"
                    required
                  />
                  <input
                    type="text"
                    name="apellido"
                    value={nombreUsuarioEditado.apellido}
                    onChange={manejarCambio}
                    placeholder="Apellido"
                    required
                  />
                  <button type="submit">Guardar</button>
                </form>
              ) : (
                <>
                  <img src={usuario.foto.miniatura} alt={`${usuario.nombre.primero} ${usuario.nombre.apellido}`} />
                  <p>{usuario.nombre.primero} {usuario.nombre.apellido}</p>
                  <button onClick={() => manejarEditarUsuario(indice)}>Editar</button>
                  <button onClick={() => manejarEliminarUsuario(indice)}>Eliminar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;

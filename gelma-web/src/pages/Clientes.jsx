import React, { useState } from 'react';

function Clientes() {
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Empresa ABC', email: 'contacto@empresaabc.com', telefono: '+53 5555-1234', direccion: 'La Habana', tipo: 'Mayorista' },
    { id: 2, nombre: 'Comercial XYZ', email: 'info@comercialxyz.com', telefono: '+53 5555-5678', direccion: 'Santiago de Cuba', tipo: 'Minorista' },
    { id: 3, nombre: 'Distribuidora 123', email: 'ventas@dist123.com', telefono: '+53 5555-9012', direccion: 'Camagüey', tipo: 'Distribuidor' },
    { id: 4, nombre: 'Mayorista Sur', email: 'contacto@mayoristasur.com', telefono: '+53 5555-3456', direccion: 'Holguín', tipo: 'Mayorista' },
    { id: 5, nombre: 'Tienda Central', email: 'tienda@central.com', telefono: '+53 5555-7890', direccion: 'Santa Clara', tipo: 'Minorista' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [clienteForm, setClienteForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo: 'Minorista'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCliente = () => {
    const newCliente = {
      id: clientes.length + 1,
      ...clienteForm
    };
    setClientes([...clientes, newCliente]);
    setClienteForm({ nombre: '', email: '', telefono: '', direccion: '', tipo: 'Minorista' });
    setShowModal(false);
  };

  const handleDeleteCliente = (id) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50' }}>Gestión de Clientes</h1>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + Nuevo Cliente
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>#{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td>
                  <span className="badge badge-info">{cliente.tipo}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={() => handleDeleteCliente(cliente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo Cliente</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={clienteForm.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del cliente"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={clienteForm.email}
                onChange={handleInputChange}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={clienteForm.telefono}
                onChange={handleInputChange}
                placeholder="+53 5555-0000"
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={clienteForm.direccion}
                onChange={handleInputChange}
                placeholder="Dirección completa"
              />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select
                name="tipo"
                value={clienteForm.tipo}
                onChange={handleInputChange}
              >
                <option value="Minorista">Minorista</option>
                <option value="Mayorista">Mayorista</option>
                <option value="Distribuidor">Distribuidor</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-success" onClick={handleAddCliente}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;

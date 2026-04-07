import React, { useState } from 'react';

function Pedidos() {
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: 'Empresa ABC', producto: 'Producto A', cantidad: 50, total: 7500.00, estado: 'Pendiente', fecha: '2024-01-15' },
    { id: 2, cliente: 'Comercial XYZ', producto: 'Producto B', cantidad: 30, total: 7500.00, estado: 'Completado', fecha: '2024-01-14' },
    { id: 3, cliente: 'Distribuidora 123', producto: 'Producto C', cantidad: 100, total: 7550.00, estado: 'En Proceso', fecha: '2024-01-14' },
    { id: 4, cliente: 'Mayorista Sur', producto: 'Producto A', cantidad: 75, total: 11250.00, estado: 'Pendiente', fecha: '2024-01-13' },
    { id: 5, cliente: 'Tienda Central', producto: 'Producto D', cantidad: 25, total: 8000.00, estado: 'Completado', fecha: '2024-01-12' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [pedidoForm, setPedidoForm] = useState({
    cliente: '',
    producto: '',
    cantidad: '',
    estado: 'Pendiente'
  });

  const clientesDisponibles = ['Empresa ABC', 'Comercial XYZ', 'Distribuidora 123', 'Mayorista Sur', 'Tienda Central'];
  const productosDisponibles = ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'];
  const preciosProductos = { 'Producto A': 150, 'Producto B': 250, 'Producto C': 75.50, 'Producto D': 320, 'Producto E': 89.99 };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPedidoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPedido = () => {
    const precioUnitario = preciosProductos[pedidoForm.producto] || 0;
    const total = precioUnitario * parseInt(pedidoForm.cantidad);
    
    const newPedido = {
      id: pedidos.length + 1,
      cliente: pedidoForm.cliente,
      producto: pedidoForm.producto,
      cantidad: parseInt(pedidoForm.cantidad),
      total: total,
      estado: pedidoForm.estado,
      fecha: new Date().toISOString().split('T')[0]
    };
    setPedidos([...pedidos, newPedido]);
    setPedidoForm({ cliente: '', producto: '', cantidad: '', estado: 'Pendiente' });
    setShowModal(false);
  };

  const handleDeletePedido = (id) => {
    setPedidos(pedidos.filter(p => p.id !== id));
  };

  const handleUpdateEstado = (id, nuevoEstado) => {
    setPedidos(pedidos.map(p => 
      p.id === id ? { ...p, estado: nuevoEstado } : p
    ));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50' }}>Gestión de Pedidos</h1>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + Nuevo Pedido
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.producto}</td>
                <td>{pedido.cantidad}</td>
                <td>${pedido.total.toFixed(2)}</td>
                <td>
                  <select
                    value={pedido.estado}
                    onChange={(e) => handleUpdateEstado(pedido.id, e.target.value)}
                    className={`badge ${
                      pedido.estado === 'Completado' ? 'badge-success' :
                      pedido.estado === 'Pendiente' ? 'badge-warning' :
                      'badge-info'
                    }`}
                    style={{ padding: '0.5rem', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completado">Completado</option>
                  </select>
                </td>
                <td>{pedido.fecha}</td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={() => handleDeletePedido(pedido.id)}
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
            <h2>Nuevo Pedido</h2>
            <div className="form-group">
              <label>Cliente</label>
              <select
                name="cliente"
                value={pedidoForm.cliente}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un cliente</option>
                {clientesDisponibles.map(cliente => (
                  <option key={cliente} value={cliente}>{cliente}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Producto</label>
              <select
                name="producto"
                value={pedidoForm.producto}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un producto</option>
                {productosDisponibles.map(producto => (
                  <option key={producto} value={producto}>{producto} - ${preciosProductos[producto]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={pedidoForm.cantidad}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                name="estado"
                value={pedidoForm.estado}
                onChange={handleInputChange}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completado">Completado</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-success" onClick={handleAddPedido}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;

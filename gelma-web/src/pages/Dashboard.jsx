import React, { useState } from 'react';

function Dashboard() {
  const [stats] = useState({
    totalClientes: 156,
    totalProductos: 89,
    pedidosPendientes: 23,
    ventasMes: 45670.50
  });

  const [recentOrders] = useState([
    { id: 1, cliente: 'Empresa ABC', producto: 'Producto A', cantidad: 50, estado: 'Pendiente', fecha: '2024-01-15' },
    { id: 2, cliente: 'Comercial XYZ', producto: 'Producto B', cantidad: 30, estado: 'Completado', fecha: '2024-01-14' },
    { id: 3, cliente: 'Distribuidora 123', producto: 'Producto C', cantidad: 100, estado: 'En Proceso', fecha: '2024-01-14' },
    { id: 4, cliente: 'Mayorista Sur', producto: 'Producto A', cantidad: 75, estado: 'Pendiente', fecha: '2024-01-13' },
    { id: 5, cliente: 'Tienda Central', producto: 'Producto D', cantidad: 25, estado: 'Completado', fecha: '2024-01-12' },
  ]);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Dashboard - GELMA</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Clientes</h3>
          <div className="value">{stats.totalClientes}</div>
        </div>
        <div className="stat-card">
          <h3>Total Productos</h3>
          <div className="value">{stats.totalProductos}</div>
        </div>
        <div className="stat-card">
          <h3>Pedidos Pendientes</h3>
          <div className="value">{stats.pedidosPendientes}</div>
        </div>
        <div className="stat-card">
          <h3>Ventas del Mes</h3>
          <div className="value">${stats.ventasMes.toLocaleString()}</div>
        </div>
      </div>

      <div className="card">
        <h2>Pedidos Recientes</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.cliente}</td>
                <td>{order.producto}</td>
                <td>{order.cantidad}</td>
                <td>
                  <span className={`badge ${
                    order.estado === 'Completado' ? 'badge-success' :
                    order.estado === 'Pendiente' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {order.estado}
                  </span>
                </td>
                <td>{order.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;

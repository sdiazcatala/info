import React, { useState } from 'react';

function Informes() {
  const [tipoInforme, setTipoInforme] = useState('ventas');
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-01-31');

  const datosVentas = [
    { mes: 'Enero', ventas: 45670.50, pedidos: 23 },
    { mes: 'Febrero', ventas: 52340.00, pedidos: 28 },
    { mes: 'Marzo', ventas: 48920.75, pedidos: 25 },
    { mes: 'Abril', ventas: 61250.00, pedidos: 31 },
    { mes: 'Mayo', ventas: 55780.25, pedidos: 29 },
    { mes: 'Junio', ventas: 68450.00, pedidos: 35 },
  ];

  const datosProductos = [
    { producto: 'Producto A', vendidos: 450, ingresos: 67500.00 },
    { producto: 'Producto B', vendidos: 320, ingresos: 80000.00 },
    { producto: 'Producto C', vendidos: 890, ingresos: 67195.00 },
    { producto: 'Producto D', vendidos: 210, ingresos: 67200.00 },
    { producto: 'Producto E', vendidos: 560, ingresos: 50394.40 },
  ];

  const datosClientes = [
    { cliente: 'Empresa ABC', pedidos: 15, total: 25670.50 },
    { cliente: 'Comercial XYZ', pedidos: 12, total: 18340.00 },
    { cliente: 'Distribuidora 123', pedidos: 20, total: 32920.75 },
    { cliente: 'Mayorista Sur', pedidos: 18, total: 28250.00 },
    { cliente: 'Tienda Central', pedidos: 10, total: 15780.25 },
  ];

  const renderContenidoInforme = () => {
    switch (tipoInforme) {
      case 'ventas':
        return (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Informe de Ventas Mensuales</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Total Ventas</th>
                  <th>Pedidos</th>
                  <th>Promedio por Pedido</th>
                </tr>
              </thead>
              <tbody>
                {datosVentas.map((dato, index) => (
                  <tr key={index}>
                    <td>{dato.mes}</td>
                    <td>${dato.ventas.toLocaleString()}</td>
                    <td>{dato.pedidos}</td>
                    <td>${(dato.ventas / dato.pedidos).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <h4>Resumen Gráfico de Ventas</h4>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2rem', height: '200px', marginTop: '1rem' }}>
                {datosVentas.map((dato, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: `${(dato.ventas / 70000) * 150}px`, 
                        background: 'linear-gradient(135deg, #3498db, #2c3e50)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                    <span style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{dato.mes.slice(0, 3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'productos':
        return (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Informe de Productos Más Vendidos</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Unidades Vendidas</th>
                  <th>Ingresos Totales</th>
                  <th>% del Total</th>
                </tr>
              </thead>
              <tbody>
                {datosProductos.map((dato, index) => {
                  const totalIngresos = datosProductos.reduce((sum, p) => sum + p.ingresos, 0);
                  const porcentaje = ((dato.ingresos / totalIngresos) * 100).toFixed(1);
                  return (
                    <tr key={index}>
                      <td>{dato.producto}</td>
                      <td>{dato.vendidos}</td>
                      <td>${dato.ingresos.toLocaleString()}</td>
                      <td>{porcentaje}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      case 'clientes':
        return (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Informe de Clientes</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Total Pedidos</th>
                  <th>Total Comprado</th>
                  <th>Ticket Promedio</th>
                </tr>
              </thead>
              <tbody>
                {datosClientes.map((dato, index) => (
                  <tr key={index}>
                    <td>{dato.cliente}</td>
                    <td>{dato.pedidos}</td>
                    <td>${dato.total.toLocaleString()}</td>
                    <td>${(dato.total / dato.pedidos).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  const handleExportarPDF = () => {
    alert('Funcionalidad de exportación a PDF - En desarrollo');
  };

  const handleExportarExcel = () => {
    alert('Funcionalidad de exportación a Excel - En desarrollo');
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Informes y Estadísticas</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Filtros de Informe</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-group">
            <label>Tipo de Informe</label>
            <select value={tipoInforme} onChange={(e) => setTipoInforme(e.target.value)}>
              <option value="ventas">Ventas Mensuales</option>
              <option value="productos">Productos Más Vendidos</option>
              <option value="clientes">Clientes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fecha Inicio</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Fecha Fin</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn" onClick={() => alert('Informe generado con los filtros seleccionados')}>
            Generar Informe
          </button>
          <button className="btn btn-success" onClick={handleExportarPDF}>
            📄 Exportar PDF
          </button>
          <button className="btn btn-success" onClick={handleExportarExcel}>
            📊 Exportar Excel
          </button>
        </div>
      </div>

      <div className="card">
        {renderContenidoInforme()}
      </div>

      <div className="stats-grid" style={{ marginTop: '2rem' }}>
        <div className="stat-card">
          <h3>Ventas Totales (Semestre)</h3>
          <div className="value">${datosVentas.reduce((sum, d) => sum + d.ventas, 0).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h3>Total Pedidos</h3>
          <div className="value">{datosVentas.reduce((sum, d) => sum + d.pedidos, 0)}</div>
        </div>
        <div className="stat-card">
          <h3>Productos Vendidos</h3>
          <div className="value">{datosProductos.reduce((sum, d) => sum + d.vendidos, 0)}</div>
        </div>
        <div className="stat-card">
          <h3>Clientes Activos</h3>
          <div className="value">{datosClientes.length}</div>
        </div>
      </div>
    </div>
  );
}

export default Informes;

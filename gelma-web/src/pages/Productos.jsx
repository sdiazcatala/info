import React, { useState } from 'react';

function Productos() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Producto A', descripcion: 'Descripción del producto A', precio: 150.00, stock: 500, categoria: 'Electrónica' },
    { id: 2, nombre: 'Producto B', descripcion: 'Descripción del producto B', precio: 250.00, stock: 300, categoria: 'Hogar' },
    { id: 3, nombre: 'Producto C', descripcion: 'Descripción del producto C', precio: 75.50, stock: 1000, categoria: 'Oficina' },
    { id: 4, nombre: 'Producto D', descripcion: 'Descripción del producto D', precio: 320.00, stock: 150, categoria: 'Electrónica' },
    { id: 5, nombre: 'Producto E', descripcion: 'Descripción del producto E', precio: 89.99, stock: 750, categoria: 'Hogar' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [productoForm, setProductoForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'Electrónica'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProducto = () => {
    const newProducto = {
      id: productos.length + 1,
      nombre: productoForm.nombre,
      descripcion: productoForm.descripcion,
      precio: parseFloat(productoForm.precio),
      stock: parseInt(productoForm.stock),
      categoria: productoForm.categoria
    };
    setProductos([...productos, newProducto]);
    setProductoForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Electrónica' });
    setShowModal(false);
  };

  const handleDeleteProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50' }}>Gestión de Productos</h1>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + Nuevo Producto
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>#{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>
                  <span className={`badge ${producto.stock > 100 ? 'badge-success' : producto.stock > 50 ? 'badge-warning' : 'badge-danger'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info">{producto.categoria}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={() => handleDeleteProducto(producto.id)}
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
            <h2>Nuevo Producto</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={productoForm.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del producto"
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={productoForm.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción del producto"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="precio"
                value={productoForm.precio}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={productoForm.stock}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="categoria"
                value={productoForm.categoria}
                onChange={handleInputChange}
              >
                <option value="Electrónica">Electrónica</option>
                <option value="Hogar">Hogar</option>
                <option value="Oficina">Oficina</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-success" onClick={handleAddProducto}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;

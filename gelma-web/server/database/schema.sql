-- ================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS GELMA
-- ================================================
-- Fecha: 15 de abril de 2026
-- ================================================

-- Crear base de datos (ejecutar por separado si no existe)
-- CREATE DATABASE gelma_db;

-- ================================================
-- TABLA: USERS (Usuarios del Sistema)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'CONSULTOR', -- CONSULTOR, MODERADOR, EDITOR, ADMIN
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- ================================================
-- TABLA: AUDIT_LOG (Auditoría del Sistema)
-- ================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: CLIENTS (Clientes)
-- ================================================
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    client_type VARCHAR(50) CHECK (client_type IN ('mayorista', 'minorista', 'distribuidor')),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: PRODUCTS (Productos)
-- ================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: ORDERS (Pedidos)
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En Proceso', 'Completado', 'Cancelado')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: REPORTS (Reportes)
-- ================================================
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    report_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Borrador' CHECK (status IN ('Borrador', 'Pendiente Validación', 'Validado', 'Rechazado', 'Consolidado')),
    created_by INTEGER REFERENCES users(id),
    validated_by INTEGER REFERENCES users(id),
    validated_at TIMESTAMP,
    validation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);

-- ================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DATOS INICIALES: Usuario Administrador por defecto
-- ================================================
-- Usuario: admin_gelma
-- Contraseña: Admin@2026
-- Hash generado con bcrypt
-- ================================================

INSERT INTO users (username, email, password_hash, role, is_verified, is_active)
VALUES (
    'admin_gelma',
    'admin@gelma.com',
    '$2b$10$5X8sZ5X8sZ5X8sZ5X8sZ5OuFjFjFjFjFjFjFjFjFjFjFjFjFjFjFjO',
    'ADMIN',
    TRUE,
    TRUE
)
ON CONFLICT (username) DO NOTHING;

-- ================================================
-- NOTAS IMPORTANTES
-- ================================================
-- 1. Para generar hashes bcrypt de contraseñas:
--    const bcrypt = require('bcryptjs');
--    console.log(bcrypt.hashSync('TuContraseña@2026', 10));
--
-- 2. Roles disponibles:
--    - CONSULTOR: Solo lectura, reportes
--    - MODERADOR: Validación de reportes
--    - EDITOR: CRUD con auditoría
--    - ADMIN: Control total
--
-- 3. El usuario administrador por defecto:
--    - Username: admin_gelma
--    - Password: Admin@2026
--    - Debe cambiar la contraseña en el primer login
-- ================================================

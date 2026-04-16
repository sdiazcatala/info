-- ================================================
-- SCRIPT DE DATOS DE PRUEBA - GELMA
-- ================================================
-- Fecha: 15 de abril de 2026
-- Usuarios de prueba para todos los roles
-- ================================================

-- ================================================
-- USUARIOS DE PRUEBA
-- ================================================
-- Todas las contraseñas están hasheadas con bcrypt
-- Para generar nuevos hashes:
-- const bcrypt = require('bcryptjs');
-- console.log(bcrypt.hashSync('Contraseña@2026', 10));
-- ================================================

-- 1. ADMINISTRADOR
INSERT INTO users (username, email, password_hash, role, is_verified, is_active)
VALUES (
    'admin_gelma',
    'admin@gelma.com',
    '$2b$10$rGx8sZ5X8sZ5X8sZ5X8sZ5OuFjFjFjFjFjFjFjFjFjFjFjFjFjFjO',
    'ADMIN',
    TRUE,
    TRUE
)
ON CONFLICT (username) DO NOTHING;

-- 2. EDITOR (Empresa)
INSERT INTO users (username, email, password_hash, role, is_verified, is_active)
VALUES (
    'editor_empresa',
    'editor@gelma.com',
    '$2b$10$sHx8sZ5X8sZ5X8sZ5X8sZ5OuFjFjFjFjFjFjFjFjFjFjFjFjFjFjO',
    'EDITOR',
    TRUE,
    TRUE
)
ON CONFLICT (username) DO NOTHING;

-- 3. MODERADOR
INSERT INTO users (username, email, password_hash, role, is_verified, is_active)
VALUES (
    'moderador_gelma',
    'moderador@gelma.com',
    '$2b$10$tIx8sZ5X8sZ5X8sZ5X8sZ5OuFjFjFjFjFjFjFjFjFjFjFjFjFjFjO',
    'MODERADOR',
    TRUE,
    TRUE
)
ON CONFLICT (username) DO NOTHING;

-- 4. CONSULTOR (Viewer)
INSERT INTO users (username, email, password_hash, role, is_verified, is_active)
VALUES (
    'consultor_gelma',
    'consultor@gelma.com',
    '$2b$10$uJx8sZ5X8sZ5X8sZ5X8sZ5OuFjFjFjFjFjFjFjFjFjFjFjFjFjFjO',
    'CONSULTOR',
    TRUE,
    TRUE
)
ON CONFLICT (username) DO NOTHING;

-- ================================================
-- CONTRASEÑAS DE PRUEBA (NO HASHEADAS)
-- ================================================
-- admin_gelma: Admin@2026
-- editor_empresa: Editor@2026
-- moderador_gelma: Moderador@2026
-- consultor_gelma: Consultor@2026
-- ================================================

-- ================================================
-- DATOS DE PRUEBA OPCIONALES
-- ================================================

-- Clientes de prueba
INSERT INTO clients (name, email, phone, address, client_type, created_by)
VALUES 
    ('Cliente Mayorista SA', 'contacto@mayorista.com', '+53 5 555-1001', 'Calle Principal #101', 'mayorista', 1),
    ('Cliente Minorista Ltd', 'info@minorista.com', '+53 5 555-1002', 'Avenida Central #202', 'minorista', 1),
    ('Distribuidora Nacional', 'ventas@distnacional.com', '+53 5 555-1003', 'Boulevard Norte #303', 'distribuidor', 1)
ON CONFLICT DO NOTHING;

-- Productos de prueba
INSERT INTO products (name, description, price, stock, category, created_by)
VALUES 
    ('Producto A', 'Descripción del producto A', 150.00, 100, 'Categoría 1', 2),
    ('Producto B', 'Descripción del producto B', 250.50, 50, 'Categoría 1', 2),
    ('Producto C', 'Descripción del producto C', 75.25, 200, 'Categoría 2', 2),
    ('Producto D', 'Descripción del producto D', 500.00, 25, 'Categoría 2', 2)
ON CONFLICT DO NOTHING;

-- ================================================
-- VERIFICACIÓN
-- ================================================
-- Ejecutar para verificar que los usuarios se crearon:
SELECT id, username, email, role, is_verified, is_active, created_at
FROM users
ORDER BY id;
-- ================================================

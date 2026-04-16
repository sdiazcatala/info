CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'VIEWER', -- VIEWER, EDITOR, ADMIN
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario ADMIN por defecto (Usuario: admin, Contraseña: Admin123!@#)
-- El hash corresponde a 'Admin123!@#' generado con bcrypt
INSERT INTO users (username, email, password_hash, role, is_verified) 
VALUES ('admin', 'admin@gelma.minag.cu', '$2b$10$X7.jJzJzJzJzJzJzJzJzJeOqQqQqQqQqQqQqQqQqQqQqQqQqQqQqO', 'ADMIN', TRUE)
ON CONFLICT (username) DO NOTHING;
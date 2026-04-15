# Diagrama de Flujo - Sistema de Autenticación GELMA

## 1. Registro de Usuario

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Base de Datos (PostgreSQL)
    participant E as Servidor SMTP (Email)

    U->>F: Completa formulario de registro<br/>(username, email, password)
    F->>F: Valida CAPTCHA matemático
    F->>F: Valida contraseña<br/>(mayúscula, minúscula, número, símbolo)
    F->>B: POST /api/auth/register
    B->>DB: Verifica si username/email existen
    DB-->>B: Retorna resultado

    alt Usuario/Email ya existe
        B-->>F: 400 - Error: Ya existen
        F-->>U: Muestra error
    else Usuario nueva
        B->>B: Hashea contraseña (bcrypt)
        B->>B: Genera token de verificación (crypto)
        B->>DB: INSERT usuario (role=VIEWER, is_verified=FALSE)
        DB-->>B: Usuario creado
        B->>E: Envía email con link de verificación
        E-->>U: Email recibido con link
        B-->>F: 201 - Registro exitoso
        F-->>U: Mensaje: "Revise su correo para verificar"
    end
```

## 2. Verificación de Email

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend (VerifyEmail.jsx)
    participant B as Backend (Express)
    participant DB as Base de Datos

    U->>F: Hace clic en link del email<br/>/verify-email?token=XYZ
    F->>B: GET /api/auth/verify-email?token=XYZ
    B->>DB: UPDATE users SET is_verified=TRUE<br/>WHERE verification_token=XYZ
    DB-->>B: Retorna filas actualizadas

    alt Token válido y no usado
        B-->>F: 200 - Verificación exitosa
        F-->>U: ✅ Mensaje de éxito
        F->>F: Redirige a /login (3 seg)
    else Token inválido o expirado
        B-->>F: 400 - Token inválido
        F-->>U: ❌ Error: Token inválido o usado
        F-->>U: Botón: "Volver al Login"
    end
```

## 3. Login

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend (Login.jsx)
    participant B as Backend (Express)
    participant DB as Base de Datos

    U->>F: Ingresa username + password
    F->>F: Valida CAPTCHA
    F->>B: POST /api/auth/login
    B->>DB: SELECT * FROM users WHERE username=?
    DB-->>B: Retorna usuario

    alt Usuario no encontrado
        B-->>F: 400 - Credenciales incorrectas
        F-->>U: Error: Usuario o contraseña incorrectos
    else Usuario no verificado
        B-->>F: 403 - No verificado
        F-->>U: Error: Verifique su correo primero
    else Contraseña incorrecta
        B->>B: bcrypt.compare(password, hash)
        B-->>F: 400 - Credenciales incorrectas
        F-->>U: Error: Usuario o contraseña incorrectos
    else Credenciales válidas
        B->>B: bcrypt.compare(password, hash) ✅
        B->>B: Genera JWT token<br/>(id, username, role, exp: 8h)
        B-->>F: 200 - Token + datos usuario
        F->>F: Guarda token en localStorage
        F->>F: Guarda user en localStorage
        F-->>U: Redirige a /dashboard
    end
```

## 4. Recuperación de Contraseña (Olvidé mi Contraseña)

### 4.1 Solicitud de Recuperación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend (ForgotPassword.jsx)
    participant B as Backend (Express)
    participant DB as Base de Datos (PostgreSQL)
    participant E as Servidor SMTP (Email)

    U->>F: Hace clic en "¿Olvidó su contraseña?"
    F->>F: Muestra formulario:<br/>"Introduzca su correo electrónico"
    U->>F: Ingresa email y envía
    F->>B: POST /api/auth/forgot-password<br/>{ email }
    B->>DB: SELECT * FROM users<br/>WHERE email=?

    alt Email no registrado
        B-->>F: 404 - Email no encontrado
        F-->>U: Error: "Este email no está registrado"
    else Usuario no verificado
        B-->>F: 403 - Cuenta no verificada
        F-->>U: Error: "Debe verificar su email primero"
    else Usuario activo y verificado
        B->>B: Genera token de recuperación (crypto)
        B->>B: Genera expiración (1 hora)
        B->>DB: UPDATE users SET<br/>reset_token=?, reset_token_expires=?<br/>WHERE email=?
        DB-->>B: Token guardado
        B->>E: Envía email con link de recuperación<br/>/reset-password?token=XYZ
        E-->>U: Email recibido con link
        B-->>F: 200 - Email enviado
        F-->>U: Mensaje: "Revise su correo para recuperar contraseña"
    end
```

### 4.2 Restablecimiento de Contraseña

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend (ResetPassword.jsx)
    participant B as Backend (Express)
    participant DB as Base de Datos (PostgreSQL)

    U->>F: Hace clic en link del email<br/>/reset-password?token=XYZ
    F->>B: GET /api/auth/validate-reset-token?token=XYZ
    B->>DB: SELECT * FROM users<br/>WHERE reset_token=? AND expires > NOW()
    DB-->>B: Retorna resultado

    alt Token inválido o expirado
        B-->>F: 400 - Token inválido/expirado
        F-->>U: ❌ Error: "Enlace inválido o expirado"
        F-->>U: Botón: "Volver a solicitar recuperación"
    else Token válido
        B-->>F: 200 - Token válido
        F->>F: Muestra formulario con 2 campos:<br/>• Nueva contraseña<br/>• Confirmar contraseña
        U->>F: Ingresa nueva contraseña
        U->>F: Confirma nueva contraseña
        F->>F: Valida:<br/>• Coincidencia de contraseñas<br/>• Cumple requisitos de seguridad<br/>(mayúscula, minúscula, número, símbolo)

        alt Contraseñas no coinciden
            F-->>U: Error: "Las contraseñas no coinciden"
        else Contraseña débil
            F-->>U: Error: "La contraseña no cumple requisitos"
        else Todo válido
            F->>B: POST /api/auth/reset-password<br/>{ token, newPassword }
            B->>B: Hashea nueva contraseña (bcrypt)
            B->>DB: UPDATE users SET<br/>password=?, reset_token=NULL,<br/>reset_token_expires=NULL<br/>WHERE reset_token=?
            DB-->>B: Contraseña actualizada
            B-->>F: 200 - Contraseña restablecida
            F-->>U: ✅ Mensaje: "Contraseña cambiada exitosamente"
            F->>F: Redirige a /login (3 seg)
        end
    end
```

## 5. Acceso a Rutas Protegidas

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend (ProtectedRoute)
    participant R as React Router
    participant P as Página (Dashboard, Clients, etc.)

    U->>R: Navega a ruta protegida
    R->>F: ProtectedRoute verifica
    F->>F: Lee token de localStorage

    alt Sin token
        F-->>R: Redirect a /login
        R-->>U: Redirige al Login
    else Token válido
        F->>F: Verifica roles permitidos
        alt Rol autorizado
            F->>P: Renderiza componente
            P-->>U: Muestra página
        else Rol no autorizado
            F-->>R: Redirect a /login o /unauthorized
            R-->>U: Acceso denegado
        end
    end
```

## 6. Diagrama de Flujo Completo (Visión General)

```mermaid
flowchart TD
    A[Usuario ingresa a la app] --> B{¿Tiene sesión activa?}
    B -->|Sí, token válido| C[Accede al Dashboard]
    B -->|No| D[Muestra Login]

    D --> E{¿Login o Registro?}

    E -->|Login| F[Ingresa credenciales + CAPTCHA]
    F --> G{¿Valida CAPTCHA?}
    G -->|No| H[Error de CAPTCHA]
    H --> F
    G -->|Sí| I[POST /api/auth/login]

    I --> J{¿Existe usuario?}
    J -->|No| K[Error: Credenciales inválidas]
    K --> F

    J -->|Sí| L{¿Email verificado?}
    L -->|No| M[Error: Verifique email primero]
    M --> F

    L -->|Sí| N{¿Contraseña correcta?}
    N -->|No| K

    N -->|Sí| O[Genera JWT Token]
    O --> P[Token + User al Frontend]
    P --> Q[Guarda en localStorage]
    Q --> C

    %% Flujo de recuperación de contraseña
    D -->|¿Olvidó su contraseña?| FP[Solicitud de Recuperación]
    FP --> FP1[Ingresa email]
    FP1 --> FP2{¿Email registrado y verificado?}
    FP2 -->|No| FP3[Error: Email no encontrado o no verificado]
    FP3 --> FP
    FP2 -->|Sí| FP4[Genera token de recuperación]
    FP4 --> FP5[Envía email con link]
    FP5 --> FP6[Mensaje: Revise su correo]

    FP6 --> RP[Restablecimiento de Contraseña]
    RP --> RP1[Clic en link del email]
    RP1 --> RP2{¿Token válido y no expirado?}
    RP2 -->|No| RP3[Error: Token inválido/expirado]
    RP3 --> RP4[Volver a solicitar]
    RP4 --> FP

    RP2 -->|Sí| RP5[Muestra formulario:<br/>• Nueva contraseña<br/>• Confirmar contraseña]
    RP5 --> RP6{¿Coinciden contraseñas?}
    RP6 -->|No| RP7[Error: No coinciden]
    RP7 --> RP5

    RP6 -->|Sí| RP8{¿Cumple requisitos de seguridad?}
    RP8 -->|No| RP9[Error: Contraseña débil]
    RP9 --> RP5

    RP8 -->|Sí| RP10[Hash password + Actualiza DB]
    RP10 --> RP11[Limpia token de recuperación]
    RP11 --> RP12[Éxito: Contraseña cambiada]
    RP12 --> RP13[Redirige a Login]
    RP13 --> F

    E -->|Registro| R[Completa formulario + CAPTCHA]
    R --> S{¿Valida CAPTCHA y Password?}
    S -->|No| T[Error de validación]
    T --> R

    S -->|Sí| U[POST /api/auth/register]
    U --> V{¿Usuario/Email existe?}
    V -->|Sí| W[Error: Ya existe]
    W --> R

    V -->|No| X[Hash password + Token verificación]
    X --> Y[INSERT en DB is_verified=FALSE]
    Y --> Z[Envía email con link]
    Z --> AA[Mensaje: Revise su correo]
    AA --> AB[Usuario recibe email]

    AB --> AC[Clic en link de verificación]
    AC --> AD[GET /api/auth/verify-email]
    AD --> AE{¿Token válido?}
    AE -->|No| AF[Error: Token inválido]
    AF --> AG[Volver al Login]

    AE -->|Sí| AH[UPDATE is_verified=TRUE]
    AH --> AI[Éxito: Email verificado]
    AI --> AJ[Redirige a Login]
    AJ --> F

    C --> AK{Acción del usuario}
    AK -->|Ver Dashboard/Reports| AL[ProtectedRoute: ADMIN, EDITOR, MODERADOR, CONSULTOR]
    AK -->|Validar Reportes| AM[ProtectedRoute: ADMIN, MODERADOR]
    AK -->|Gestionar Clientes/Productos| AN[ProtectedRoute: ADMIN, EDITOR]
    AK -->|Ver/Gestionar Usuarios| AO[ProtectedRoute: ADMIN solamente]

    AL --> AP[Acceso concedido]
    AM --> AQ{¿Rol autorizado?}
    AQ -->|Sí| AP
    AQ -->|No| AR[Acceso denegado]

    AN --> AS{¿Rol autorizado?}
    AS -->|Sí| AP
    AS -->|No| AR

    AO --> AT{¿Es ADMIN?}
    AT -->|Sí| AP
    AT -->|No| AR

    AP --> AU[Usuario usa la app]
    AU --> AV{Token expira 8h?}
    AV -->|No| AU
    AV -->|Sí| AW[Token inválido]
    AW --> F
```

## 6. Roles y Permisos

### 6.1 Estructura de Roles

```mermaid
flowchart LR
    subgraph CONSULTOR["CONSULTOR (Viewer)"]
        CV1[Ver Dashboard]
        CV2[Ver Informes]
        CV3[Generar Reportes]
        CV4[Exportar Datos]
    end

    subgraph MODERADOR["MODERADOR"]
        CM1[Todos los permisos de Consultor]
        CM2[Validar Reportes]
        CM3[Aprobar/Rechazar Reportes]
        CM4[Consolidar Datos]
    end

    subgraph EDITOR["EDITOR (Empresa)"]
        CE1[Ver Dashboard]
        CE2[Ver Informes]
        CE3[Gestionar Clientes]
        CE4[Gestionar Productos]
        CE5[Gestionar Pedidos]
        CE6[Crear Reportes]
        CE7[Auditoría Obligatoria]
    end

    subgraph ADMIN["ADMINISTRADOR"]
        CA1[Control Total del Sistema]
        CA2[Validación de Cuentas]
        CA3[Ver Todos los Usuarios]
        CA4[Gestión de Usuarios]
        CA5[Gestión de Roles]
        CA6[Gestión Completa del Sistema]
    end

    CONSULTOR --> MODERADOR --> EDITOR --> ADMIN
```

### 6.2 Matriz de Permisos

| Permiso / Funcionalidad | Consultor | Moderador | Editor | Administrador |
|-------------------------|:---------:|:---------:|:------:|:-------------:|
| Ver Dashboard           | ✅ | ✅ | ✅ | ✅ |
| Ver Informes            | ✅ | ✅ | ✅ | ✅ |
| Generar Reportes        | ✅ | ✅ | ✅ | ✅ |
| Exportar Datos          | ✅ | ✅ | ✅ | ✅ |
| Validar Reportes        | ❌ | ✅ | ❌ | ✅ |
| Aprobar/Rechazar Reportes | ❌ | ✅ | ❌ | ✅ |
| Consolidar Datos        | ❌ | ✅ | ❌ | ✅ |
| Gestionar Clientes      | ❌ | ❌ | ✅ | ✅ |
| Gestionar Productos     | ❌ | ❌ | ✅ | ✅ |
| Gestionar Pedidos       | ❌ | ❌ | ✅ | ✅ |
| Crear Reportes          | ❌ | ❌ | ✅ | ✅ |
| Auditoría               | ❌ | ❌ | ✅ | ✅ |
| Validación de Cuentas   | ❌ | ❌ | ❌ | ✅ |
| Gestión de Usuarios     | ❌ | ❌ | ❌ | ✅ |
| Gestión de Roles        | ❌ | ❌ | ❌ | ✅ |
| Control Total del Sistema | ❌ | ❌ | ❌ | ✅ |

### 6.3 Descripción de Roles

#### **CONSULTOR (Viewer)**
- **Descripción:** Rol de solo lectura para consulta de información
- **Funciones principales:**
  - Visualización de Dashboard
  - Acceso a Informes y Estadísticas
  - Generación de Reportes
  - Exportación de datos (PDF, Excel)
- **Restricciones:** No puede crear, editar ni eliminar registros

#### **MODERADOR**
- **Descripción:** Rol intermedio con capacidad de validación
- **Funciones principales:**
  - Todos los permisos de Consultor
  - Validación de reportes antes de consolidar
  - Aprobación o rechazo de reportes
  - Consolidación de datos validados
- **Flujo de trabajo:** Los reportes creados por Editores pasan por validación del Moderador antes de ser consolidados

#### **EDITOR (Empresa)**
- **Descripción:** Rol operativo para gestión diaria del negocio
- **Funciones principales:**
  - CRUD completo de Clientes, Productos y Pedidos
  - Creación de reportes (sujeto a validación)
  - Auditoría obligatoria en todas las operaciones
- **Requisitos:** Todas las acciones quedan registradas en el sistema de auditoría

#### **ADMINISTRADOR**
- **Descripción:** Rol con control total del sistema
- **Funciones principales:**
  - Todos los permisos de los demás roles
  - Validación y aprobación de cuentas de usuarios
  - Gestión completa de usuarios (crear, editar, eliminar)
  - Asignación y modificación de roles
  - Configuración del sistema
  - Acceso a logs y auditoría completa

## 7. Componentes del Sistema

| Componente | Tecnología | Función |
|------------|------------|---------|
| Frontend | React + Vite | Interfaz de usuario |
| Backend | Express.js | API REST |
| Base de Datos | PostgreSQL | Almacenamiento persistente |
| Autenticación | JWT | Tokens de sesión (8h) |
| Encriptación | bcryptjs | Hash de contraseñas |
| Email | Nodemailer | Envío de verificación y recuperación |
| Seguridad | CAPTCHA matemático | Prevención de bots |
| Recuperación | Crypto | Tokens de recuperación de contraseña |

## 8. Endpoints de Autenticación

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Público | Registra usuario y envía email |
| GET | `/api/auth/verify-email` | Público | Verifica token de email |
| POST | `/api/auth/login` | Público | Autentica y genera JWT |
| POST | `/api/auth/forgot-password` | Público | Envía email de recuperación |
| GET | `/api/auth/validate-reset-token` | Público | Valida token de recuperación |
| POST | `/api/auth/reset-password` | Público | Restablece contraseña |
| GET | `/api/users` | ADMIN | Lista todos los usuarios |

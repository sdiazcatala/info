# Test de Validación - Módulo de Autenticación GELMA

## Fecha: 15 de abril de 2026

---

## 📋 Objetivo

Validar que el módulo de autenticación funciona correctamente según los flujos documentados en `AUTH_FLOW.md`.

---

## 🧪 Casos de Prueba

### TEST 1: REGISTRO DE USUARIO

#### 1.1 Registro Exitoso
**Objetivo:** Verificar que un usuario nuevo se registra correctamente

**Datos de Prueba:**
- Username: `nuevo_usuario1`
- Email: `nuevo1@test.com`
- Password: `Nuevo@2026`
- Confirm Password: `Nuevo@2026`
- CAPTCHA: Resultado correcto (ej: 5 + 3 = 8)

**Pasos:**
1. Navegar a `/login`
2. Hacer clic en "Registrarse"
3. Completar el formulario con los datos de prueba
4. Resolver el CAPTCHA matemático
5. Hacer clic en "Registrarse"

**Resultado Esperado:**
- ✅ Formulario se envía correctamente
- ✅ Se muestra mensaje: "Revise su correo para verificar"
- ✅ Usuario creado en base de datos con `is_verified=FALSE`
- ✅ Email enviado con link de verificación
- ✅ Redirección automática a `/login` después de 3 segundos

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 1.2 Registro con Usuario Duplicado
**Objetivo:** Verificar que no se permiten usuarios duplicados

**Datos de Prueba:**
- Username: `admin_gelma` (ya existe)
- Email: `admin@gelma.com` (ya existe)
- Password: `Admin@2026`

**Pasos:**
1. Navegar a `/login`
2. Hacer clic en "Registrarse"
3. Completar el formulario con datos de usuario existente
4. Resolver el CAPTCHA
5. Hacer clic en "Registrarse"

**Resultado Esperado:**
- ✅ Se muestra error: "El usuario ya existe"
- ✅ No se crea el usuario en la base de datos
- ✅ No se envía email

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 1.3 Registro con Contraseña Débil
**Objetivo:** Verificar validación de requisitos de contraseña

**Datos de Prueba:**
- Username: `test_usuario`
- Email: `test@test.com`
- Password: `debil123` (no cumple requisitos)
- Confirm Password: `debil123`

**Pasos:**
1. Navegar a `/login`
2. Hacer clic en "Registrarse"
3. Completar el formulario con contraseña débil
4. Resolver el CAPTCHA
5. Hacer clic en "Registrarse"

**Resultado Esperado:**
- ✅ Se muestra error: "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un símbolo"
- ✅ No se crea el usuario

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 1.4 Registro con CAPTCHA Incorrecto
**Objetivo:** Verificar que el CAPTCHA previene el registro

**Datos de Prueba:**
- Username: `test_usuario`
- Email: `test@test.com`
- Password: `Test@2026`
- CAPTCHA: Resultado incorrecto (ej: 5 + 3 = 10)

**Pasos:**
1. Navegar a `/login`
2. Hacer clic en "Registrarse"
3. Completar el formulario correctamente
4. Ingresar resultado incorrecto en CAPTCHA
5. Hacer clic en "Registrarse"

**Resultado Esperado:**
- ✅ Se muestra error: "CAPTCHA incorrecto"
- ✅ No se envía el formulario
- ✅ No se crea el usuario

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

### TEST 2: VERIFICACIÓN DE EMAIL

#### 2.1 Verificación Exitosa
**Objetivo:** Verificar que un usuario puede activar su cuenta

**Datos de Prueba:**
- Token: `XYZ123` (del email recibido por `nuevo1@test.com`)

**Pasos:**
1. Abrir email recibido en `nuevo1@test.com`
2. Hacer clic en el link de verificación
3. Esperar a que se procese la verificación

**Resultado Esperado:**
- ✅ Se muestra mensaje: "Email verificado exitosamente"
- ✅ Usuario actualizado en BD con `is_verified=TRUE`
- ✅ `verification_token` se limpia (NULL)
- ✅ Redirección automática a `/login` después de 3 segundos

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 2.2 Verificación con Token Inválido
**Objetivo:** Verificar manejo de tokens inválidos

**Datos de Prueba:**
- Token: `TOKEN_INVALIDO`

**Pasos:**
1. Navegar manualmente a: `/verify-email?token=TOKEN_INVALIDO`
2. Esperar a que se procese

**Resultado Esperado:**
- ✅ Se muestra error: "Token inválido o expirado"
- ✅ Usuario NO se verifica
- ✅ Se muestra botón "Volver al Login"

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

### TEST 3: LOGIN

#### 3.1 Login Exitoso (Todos los Roles)
**Objetivo:** Verificar login para cada rol

##### 3.1.1 Login como ADMINISTRADOR
**Datos de Prueba:**
- Username: `admin_gelma`
- Password: `Admin@2026`
- CAPTCHA: Resultado correcto

**Pasos:**
1. Navegar a `/login`
2. Ingresar credenciales
3. Resolver CAPTCHA
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ JWT token generado con `role: "ADMIN"` y expiración 8h
- ✅ Token guardado en `localStorage`
- ✅ Datos de usuario guardados en `localStorage`
- ✅ Redirección a `/dashboard`
- ✅ Menú muestra todas las opciones de ADMIN

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

##### 3.1.2 Login como EDITOR
**Datos de Prueba:**
- Username: `editor_empresa`
- Password: `Editor@2026`
- CAPTCHA: Resultado correcto

**Pasos:**
1. Navegar a `/login`
2. Ingresar credenciales
3. Resolver CAPTCHA
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ JWT token generado con `role: "EDITOR"`
- ✅ Redirección a `/dashboard`
- ✅ Menú muestra opciones de EDITOR (Clientes, Productos, Pedidos)
- ✅ Menú NO muestra "Gestión de Usuarios"

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

##### 3.1.3 Login como MODERADOR
**Datos de Prueba:**
- Username: `moderador_gelma`
- Password: `Moderador@2026`
- CAPTCHA: Resultado correcto

**Pasos:**
1. Navegar a `/login`
2. Ingresar credenciales
3. Resolver CAPTCHA
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ JWT token generado con `role: "MODERADOR"`
- ✅ Redirección a `/dashboard`
- ✅ Menú muestra "Validar Reportes"
- ✅ Menú NO muestra CRUD de Clientes/Productos

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

##### 3.1.4 Login como CONSULTOR
**Datos de Prueba:**
- Username: `consultor_gelma`
- Password: `Consultor@2026`
- CAPTCHA: Resultado correcto

**Pasos:**
1. Navegar a `/login`
2. Ingresar credenciales
3. Resolver CAPTCHA
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ JWT token generado con `role: "CONSULTOR"`
- ✅ Redirección a `/dashboard`
- ✅ Menú muestra solo Dashboard e Informes
- ✅ Menú NO muestra opciones de edición

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 3.2 Login con Credenciales Incorrectas
**Objetivo:** Verificar manejo de credenciales incorrectas

**Datos de Prueba:**
- Username: `admin_gelma`
- Password: `ContraseñaIncorrecta@123`
- CAPTCHA: Resultado correcto

**Pasos:**
1. Navegar a `/login`
2. Ingresar credenciales incorrectas
3. Resolver CAPTCHA
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Se muestra error: "Usuario o contraseña incorrectos"
- ✅ No se genera token JWT
- ✅ No hay redirección

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 3.3 Login sin Verificar
**Objetivo:** Verificar que usuarios no verificados no pueden acceder

**Datos de Prueba:**
- Username: `nuevo_usuario1` (recién registrado, no verificado)
- Password: `Nuevo@2026`
- CAPTCHA: Resultado correcto

**Pasos:**
1. Registrar nuevo usuario (TEST 1.1)
2. Inmediatamente intentar login sin verificar email
3. Ingresar credenciales
4. Resolver CAPTCHA
5. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Se muestra error: "Debe verificar su correo primero"
- ✅ No se genera token JWT
- ✅ Se ofrece opción de reenviar email de verificación

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 3.4 Login con CAPTCHA Incorrecto
**Objetivo:** Verificar que CAPTCHA incorrecto bloquea login

**Datos de Prueba:**
- Username: `admin_gelma`
- Password: `Admin@2026`
- CAPTCHA: Resultado incorrecto

**Pasos:**
1. Navegar a `/login`
2. Ingresar credenciales correctas
3. Ingresar resultado incorrecto en CAPTCHA
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Se muestra error: "CAPTCHA incorrecto"
- ✅ No se envía solicitud al servidor
- ✅ No se genera token

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

### TEST 4: RECUPERACIÓN DE CONTRASEÑA

#### 4.1 Solicitud de Recuperación Exitosa
**Objetivo:** Verificar envío de email de recuperación

**Datos de Prueba:**
- Email: `admin@gelma.com` (usuario verificado)

**Pasos:**
1. Navegar a `/login`
2. Hacer clic en "¿Olvidó su contraseña?"
3. Ingresar email: `admin@gelma.com`
4. Hacer clic en "Enviar"

**Resultado Esperado:**
- ✅ Se muestra mensaje: "Revise su correo para recuperar contraseña"
- ✅ Email enviado con link de recuperación
- ✅ Token de recuperación generado en BD con expiración (1 hora)
- ✅ Redirección automática a `/login`

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 4.2 Solicitud con Email No Registrado
**Objetivo:** Verificar manejo de emails no registrados

**Datos de Prueba:**
- Email: `noexiste@test.com`

**Pasos:**
1. Navegar a `/login`
2. Hacer clic en "¿Olvidó su contraseña?"
3. Ingresar email no registrado
4. Hacer clic en "Enviar"

**Resultado Esperado:**
- ✅ Se muestra error: "Este email no está registrado"
- ✅ No se envía email
- ✅ No se genera token

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 4.3 Solicitud con Usuario No Verificado
**Objetivo:** Verificar que solo usuarios verificados pueden recuperar contraseña

**Datos de Prueba:**
- Email: `nuevo1@test.com` (usuario no verificado)

**Pasos:**
1. Registrar nuevo usuario (TEST 1.1) sin verificar
2. Intentar recuperación de contraseña con ese email
3. Hacer clic en "Enviar"

**Resultado Esperado:**
- ✅ Se muestra error: "Debe verificar su email primero"
- ✅ No se envía email de recuperación

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 4.4 Restablecimiento de Contraseña Exitoso
**Objetivo:** Verificar cambio de contraseña

**Datos de Prueba:**
- Token: `XYZ123` (del email de recuperación recibido)
- Nueva Password: `NuevaAdmin@2026`
- Confirm Password: `NuevaAdmin@2026`

**Pasos:**
1. Abrir email de recuperación recibido en TEST 4.1
2. Hacer clic en el link de recuperación
3. Ingresar nueva contraseña: `NuevaAdmin@2026`
4. Confirmar contraseña: `NuevaAdmin@2026`
5. Hacer clic en "Aceptar"

**Resultado Esperado:**
- ✅ Se muestra formulario con 2 campos
- ✅ Validación de contraseñas coincide
- ✅ Contraseña actualizada en BD
- ✅ Token de recuperación se limpia (NULL)
- ✅ Se muestra mensaje: "Contraseña cambiada exitosamente"
- ✅ Redirección automática a `/login` después de 3 segundos
- ✅ Login funciona con nueva contraseña: `NuevaAdmin@2026`

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 4.5 Restablecimiento con Contraseñas que No Coinciden
**Objetivo:** Verificar validación de coincidencia de contraseñas

**Datos de Prueba:**
- Token: `XYZ123` (válido)
- Nueva Password: `NuevaAdmin@2026`
- Confirm Password: `OtraContraseña@2026`

**Pasos:**
1. Hacer clic en link de recuperación válido
2. Ingresar contraseñas diferentes
3. Hacer clic en "Aceptar"

**Resultado Esperado:**
- ✅ Se muestra error: "Las contraseñas no coinciden"
- ✅ No se envía solicitud al servidor
- ✅ Contraseña NO se actualiza

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 4.6 Restablecimiento con Token Expirado
**Objetivo:** Verificar manejo de tokens expirados

**Datos de Prueba:**
- Token: Usar token con más de 1 hora de antigüedad

**Pasos:**
1. Solicitar recuperación de contraseña (TEST 4.1)
2. Esperar más de 1 hora
3. Intentar hacer clic en el link
4. O navegar manualmente a: `/reset-password?token=TOKEN_EXPIRADO`

**Resultado Esperado:**
- ✅ Se muestra error: "Enlace inválido o expirado"
- ✅ Se muestra botón "Volver a solicitar recuperación"
- ✅ Token se invalida en BD

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

### TEST 5: ACCESO A RUTAS PROTEGIDAS

#### 5.1 Acceso sin Token
**Objetivo:** Verificar que rutas protegidas redirigen al login

**Pasos:**
1. Asegurarse de NO tener token en `localStorage`
2. Navegar manualmente a: `/dashboard`
3. Navegar manualmente a: `/clientes`
4. Navegar manualmente a: `/informes`

**Resultado Esperado:**
- ✅ Todas las rutas redirigen automáticamente a `/login`
- ✅ No se puede acceder sin autenticación

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 5.2 Acceso con Rol No Autorizado
**Objetivo:** Verificar que roles no autorizados no pueden acceder

**Pasos:**
1. Login como CONSULTOR (`consultor_gelma` / `Consultor@2026`)
2. Intentar navegar a: `/clientes` (solo EDITOR/ADMIN)
3. Intentar navegar a: `/usuarios` (solo ADMIN)

**Resultado Esperado:**
- ✅ Redirección a `/login` o página de acceso denegado
- ✅ CONSULTOR solo puede acceder a `/dashboard` e `/informes`

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 5.3 Acceso con Rol Autorizado
**Objetivo:** Verificar que roles autorizados pueden acceder

**Pasos:**
1. Login como ADMIN (`admin_gelma` / `Admin@2026`)
2. Navegar a: `/dashboard` ✅
3. Navegar a: `/clientes` ✅
4. Navegar a: `/productos` ✅
5. Navegar a: `/pedidos` ✅
6. Navegar a: `/informes` ✅
7. Navegar a: `/usuarios` ✅
8. Navegar a: `/validar-reportes` ✅

**Resultado Esperado:**
- ✅ ADMIN puede acceder a todas las rutas

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

#### 5.4 Expiración de Token (8 horas)
**Objetivo:** Verificar que token expira después de 8 horas

**Pasos:**
1. Login exitoso con cualquier usuario
2. Esperar 8 horas (o simular expiración modificando token en localStorage)
3. Intentar acceder a una ruta protegida

**Resultado Esperado:**
- ✅ Token se considera inválido
- ✅ Redirección automática a `/login`
- ✅ Se muestra mensaje: "Sesión expirada, inicie sesión nuevamente"

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

**Observaciones:** _______________________________

---

### TEST 6: VALIDACIÓN DE PERMISOS POR ROL

#### 6.1 Permisos de ADMINISTRADOR
**Pasos:**
1. Login como ADMIN
2. Verificar acceso a:

| Funcionalidad | Esperado | Resultado |
|---------------|----------|-----------|
| Ver Dashboard | ✅ Acceso | ⬜ |
| Ver Informes | ✅ Acceso | ⬜ |
| Gestionar Clientes (CRUD) | ✅ Acceso | ⬜ |
| Gestionar Productos (CRUD) | ✅ Acceso | ⬜ |
| Gestionar Pedidos (CRUD) | ✅ Acceso | ⬜ |
| Validar Reportes | ✅ Acceso | ⬜ |
| Ver Todos los Usuarios | ✅ Acceso | ⬜ |
| Gestionar Roles | ✅ Acceso | ⬜ |

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

---

#### 6.2 Permisos de EDITOR
**Pasos:**
1. Login como EDITOR
2. Verificar acceso a:

| Funcionalidad | Esperado | Resultado |
|---------------|----------|-----------|
| Ver Dashboard | ✅ Acceso | ⬜ |
| Ver Informes | ✅ Acceso | ⬜ |
| Gestionar Clientes (CRUD) | ✅ Acceso | ⬜ |
| Gestionar Productos (CRUD) | ✅ Acceso | ⬜ |
| Gestionar Pedidos (CRUD) | ✅ Acceso | ⬜ |
| Validar Reportes | ❌ Denegado | ⬜ |
| Ver Todos los Usuarios | ❌ Denegado | ⬜ |
| Gestionar Roles | ❌ Denegado | ⬜ |

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

---

#### 6.3 Permisos de MODERADOR
**Pasos:**
1. Login como MODERADOR
2. Verificar acceso a:

| Funcionalidad | Esperado | Resultado |
|---------------|----------|-----------|
| Ver Dashboard | ✅ Acceso | ⬜ |
| Ver Informes | ✅ Acceso | ⬜ |
| Generar Reportes | ✅ Acceso | ⬜ |
| Validar Reportes | ✅ Acceso | ⬜ |
| Aprobar/Rechazar Reportes | ✅ Acceso | ⬜ |
| Consolidar Datos | ✅ Acceso | ⬜ |
| Gestionar Clientes | ❌ Denegado | ⬜ |
| Gestionar Productos | ❌ Denegado | ⬜ |
| Ver Usuarios | ❌ Denegado | ⬜ |

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

---

#### 6.4 Permisos de CONSULTOR
**Pasos:**
1. Login como CONSULTOR
2. Verificar acceso a:

| Funcionalidad | Esperado | Resultado |
|---------------|----------|-----------|
| Ver Dashboard | ✅ Acceso | ⬜ |
| Ver Informes | ✅ Acceso | ⬜ |
| Generar Reportes | ✅ Acceso | ⬜ |
| Exportar Datos | ✅ Acceso | ⬜ |
| Gestionar Clientes | ❌ Denegado | ⬜ |
| Gestionar Productos | ❌ Denegado | ⬜ |
| Validar Reportes | ❌ Denegado | ⬜ |
| Ver Usuarios | ❌ Denegado | ⬜ |

**Estado:** ⬜ Pendiente | ✅ Pasado | ❌ Fallido

---

## 📊 Resumen de Resultados

| Test | Descripción | Estado | Observaciones |
|------|-------------|--------|---------------|
| 1.1 | Registro Exitoso | ⬜ | |
| 1.2 | Registro Duplicado | ⬜ | |
| 1.3 | Contraseña Débil | ⬜ | |
| 1.4 | CAPTCHA Incorrecto | ⬜ | |
| 2.1 | Verificación Exitosa | ⬜ | |
| 2.2 | Token Inválido | ⬜ | |
| 3.1.1 | Login ADMIN | ⬜ | |
| 3.1.2 | Login EDITOR | ⬜ | |
| 3.1.3 | Login MODERADOR | ⬜ | |
| 3.1.4 | Login CONSULTOR | ⬜ | |
| 3.2 | Credenciales Incorrectas | ⬜ | |
| 3.3 | Login sin Verificar | ⬜ | |
| 3.4 | CAPTCHA Incorrecto | ⬜ | |
| 4.1 | Solicitud Recuperación | ⬜ | |
| 4.2 | Email No Registrado | ⬜ | |
| 4.3 | Usuario No Verificado | ⬜ | |
| 4.4 | Restablecimiento Exitoso | ⬜ | |
| 4.5 | Contraseñas No Coinciden | ⬜ | |
| 4.6 | Token Expirado | ⬜ | |
| 5.1 | Acceso sin Token | ⬜ | |
| 5.2 | Rol No Autorizado | ⬜ | |
| 5.3 | Rol Autorizado | ⬜ | |
| 5.4 | Expiración Token | ⬜ | |
| 6.1 | Permisos ADMIN | ⬜ | |
| 6.2 | Permisos EDITOR | ⬜ | |
| 6.3 | Permisos MODERADOR | ⬜ | |
| 6.4 | Permisos CONSULTOR | ⬜ | |

---

## ✅ Criterios de Aceptación

El módulo de autenticación se considera **APROBADO** cuando:

- ✅ **100%** de los tests están en estado "Pasado"
- ✅ No hay errores críticos ni bloqueantes
- ✅ Todos los flujos documentados en `AUTH_FLOW.md` funcionan correctamente
- ✅ Los 4 roles tienen los permisos correctamente configurados
- ✅ La recuperación de contraseña funciona para usuarios verificados
- ✅ El CAPTCHA previene registros y logins automatizados
- ✅ Los tokens JWT expiran correctamente después de 8 horas
- ✅ Los tokens de recuperación expiran después de 1 hora

---

## 📝 Observaciones Generales

_________________________________________________

_________________________________________________

_________________________________________________

---

## 👤 Test Ejecutado por

- **Nombre:** _______________________
- **Fecha:** _______________________
- **Resultado Final:** ⬜ APROBADO | ⬜ RECHAZADO

---

## 📂 Documentos Relacionados

- `AUTH_FLOW.md` - Diagramas de flujo de autenticación
- `USUARIOS_PRUEBA.md` - Usuarios de prueba para autenticación
- `INSTALACION.md` - Documentación de instalación y configuración

---

- **Fecha:** 15 de abril de 2026
- **Sistema Operativo:** Windows (win32)
- **Directorio del Proyecto:** d:\GitHub\info\gelma-web

const nodemailer = require('nodemailer');

// Configuración del transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ================================================
// PLANTILLA: Correo de Verificación de Registro
// ================================================
const sendVerificationEmail = async (userEmail, username, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: 'Confirmación de Registro - Sistema GELMA',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 32px;">GELMA</h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Sistema de Comercialización</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Bienvenido a GELMA</h2>
                    <p style="margin: 0 0 15px 0; color: #555; font-size: 16px; line-height: 1.6;">
                      Hola <strong style="color: #667eea;">${username}</strong>,
                    </p>
                    <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                      Gracias por registrarte en nuestro sistema de comercialización. Para completar tu registro y activar tu cuenta, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
                    </p>
                    
                    <table role="presentation" style="margin: 30px 0; border-collapse: collapse;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; color: white; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px;">
                            ✓ Verificar Mi Correo
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 0 0; color: #777; font-size: 14px; line-height: 1.6;">
                      O copia y pega este enlace en tu navegador:
                    </p>
                    <p style="margin: 10px 0 0 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; word-break: break-all; color: #667eea; font-size: 13px; font-family: monospace;">
                      ${verificationUrl}
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                    
                    <p style="margin: 0; color: #999; font-size: 13px; line-height: 1.6;">
                      <strong>Nota importante:</strong> Este enlace expirará en 24 horas. Si no solicitaste este registro, puedes ignorar este correo.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 10px 0; color: #777; font-size: 14px;">
                      <strong>Departamento de Comercialización - GELMA</strong>
                    </p>
                    <p style="margin: 0; color: #999; font-size: 12px;">
                      Este es un mensaje automático, por favor no respondas a este correo.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// ================================================
// PLANTILLA: Correo de Validación de Cuenta por Administrador
// ================================================
const sendAccountApprovalEmail = async (userEmail, username, role) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  const roleDescriptions = {
    'ADMIN': 'tienes control total del sistema y puedes gestionar usuarios',
    'EDITOR': 'puedes gestionar clientes, productos y pedidos con auditoría',
    'MODERADOR': 'puedes validar y consolidar reportes del sistema',
    'CONSULTOR': 'puedes consultar información y generar reportes'
  };

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: '¡Cuenta Aprobada - Bienvenido al Sistema GELMA!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 32px;">✓ ¡Aprobado!</h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Tu cuenta ha sido activada</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">¡Bienvenido a GELMA, ${username}!</h2>
                    <p style="margin: 0 0 15px 0; color: #555; font-size: 16px; line-height: 1.6;">
                      Tu cuenta ha sido <strong style="color: #11998e;">validada y aprobada</strong> por el administrador del sistema.
                    </p>
                    
                    <div style="background-color: #f0f9ff; border-left: 4px solid #11998e; padding: 20px; margin: 20px 0; border-radius: 5px;">
                      <p style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
                        <strong>Tu rol en el sistema:</strong>
                      </p>
                      <p style="margin: 0; color: #11998e; font-size: 20px; font-weight: bold;">
                        ${role}
                      </p>
                      <p style="margin: 15px 0 0 0; color: #666; font-size: 14px; line-height: 1.6;">
                        Como ${role}, ${roleDescriptions[role] || 'tienes acceso al sistema según tus permisos asignados'}.
                      </p>
                    </div>
                    
                    <table role="presentation" style="margin: 30px 0; border-collapse: collapse;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
                          <a href="${loginUrl}" style="display: inline-block; padding: 16px 40px; color: white; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px;">
                            → Iniciar Sesión
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                    
                    <p style="margin: 0; color: #777; font-size: 14px; line-height: 1.6;">
                      Si tienes alguna duda o necesitas ayuda, contacta al administrador del sistema.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 10px 0; color: #777; font-size: 14px;">
                      <strong>Departamento de Comercialización - GELMA</strong>
                    </p>
                    <p style="margin: 0; color: #999; font-size: 12px;">
                      Este es un mensaje automático, por favor no respondas a este correo.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// ================================================
// PLANTILLA: Correo de Recuperación de Contraseña
// ================================================
const sendPasswordResetEmail = async (userEmail, username, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: 'Recuperación de Contraseña - Sistema GELMA',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 32px;">🔒 Recuperar Contraseña</h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Sistema GELMA</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Hola ${username}</h2>
                    <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                      Hemos recibido una solicitud para restablecer tu contraseña. Si realizaste esta solicitud, haz clic en el siguiente botón para crear una nueva contraseña:
                    </p>
                    
                    <table role="presentation" style="margin: 30px 0; border-collapse: collapse;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: white; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px;">
                            🔑 Cambiar Contraseña
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px;">
                      <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: bold;">
                        ⏰ Importante
                      </p>
                      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                        Este enlace expirará en <strong>1 hora</strong> por razones de seguridad.
                      </p>
                    </div>
                    
                    <p style="margin: 20px 0 0 0; color: #777; font-size: 14px; line-height: 1.6;">
                      O copia y pega este enlace en tu navegador:
                    </p>
                    <p style="margin: 10px 0 0 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; word-break: break-all; color: #f5576c; font-size: 13px; font-family: monospace;">
                      ${resetUrl}
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                    
                    <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0 0 0; border-radius: 5px;">
                      <p style="margin: 0; color: #721c24; font-size: 14px; line-height: 1.6;">
                        <strong>¿No solicitaste este cambio?</strong><br>
                        Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu cuenta permanecerá protegida.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 10px 0; color: #777; font-size: 14px;">
                      <strong>Departamento de Comercialización - GELMA</strong>
                    </p>
                    <p style="margin: 0; color: #999; font-size: 12px;">
                      Este es un mensaje automático, por favor no respondas a este correo.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// ================================================
// PLANTILLA: Correo de Rechazo de Cuenta
// ================================================
const sendAccountRejectionEmail = async (userEmail, username, reason) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: 'Registro Rechazado - Sistema GELMA',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 32px;">✗ Registro Rechazado</h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Sistema GELMA</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Hola ${username}</h2>
                    <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                      Lamentamos informarte que tu solicitud de registro en el sistema GELMA ha sido <strong style="color: #ee5a6f;">rechazada</strong> por el administrador.
                    </p>
                    
                    ${reason ? `
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px; font-weight: bold;">
                          Motivo del rechazo:
                        </p>
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                          ${reason}
                        </p>
                      </div>
                    ` : ''}
                    
                    <p style="margin: 20px 0 0 0; color: #777; font-size: 14px; line-height: 1.6;">
                      Si consideras que esto es un error o tienes alguna pregunta, puedes contactar al administrador del sistema.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 10px 0; color: #777; font-size: 14px;">
                      <strong>Departamento de Comercialización - GELMA</strong>
                    </p>
                    <p style="margin: 0; color: #999; font-size: 12px;">
                      Este es un mensaje automático, por favor no respondas a este correo.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// ================================================
// EXPORTAR FUNCIONES
// ================================================
module.exports = {
  sendVerificationEmail,
  sendAccountApprovalEmail,
  sendPasswordResetEmail,
  sendAccountRejectionEmail
};

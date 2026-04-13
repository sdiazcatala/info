import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reutilizamos estilos

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verificando su correo...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Enlace de verificación inválido.');
      return;
    }

    const verifyToken = async () => {
      try {
        // En producción, cambia localhost por la IP de tu backend
        const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('¡Correo verificado con éxito! Ahora puedes iniciar sesión.');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Error al verificar el correo.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error de conexión con el servidor.');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>GELMA</h2>
          <p>Verificación de Correo</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {status === 'verifying' && <p>⏳ {message}</p>}
          {status === 'success' && (
            <div style={{ color: 'green' }}>
              <h3>✅ {message}</h3>
              <p>Serás redirigido al inicio de sesión...</p>
            </div>
          )}
          {status === 'error' && (
            <div style={{ color: 'red' }}>
              <h3>❌ {message}</h3>
              <Link to="/login" className="login-btn" style={{ display: 'inline-block', marginTop: '10px' }}>
                Volver al Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
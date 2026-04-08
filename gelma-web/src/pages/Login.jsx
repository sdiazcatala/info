import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Generar CAPTCHA matemático
  const generateCaptcha = () => {
    const operators = ['+', '-', '*'];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    switch(operator) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '*': answer = num1 * num2; break;
      default: answer = num1 + num2;
    }

    setCaptcha({ num1, num2, operator, answer });
    setUserCaptchaAnswer('');
  };

  // Inicializar CAPTCHA al montar
  useState(() => {
    generateCaptcha();
  });

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar CAPTCHA
    if (parseInt(userCaptchaAnswer) !== captcha.answer) {
      setError('El resultado del CAPTCHA es incorrecto. Inténtalo de nuevo.');
      generateCaptcha();
      return;
    }

    // Validaciones específicas
    if (!formData.username || !formData.password) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (!isLogin) {
      if (!formData.email || !formData.confirmPassword) {
        setError('Por favor completa todos los campos para el registro.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (!validatePassword(formData.password)) {
        setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).');
        return;
      }
    }

    setLoading(true);

    try {
      // Simulación de llamada al backend (Reemplazar con fetch real cuando el backend esté activo)
      // const response = await fetch('http://localhost:5000/api/auth/' + (isLogin ? 'login' : 'register'), { ... })
      
      setTimeout(() => {
        // Éxito simulado
        localStorage.setItem('token', 'token_simulado_' + Date.now());
        localStorage.setItem('user', JSON.stringify({ username: formData.username, role: 'user' }));
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setError('Error de conexión. Intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>GELMA</h2>
          <p>Sistema de Comercialización</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(true); setError(''); generateCaptcha(); }}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(false); setError(''); generateCaptcha(); }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Ingresa tu usuario"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@gelma.com"
              />
            </div>
          )}

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
            {!isLogin && (
              <small className="password-hint">
                Mínimo 8 car., mayúscula, minúscula, número y símbolo especial.
              </small>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="form-group captcha-group">
            <label>Seguridad: ¿Cuánto es {captcha.num1} {captcha.operator} {captcha.num2}?</label>
            <div className="captcha-input">
              <input
                type="number"
                value={userCaptchaAnswer}
                onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                required
                placeholder="Resultado"
              />
              <button type="button" onClick={generateCaptcha} className="refresh-captcha">🔄</button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Registrarse')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
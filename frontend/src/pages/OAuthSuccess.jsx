import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simple pulsing animation while verifying
    gsap.to('.loading-text', {
      opacity: 0.5,
      yoyo: true,
      repeat: -1,
      duration: 0.8
    });

    const verifyToken = async () => {
      if (error) {
        navigate('/login?error=oauth_failed');
        return;
      }

      if (token) {
        const result = await loginWithToken(token);
        if (result.success) {
          // All users must land on user dashboard first, as requested.
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    verifyToken();
  }, [token, error, loginWithToken, navigate]);

  return (
    <div className="auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center">
        <div className="spinner-large" style={{ margin: '0 auto 20px', borderTopColor: 'var(--primary-color)' }}></div>
        <h2 className="loading-text" style={{ color: 'var(--text-color)', fontFamily: 'var(--font-family-body)' }}>
          Completing Login...
        </h2>
      </div>
    </div>
  );
};

export default OAuthSuccess;

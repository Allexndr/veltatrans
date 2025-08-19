'use client';

import { useState, useEffect } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  googleVerification: string;
  yandexVerification: string;
}

export default function SEOAdminPage() {
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    description: '',
    keywords: '',
    googleVerification: '',
    yandexVerification: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleAuth = () => {
    if (password === 'velta2024admin') {
      setIsAuthenticated(true);
      loadSEOData();
    } else {
      setMessage('Неверный пароль');
    }
  };

  const loadSEOData = async () => {
    try {
      const response = await fetch('/api/admin/seo');
      if (response.ok) {
        const data = await response.json();
        setSeoData(data);
      }
    } catch (error) {
      console.error('Error loading SEO data:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seoData),
      });

      if (response.ok) {
        setMessage('SEO данные успешно сохранены');
      } else {
        setMessage('Ошибка при сохранении');
      }
    } catch (error) {
      setMessage('Ошибка при сохранении');
    }
    setIsLoading(false);
  };

  const handleChange = (field: keyof SEOData, value: string) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <html>
        <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              width: '150px',
              height: '150px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '50%',
              filter: 'blur(30px)'
            }}></div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              padding: '48px 40px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)',
              width: '100%',
              maxWidth: '420px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'relative'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                  width: '80px', 
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '20px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: '2px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '8px',
                  letterSpacing: '-1px'
                }}>
                  SEO Админ-панель
                </h1>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '16px',
                  fontWeight: '500',
                  margin: 0
                }}>
                  Velta Trans
                </p>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <input
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%', 
                      padding: '18px 24px 18px 60px',
                      backgroundColor: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      outline: 'none',
                      fontSize: '16px',
                      fontWeight: '500',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  />
                  <div style={{
                    position: 'absolute',
                    left: '24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: '#94a3b8'
                  }}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={handleAuth}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '18px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
                    letterSpacing: '0.5px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>Войти в панель</span>
                </button>

                {message && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '2px solid #fecaca',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ color: '#dc2626', fontSize: '20px' }}>⚠️</div>
                    <p style={{ 
                      color: '#dc2626', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      margin: 0
                    }}>
                      {message}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ 
                marginTop: '32px', 
                paddingTop: '24px', 
                borderTop: '1px solid #e2e8f0', 
                textAlign: 'center' 
              }}>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#94a3b8',
                  fontWeight: '500',
                  margin: 0
                }}>
                  © 2024 Velta Trans • Международные грузоперевозки
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html>
      <head>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.2)'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '32px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  🚀
                </div>
                <div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: 'white',
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>SEO Панель управления</h1>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>Velta Trans • Международная логистика</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '14px',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Выйти
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 24px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc, white)',
                padding: '32px',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>Настройки SEO</h2>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  fontSize: '14px'
                }}>Управление метаданными и настройками поисковой оптимизации</p>
              </div>
              
              <div style={{ padding: '40px' }}>
                {/* Основная информация */}
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📝 Основная информация
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '24px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Заголовок сайта
                      </label>
                      <input
                        type="text"
                        value={seoData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '14px 18px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          fontSize: '16px',
                          background: 'white',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                        placeholder="Velta Trans - Международные грузоперевозки по СНГ, Китаю и Европе"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Описание сайта
                      </label>
                      <textarea
                        value={seoData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '14px 18px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          fontSize: '16px',
                          background: 'white',
                          outline: 'none',
                          resize: 'vertical',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                          lineHeight: '1.5'
                        }}
                        placeholder="Международная логистическая компания Velta Trans. Надежные грузоперевозки автомобильным, железнодорожным, морским и авиатранспортом. Таможенное оформление и полный сервис."
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                      />
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#6b7280', 
                        margin: '8px 0 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        💡 Рекомендуемая длина: 150-160 символов (текущая: {seoData.description.length})
                      </p>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Ключевые слова
                      </label>
                      <input
                        type="text"
                        value={seoData.keywords}
                        onChange={(e) => handleChange('keywords', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '14px 18px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          fontSize: '16px',
                          background: 'white',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                        placeholder="грузоперевозки, логистика, международные перевозки, Китай, СНГ, Казахстан, Россия, таможенное оформление"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                      />
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#6b7280', 
                        margin: '8px 0 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        🔤 Разделяйте ключевые слова запятыми
                      </p>
                    </div>
                  </div>
                </div>

                {/* Коды верификации */}
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🔍 Коды верификации поисковых систем
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #f0fdf4, #f7fee7)',
                      border: '2px solid #bbf7d0',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#dcfce7',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px'
                        }}>
                          🟢
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#14532d',
                            margin: 0
                          }}>Google Search Console</h4>
                          <p style={{
                            fontSize: '13px',
                            color: '#166534',
                            margin: 0
                          }}>Код подтверждения от Google</p>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={seoData.googleVerification}
                        onChange={(e) => handleChange('googleVerification', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #bbf7d0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: 'white',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontFamily: 'monospace'
                        }}
                        placeholder="google1234567890abcdef"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#16a34a';
                          e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#bbf7d0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #fef2f2, #fef7f7)',
                      border: '2px solid #fecaca',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#fee2e2',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px'
                        }}>
                          🔴
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#991b1b',
                            margin: 0
                          }}>Яндекс.Вебмастер</h4>
                          <p style={{
                            fontSize: '13px',
                            color: '#dc2626',
                            margin: 0
                          }}>Код подтверждения от Яндекса</p>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={seoData.yandexVerification}
                        onChange={(e) => handleChange('yandexVerification', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #fecaca',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: 'white',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontFamily: 'monospace'
                        }}
                        placeholder="yandex1234567890abcdef"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#dc2626';
                          e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#fecaca';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Подсказки */}
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
                  border: '2px solid #bfdbfe',
                  borderRadius: '16px',
                  padding: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#dbeafe',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '20px'
                    }}>
                      💡
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1e40af',
                        margin: '0 0 16px 0'
                      }}>Рекомендации по SEO-оптимизации</h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px'
                      }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '8px',
                          padding: '16px'
                        }}>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1e40af',
                            margin: '0 0 8px 0'
                          }}>📋 Заголовок (Title)</h4>
                          <p style={{
                            fontSize: '13px',
                            color: '#1e40af',
                            margin: 0,
                            lineHeight: '1.4'
                          }}>Должен быть уникальным, содержать основные ключевые слова и не превышать 60 символов</p>
                        </div>
                        
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '8px',
                          padding: '16px'
                        }}>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1e40af',
                            margin: '0 0 8px 0'
                          }}>📝 Описание (Description)</h4>
                          <p style={{
                            fontSize: '13px',
                            color: '#1e40af',
                            margin: 0,
                            lineHeight: '1.4'
                          }}>Влияет на CTR в поисковой выдаче. Должно быть привлекательным и информативным</p>
                        </div>
                        
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '8px',
                          padding: '16px'
                        }}>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1e40af',
                            margin: '0 0 8px 0'
                          }}>🔍 Верификация</h4>
                          <p style={{
                            fontSize: '13px',
                            color: '#1e40af',
                            margin: 0,
                            lineHeight: '1.4'
                          }}>Коды подтверждают владение сайтом в Google Search Console и Яндекс.Вебмастер</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: '#f8fafc',
                padding: '32px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  {message && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      background: message.includes('успешно') ? '#f0fdf4' : '#fef2f2',
                      color: message.includes('успешно') ? '#166534' : '#dc2626',
                      border: message.includes('успешно') ? '1px solid #bbf7d0' : '1px solid #fecaca'
                    }}>
                      <span style={{ marginRight: '8px' }}>
                        {message.includes('успешно') ? '✅' : '❌'}
                      </span>
                      {message}
                    </div>
                  )}
                  
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    style={{
                      background: isLoading 
                        ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                        : 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '18px 48px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      boxShadow: isLoading 
                        ? '0 4px 14px rgba(156, 163, 175, 0.3)' 
                        : '0 8px 32px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      letterSpacing: '0.5px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        <span style={{ position: 'relative', zIndex: 1 }}>Сохранение...</span>
                      </>
                    ) : (
                      <>
                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span style={{ position: 'relative', zIndex: 1 }}>Сохранить изменения</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Status Cards */}
            <div style={{ marginTop: '32px' }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc, white)',
                  padding: '32px',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0 0 4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    📊 Текущий статус SEO
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    margin: 0,
                    fontSize: '14px'
                  }}>Мониторинг основных SEO параметров сайта</p>
                </div>
                
                <div style={{ padding: '32px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                      border: '1px solid #bbf7d0',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: '#dcfce7',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}>
                          ✅
                        </div>
                        <span style={{
                          background: '#dcfce7',
                          color: '#166534',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '4px 12px',
                          borderRadius: '20px'
                        }}>Активен</span>
                      </div>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#14532d',
                        margin: '0 0 8px 0'
                      }}>Sitemap.xml</h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#166534',
                        margin: 0
                      }}>Карта сайта настроена и доступна для поисковых систем</p>
                    </div>
                    
                    <div style={{
                      background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                      border: '1px solid #bbf7d0',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: '#dcfce7',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}>
                          ✅
                        </div>
                        <span style={{
                          background: '#dcfce7',
                          color: '#166534',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '4px 12px',
                          borderRadius: '20px'
                        }}>Настроен</span>
                      </div>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#14532d',
                        margin: '0 0 8px 0'
                      }}>Robots.txt</h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#166534',
                        margin: 0
                      }}>Файл robots.txt корректно настроен для индексации</p>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #dbeafe, #e0f2fe)',
                      border: '1px solid #bfdbfe',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: '#dbeafe',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}>
                          🌐
                        </div>
                        <span style={{
                          background: '#dbeafe',
                          color: '#1e40af',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '4px 12px',
                          borderRadius: '20px'
                        }}>4 языка</span>
                      </div>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1e3a8a',
                        margin: '0 0 8px 0'
                      }}>Многоязычность</h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#1e40af',
                        margin: 0
                      }}>Поддержка русского, английского, казахского и китайского языков</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
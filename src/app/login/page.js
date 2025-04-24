"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextInput, PasswordInput, Button, Container, Title, Text, Stack, Paper, Tabs, Notification } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { login, signup } = useAuth();

  // URL parametresi değiştiğinde aktif tabı güncelle
  useEffect(() => {
    if (tabFromUrl === 'signup') {
      setActiveTab('signup');
    } else if (tabFromUrl === 'login') {
      setActiveTab('login');
    }
  }, [tabFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (activeTab === 'login') {
        const result = await login(email, password);
        if (result?.error) {
          setMessage({ type: 'error', content: result.error });
        }
      } else {
        const result = await signup(email, password);
        if (result?.error) {
          setMessage({ type: 'error', content: result.error });
        } else if (result?.success) {
          setMessage({ type: 'success', content: result.success });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Stack>
        <Button
          component={Link} 
          href="/"
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          compact={true}
          style={{ width: 'fit-content' }}
        >
          Ana Sayfaya Dön
        </Button>
        
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List grow mb="md">
              <Tabs.Tab value="login">Giriş Yap</Tabs.Tab>
              <Tabs.Tab value="signup">Hesap Oluştur</Tabs.Tab>
            </Tabs.List>

            <form onSubmit={handleSubmit}>
              <Stack>
                <Title order={2}>{activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</Title>
                
                {message && (
                  <Notification 
                    color={message.type === 'error' ? 'red' : 'green'} 
                    onClose={() => setMessage(null)}
                  >
                    {message.content}
                  </Notification>
                )}

                <TextInput
                  label="E-posta"
                  placeholder="ornek@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <PasswordInput
                  label="Şifre"
                  placeholder="Şifreniz"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                <Button type="submit" loading={loading} fullWidth mt="md">
                  {activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                </Button>
              </Stack>
            </form>
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
} 
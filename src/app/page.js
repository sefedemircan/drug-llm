"use client";

import { Button, Container, Title, Text, Stack, Group } from '@mantine/core';
import Link from 'next/link';

export default function Home() {
  return (
    <Container size="md" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Stack align="center" spacing="lg">
        <Title order={1}>İlaç Asistanı</Title>
        <Text size="lg" align="center">
          İlaçlar hakkında bilgi almak için giriş yapın veya hesap oluşturun.
        </Text>
        <Group position="center" spacing="md" mt="xl">
          <Button
            component={Link}
            href="/login"
            size="lg" 
            radius="md"
          >
            Giriş Yap
          </Button>
          <Button
            component={Link}
            href="/signup"
            size="lg"
            radius="md"
            variant="outline"
          >
            Hesap Oluştur
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

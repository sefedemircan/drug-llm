"use client";

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Paper,
  Group,
  Button,
  Badge,
  Stack,
  Grid,
  Card,
  Avatar,
  Input,
  Select,
  Breadcrumbs,
  Anchor,
  Pagination,
  ActionIcon
} from '@mantine/core';
import {
  IconSearch,
  IconUser,
  IconEye,
  IconHeart,
  IconShare,
  IconPill,
  IconBook,
  IconNews,
  IconTrendingUp,
  IconFilter
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function BlogPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { value: 'all', label: 'Tüm Kategoriler' },
    { value: 'drug-info', label: 'İlaç Bilgileri' },
    { value: 'health-tips', label: 'Sağlık Tavsiyeleri' },
    { value: 'research', label: 'Araştırmalar' },
    { value: 'technology', label: 'Teknoloji' },
    { value: 'regulations', label: 'Mevzuat' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Antibiyotik Kullanımında Dikkat Edilmesi Gerekenler',
      excerpt: 'Antibiyotiklerin doğru kullanımı ve direnç oluşumunu önleme yolları hakkında önemli bilgiler.',
      category: 'drug-info',
      categoryLabel: 'İlaç Bilgileri',
      author: 'Dr. Ayşe Kaya',
      date: '2024-01-15',
      readTime: '5 dk',
      views: 1250,
      likes: 89,
      featured: true
    },
    {
      id: 2,
      title: 'Yapay Zeka ve İlaç Geliştirme: Geleceğin Eczanesi',
      excerpt: 'AI teknolojilerinin ilaç endüstrisindeki devrimsel rolü ve gelecek beklentileri.',
      category: 'technology',
      categoryLabel: 'Teknoloji',
      author: 'Prof. Dr. Mehmet Özkan',
      date: '2024-01-12',
      readTime: '8 dk',
      views: 890,
      likes: 67,
      featured: true
    },
    {
      id: 3,
      title: 'Kış Aylarında Bağışıklık Sistemini Güçlendirme',
      excerpt: 'Soğuk havalarda sağlığınızı korumak için doğal yöntemler ve beslenme önerileri.',
      category: 'health-tips',
      categoryLabel: 'Sağlık Tavsiyeleri',
      author: 'Dyt. Zeynep Aktaş',
      date: '2024-01-10',
      readTime: '6 dk',
      views: 2100,
      likes: 156,
      featured: false
    }
  ];

  const breadcrumbItems = [
    { title: 'Ana Sayfa', href: '/' },
    { title: 'Blog', href: '/blog' }
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const getCategoryColor = (category) => {
    const colors = {
      'drug-info': 'blue',
      'health-tips': 'green',
      'research': 'purple',
      'technology': 'orange',
      'regulations': 'red'
    };
    return colors[category] || 'gray';
  };

  return (
    <>
      <Navbar />
      <Box 
        style={{ 
          minHeight: '100vh',
          backgroundColor: 'var(--chat-bg)',
          paddingTop: isMobile ? '100px' : '120px'
        }}
      >
        <Container size="xl" py="xl">
          <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

          <Box mb="xl" style={{ textAlign: 'center' }}>
            <Title 
              order={1} 
              mb="md"
              style={{ 
                fontSize: isMobile ? '2rem' : '3rem',
                fontWeight: 800,
                color: 'var(--primary)',
                textAlign: 'center'
              }}
            >
              DrugLLM Blog
            </Title>
            <Text 
              size={isMobile ? "md" : "lg"} 
              color="dimmed" 
              style={{ 
                maxWidth: '600px', 
                margin: '0 auto',
                lineHeight: 1.6 
              }}
            >
              İlaç ve sağlık dünyasından en güncel haberler, araştırmalar ve uzman görüşleri.
            </Text>
          </Box>

          <Paper shadow="sm" radius="md" p="md" mb="xl">
            <Group position="apart" align="flex-end">
              <Box style={{ flex: 1, maxWidth: '400px' }}>
                <Input
                  placeholder="Blog yazılarında ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<IconSearch size={16} />}
                  size="md"
                />
              </Box>
              <Group spacing="md">
                <Select
                  data={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Kategori seçin"
                  icon={<IconFilter size={16} />}
                  style={{ width: isMobile ? '100%' : '200px' }}
                />
              </Group>
            </Group>
          </Paper>

          {featuredPosts.length > 0 && (
            <Box mb="xl">
              <Group mb="lg">
                <IconTrendingUp size={24} color="var(--primary)" />
                <Title order={2}>Öne Çıkan Yazılar</Title>
              </Group>
              <Grid>
                {featuredPosts.map((post) => (
                  <Grid.Col key={post.id} span={isMobile ? 12 : 6}>
                    <Card shadow="md" radius="lg" style={{ height: '100%' }}>
                      <Card.Section>
                        <Box
                          style={{
                            height: '200px',
                            backgroundColor: 'var(--border-color-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <IconBook size={48} color="var(--text-muted)" />
                        </Box>
                      </Card.Section>

                      <Box p="md">
                        <Group position="apart" mb="md">
                          <Badge color={getCategoryColor(post.category)} variant="light">
                            {post.categoryLabel}
                          </Badge>
                          <Text size="sm" color="dimmed">
                            {post.readTime} okuma
                          </Text>
                        </Group>

                        <Title order={3} mb="sm" style={{ lineHeight: 1.3 }}>
                          {post.title}
                        </Title>

                        <Text size="sm" color="dimmed" mb="md" style={{ lineHeight: 1.5 }}>
                          {post.excerpt}
                        </Text>

                        <Group position="apart" align="center">
                          <Group spacing="xs">
                            <Avatar size="sm" radius="xl">
                              <IconUser size={16} />
                            </Avatar>
                            <Box>
                              <Text size="xs" weight={500}>{post.author}</Text>
                              <Text size="xs" color="dimmed">{post.date}</Text>
                            </Box>
                          </Group>
                          
                          <Group spacing="md">
                            <Group spacing={4}>
                              <IconEye size={16} color="var(--text-muted)" />
                              <Text size="xs" color="dimmed">{post.views}</Text>
                            </Group>
                            <Group spacing={4}>
                              <IconHeart size={16} color="var(--text-muted)" />
                              <Text size="xs" color="dimmed">{post.likes}</Text>
                            </Group>
                            <ActionIcon variant="subtle">
                              <IconShare size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Box>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </Box>
          )}

          <Box mb="xl">
            <Group mb="lg">
              <IconNews size={24} color="var(--primary)" />
              <Title order={2}>Tüm Yazılar</Title>
            </Group>
            <Grid>
              {regularPosts.map((post) => (
                <Grid.Col key={post.id} span={isMobile ? 12 : 4}>
                  <Card shadow="sm" radius="md" style={{ height: '100%' }}>
                    <Card.Section>
                      <Box
                        style={{
                          height: '150px',
                          backgroundColor: 'var(--border-color-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <IconPill size={36} color="var(--text-muted)" />
                      </Box>
                    </Card.Section>

                    <Box p="md">
                      <Group position="apart" mb="sm">
                        <Badge color={getCategoryColor(post.category)} variant="light" size="sm">
                          {post.categoryLabel}
                        </Badge>
                        <Text size="xs" color="dimmed">
                          {post.readTime}
                        </Text>
                      </Group>

                      <Title order={4} mb="sm" style={{ lineHeight: 1.3, fontSize: '1rem' }}>
                        {post.title}
                      </Title>

                      <Text size="sm" color="dimmed" mb="md" style={{ lineHeight: 1.4 }}>
                        {post.excerpt.length > 80 ? post.excerpt.substring(0, 80) + '...' : post.excerpt}
                      </Text>

                      <Group position="apart" align="center">
                        <Group spacing="xs">
                          <Avatar size="xs" radius="xl">
                            <IconUser size={12} />
                          </Avatar>
                          <Text size="xs" color="dimmed">{post.date}</Text>
                        </Group>
                        
                        <Group spacing="sm">
                          <Group spacing={2}>
                            <IconEye size={14} color="var(--text-muted)" />
                            <Text size="xs" color="dimmed">{post.views}</Text>
                          </Group>
                          <Group spacing={2}>
                            <IconHeart size={14} color="var(--text-muted)" />
                            <Text size="xs" color="dimmed">{post.likes}</Text>
                          </Group>
                        </Group>
                      </Group>
                    </Box>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          <Group position="center" mt="xl">
            <Pagination 
              total={5} 
              value={currentPage} 
              onChange={setCurrentPage}
              size="md"
            />
          </Group>

          <Paper 
            shadow="sm" 
            radius="md" 
            p="xl" 
            mt="xl"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)',
              textAlign: 'center'
            }}
          >
            <Title order={3} mb="md" style={{ color: 'white' }}>
              Blog Güncellemelerini Kaçırmayın
            </Title>
            <Text mb="lg" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Yeni blog yazılarımızdan haberdar olmak için e-posta listemize katılın.
            </Text>
            <Group position="center">
              <Input
                placeholder="E-posta adresiniz"
                style={{ maxWidth: '300px' }}
                size="md"
              />
              <Button size="md" variant="white" color="dark">
                Abone Ol
              </Button>
            </Group>
          </Paper>
        </Container>
      </Box>
    </>
  );
} 
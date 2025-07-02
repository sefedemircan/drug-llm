"use client";

import React, { useState } from 'react';
import { 
  ActionIcon, 
  Menu, 
  Group, 
  Text, 
  useMantineTheme,
  Tooltip,
  Box
} from '@mantine/core';
import { 
  IconSun, 
  IconMoon, 
  IconDeviceDesktop,
  IconCheck,
  IconPalette
} from '@tabler/icons-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ size = 18, variant = "subtle" }) => {
  const { theme, toggleTheme, setThemeMode, getThemeMode, isLoading } = useTheme();
  const mantineTheme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  if (isLoading) {
    return (
      <ActionIcon
        variant={variant}
        color="gray"
        size="lg"
        loading
        radius="md"
      />
    );
  }

  const currentMode = getThemeMode();

  const themeOptions = [
    {
      value: 'light',
      label: 'Açık Tema',
      icon: <IconSun size={16} />,
      color: '#f59e0b'
    },
    {
      value: 'dark',
      label: 'Koyu Tema',
      icon: <IconMoon size={16} />,
      color: '#6366f1'
    },
    {
      value: 'system',
      label: 'Sistem Teması',
      icon: <IconDeviceDesktop size={16} />,
      color: '#8b5cf6'
    }
  ];

  const currentThemeOption = themeOptions.find(option => 
    currentMode === option.value || 
    (currentMode === 'system' && option.value === theme)
  );

  const getDisplayIcon = () => {
    if (currentMode === 'system') {
      return <IconDeviceDesktop size={size} />;
    }
    return theme === 'light' ? <IconSun size={size} /> : <IconMoon size={size} />;
  };

  const getDisplayColor = () => {
    if (currentMode === 'system') return 'violet';
    return theme === 'light' ? 'yellow' : 'indigo';
  };

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      withArrow
      shadow="lg"
      offset={5}
      transitionProps={{ 
        transition: 'scale-y', 
        duration: 200 
      }}
    >
      <Menu.Target>
        <Tooltip
          label={currentThemeOption?.label}
          position="bottom"
          withArrow
          transitionProps={{ transition: 'fade', duration: 200 }}
        >
          <ActionIcon
            variant={variant}
            color={getDisplayColor()}
            size="lg"
            radius="md"
            style={{
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            {getDisplayIcon()}
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          backgroundColor: 'var(--background-white)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '8px',
          minWidth: '200px'
        }}
      >
        <Menu.Label
          style={{
            color: 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}
        >
          <Group spacing={6}>
            <IconPalette size={14} />
            Tema Seçimi
          </Group>
        </Menu.Label>

        {themeOptions.map((option) => {
          const isSelected = currentMode === option.value;
          const isCurrentSystemTheme = currentMode === 'system' && theme === option.value;
          
          return (
            <Menu.Item
              key={option.value}
              onClick={() => setThemeMode(option.value)}
              style={{
                borderRadius: '6px',
                marginBottom: '2px',
                backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                color: 'var(--text-body)',
                padding: '10px 12px',
                transition: 'all 0.2s ease'
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group spacing={10}>
                  <Box style={{ color: option.color }}>
                    {option.icon}
                  </Box>
                  <Text size="sm" fw={isSelected ? 600 : 400}>
                    {option.label}
                  </Text>
                  {isCurrentSystemTheme && (
                    <Text size="xs" c="dimmed">
                      (aktif)
                    </Text>
                  )}
                </Group>
                {isSelected && (
                  <IconCheck size={16} style={{ color: 'var(--primary)' }} />
                )}
              </Group>
            </Menu.Item>
          );
        })}

        <Menu.Divider style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />
        
        <Menu.Label
          style={{
            color: 'var(--text-muted)',
            fontSize: '11px',
            textAlign: 'center',
            padding: '4px 0'
          }}
        >
          Hızlı değiştirme: {theme === 'light' ? 'Koyu' : 'Açık'} tema
        </Menu.Label>
        
        <Menu.Item
          onClick={toggleTheme}
          style={{
            borderRadius: '6px',
            backgroundColor: 'var(--chat-bg)',
            color: 'var(--text-body)',
            textAlign: 'center',
            fontWeight: 500,
            border: '1px dashed var(--border-color)'
          }}
        >
          <Group justify="center" spacing={8}>
            {theme === 'light' ? <IconMoon size={14} /> : <IconSun size={14} />}
            <Text size="sm">
              {theme === 'light' ? 'Koyu' : 'Açık'} Temaya Geç
            </Text>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ThemeToggle; 
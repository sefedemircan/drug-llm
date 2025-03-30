import { useState } from 'react'
import {
  Container,
  Title,
  TextInput,
  Button,
  Text,
  Paper,
  Textarea,
  Group,
  Box,
  Loader,
  Stack,
  List,
  ThemeIcon
} from '@mantine/core'
import { IconMedicalCross, IconDots } from '@tabler/icons-react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [processTime, setProcessTime] = useState(null)

  const exampleQuestions = [
    "Parol ilacının kullanım alanları nelerdir?",
    "Augmentin antibiyotiğinin yan etkileri nelerdir?",
    "Coraspin ile birlikte kullanılmaması gereken ilaçlar hangileridir?",
    "Hamilelikte kullanabileceğim ağrı kesiciler nelerdir?",
    "Atorvastatin dozajı nasıl ayarlanır?"
  ]

  const handleSampleQuestion = (question) => {
    setPrompt(question)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      setError('Lütfen bir soru giriniz')
      return
    }
    
    setLoading(true)
    setError('')
    setResponse('')
    
    try {
      const res = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setResponse(data.response)
        setProcessTime(data.process_time_seconds)
      } else {
        setError(data.error || 'Bir hata oluştu')
      }
    } catch (err) {
      setError('Sunucuyla iletişim kurulurken bir hata oluştu')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center" mb="lg">DrugLLM İlaç Asistanı</Title>
      <Text c="dimmed" ta="center" mb="xl">
        Bu uygulama, ilaçlar ve tedavi yöntemleri hakkında bilgi sağlar. 
        Verilen yanıtlar bir yapay zeka modeliyle üretilmiştir ve tıbbi tavsiye yerine geçmez.
      </Text>
      
      <Paper withBorder p="md" radius="md" mb="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <Textarea
              label="Sorunuzu yazın"
              placeholder="İlaçlar hakkında bir soru sorun..."
              minRows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
            
            <Group justify="flex-end">
              <Button 
                type="submit" 
                loading={loading}
                disabled={!prompt.trim()}
                leftSection={<IconMedicalCross size={14} />}
              >
                Yanıt Al
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
      
      <Paper withBorder p="md" radius="md" mb="xl">
        <Text fw={500} mb="md">Örnek Sorular</Text>
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconMedicalCross size={16} />
            </ThemeIcon>
          }
        >
          {exampleQuestions.map((question, index) => (
            <List.Item 
              key={index}
              onClick={() => handleSampleQuestion(question)}
              style={{ cursor: 'pointer' }}
            >
              {question}
            </List.Item>
          ))}
        </List>
      </Paper>
      
      {error && (
        <Paper withBorder p="md" mt="md" radius="md" bg="red.0">
          <Text c="red">{error}</Text>
        </Paper>
      )}
      
      {loading && (
        <Box ta="center" mt="md">
          <Loader size="md" />
          <Text mt="sm">Model yanıt oluşturuyor...</Text>
          <Group mt="md" justify="center">
            <IconDots size={20} />
            <IconDots size={20} />
            <IconDots size={20} />
          </Group>
        </Box>
      )}
      
      {response && !loading && (
        <Paper withBorder p="md" mt="md" radius="md">
          <Title order={3} mb="md">Yanıt:</Title>
          <Text>{response}</Text>
          {processTime && (
            <Text size="sm" c="dimmed" mt="md">
              Yanıt süresi: {processTime.toFixed(2)} saniye
            </Text>
          )}
        </Paper>
      )}
    </Container>
  )
}

export default App

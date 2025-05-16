'use client';

import { useState, useEffect, useCallback } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(''); // Tanıma sonuçlarını tut
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Browser tarafında Web Speech API'yi kontrol et
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError('Tarayıcınız konuşma tanıma özelliğini desteklemiyor.');
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true; // Mikrofon açık kaldıkça tanıma devam etsin
      recognitionInstance.interimResults = true; // Geçici sonuçları al
      recognitionInstance.lang = 'tr-TR';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        // Her yeni konuşma sonucu geldiğinde ilgili transcript alınır
      };

      recognitionInstance.onerror = (event) => {
        setError(`Hata oluştu: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        // Tanıma sonlandığında sonuçları kontrol et
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setTranscript(''); // Tanıma başlamadan önce transcript'i temizle
        recognition.start();
      } catch (error) {
        // Zaten başlatılmış olabilir
        console.error('Tanıma başlatma hatası:', error);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript
  };
};

export default useSpeechRecognition; 
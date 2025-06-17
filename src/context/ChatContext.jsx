'use client'

import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

// Örnek sohbet geçmişi verileri
const mockChatHistory = [
  {
    date: 'Bugün',
    chats: [
      { 
        id: 1, 
        title: 'Aspirin kullanımı hakkında bilgi',
        messages: [
          {
            id: 1,
            role: 'system',
            content: 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?'
          },
          {
            id: 2,
            role: 'user',
            content: 'Aspirin nedir ve ne için kullanılır?'
          },
          {
            id: 3,
            role: 'system',
            content: 'Aspirin (Asetilsalisilik asit), ağrı kesici, ateş düşürücü ve iltihap giderici özelliklere sahip bir ilaçtır. Genellikle hafif ve orta şiddetli ağrıların tedavisinde, ateş düşürmede ve iltihaplı durumların tedavisinde kullanılır. Ayrıca, düşük dozlarda kan pıhtılaşmasını önlemek için kalp krizi ve inme riskini azaltmak amacıyla da kullanılabilir.'
          }
        ]
      },
      { 
        id: 2, 
        title: 'Antibiyotik ilaçlarının yan etkileri',
        messages: [
          {
            id: 1,
            role: 'system',
            content: 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?'
          },
          {
            id: 2,
            role: 'user',
            content: 'Antibiyotik ilaçlarının yan etkileri nelerdir?'
          },
          {
            id: 3,
            role: 'system',
            content: 'Antibiyotiklerin yan etkileri, ilacın türüne göre değişebilir. Yaygın yan etkiler arasında mide bulantısı, ishal, kusma, döküntü ve kaşıntı bulunur. Bazı antibiyotikler, bağırsak florasını bozarak probiyotik dengesini değiştirebilir. Nadir durumlarda ciddi alerjik reaksiyonlar, karaciğer veya böbrek sorunları oluşabilir. Antibiyotik kullanırken doktorunuzun önerilerine mutlaka uymalısınız.'
          }
        ]
      }
    ]
  },
  {
    date: 'Dün',
    chats: [
      { 
        id: 3, 
        title: 'Parol ve Novalgin karşılaştırması',
        messages: [
          {
            id: 1,
            role: 'system',
            content: 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?'
          },
          {
            id: 2,
            role: 'user',
            content: 'Parol ve Novalgin arasındaki farklar nelerdir?'
          },
          {
            id: 3,
            role: 'system',
            content: 'Parol (parasetamol) ve Novalgin (metamizol) farklı ağrı kesici ilaçlardır. Parol, ateş düşürücü ve ağrı kesici olarak kullanılır, ancak iltihaplanmayı azaltma etkisi azdır. Novalgin ise ağrı kesici, ateş düşürücü ve iltihaplanma önleyici özelliklere sahiptir. Novalgin, özellikle şiddetli ağrılarda tercih edilir. Ancak, Novalgin bazı ülkelerde kan hastalıkları riskinden dolayı kullanımı kısıtlanmıştır veya yasaklanmıştır. Her iki ilacın da farklı yan etki profilleri vardır ve doktor tavsiyesi ile kullanılmalıdır.'
          }
        ]
      },
      { 
        id: 4, 
        title: 'Kan sulandırıcı ilaçlar listesi',
        messages: [
          {
            id: 1,
            role: 'system',
            content: 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?'
          },
          {
            id: 2,
            role: 'user',
            content: 'En yaygın kan sulandırıcı ilaçlar nelerdir?'
          },
          {
            id: 3,
            role: 'system',
            content: 'Yaygın kan sulandırıcı (antikoagülan) ilaçlar şunlardır: 1) Warfarin (Coumadin), 2) Heparin, 3) Düşük molekül ağırlıklı heparinler (Enoksaparin, Dalteparin), 4) Yeni nesil oral antikoagülanlar: Rivaroksaban (Xarelto), Apiksaban (Eliquis), Dabigatran (Pradaxa), Edoksaban (Lixiana/Savaysa). Ayrıca, antiplatelet ilaçlar da kan pıhtılaşmasını farklı bir mekanizma ile önler: Aspirin, Klopidogrel (Plavix), Prasugrel (Effient), Tikagrelor (Brilinta). Bu ilaçların her biri farklı endikasyonlar için kullanılır ve doktor kontrolünde alınmalıdır.'
          }
        ]
      }
    ]
  },
  {
    date: 'Önceki 7 Gün',
    chats: [
      { 
        id: 5, 
        title: 'Grip için kullanılan ilaçlar',
        messages: [
          {
            id: 1,
            role: 'system',
            content: 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?'
          },
          {
            id: 2,
            role: 'user',
            content: 'Grip için kullanılan ilaçlar nelerdir?'
          },
          {
            id: 3,
            role: 'system',
            content: 'Grip tedavisinde kullanılan ilaçlar genellikle semptomları hafifletmeye yöneliktir. Bunlar arasında parasetamol ve ibuprofen gibi ateş düşürücü ve ağrı kesiciler, dekonjestanlar (burun tıkanıklığını gidermek için), öksürük şurupları ve antihistaminikler (burun akıntısı için) bulunur. Ciddi grip vakalarında veya yüksek risk grubundaki hastalarda, viral replikasyonu durdurmak için oseltamivir (Tamiflu) gibi antiviral ilaçlar kullanılabilir. Ancak, bu antiviraller semptomlar başladıktan sonra ilk 48 saat içinde alınırsa en etkili olur.'
          }
        ]
      },
      { 
        id: 6, 
        title: 'Migren tedavisi',
        messages: [
          {
            id: 1,
            role: 'system',
            content: 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?'
          },
          {
            id: 2,
            role: 'user',
            content: 'Migren için hangi tedaviler mevcut?'
          },
          {
            id: 3,
            role: 'system',
            content: 'Migren tedavisi genel olarak iki kategoriye ayrılır: akut tedavi ve önleyici tedavi. Akut tedavide, ağrı başladığında alınan ilaçlar kullanılır: parasetamol, NSAIDs (ibuprofen, naproksen), triptanlar (sumatriptan, zolmitriptan) ve CGRP antagonistleri (ubrogepant, rimegepant) gibi. Önleyici tedavide ise migren ataklarının sıklığını ve şiddetini azaltmak için düzenli kullanılan ilaçlar vardır: beta-blokerler (propranolol), antikonvülzanlar (topiramat), antidepresanlar, CGRP antikor tedavileri (erenumab, fremanezumab) ve botulinum toksini enjeksiyonları. Ayrıca, migren ataklarını tetikleyen faktörlerin belirlenmesi ve bunlardan kaçınılması da önemlidir.'
          }
        ]
      }
    ]
  }
];

// Boş bir sohbet şablonu
const emptyChat = {
  id: 'new',
  title: 'Yeni Sohbet',
  messages: [
    {
      id: 1,
      role: 'system',
      content: 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?'
    }
  ]
};

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chatHistory, setChatHistory] = useState(mockChatHistory);
  const [currentChat, setCurrentChat] = useState(mockChatHistory[0].chats[0]);
  const [isNewChat, setIsNewChat] = useState(false);
  const [isBotReplying, setIsBotReplying] = useState(false);
  const { user } = useAuth();

  // Sohbet geçmişinden bir sohbeti seçer
  const selectChat = (chatId) => {
    // Önce mock verilerden sohbeti bul
    let found = false;
    
    for (const group of chatHistory) {
      for (const chat of group.chats) {
        if (chat.id === chatId) {
          setCurrentChat(chat);
          setIsNewChat(false);
          found = true;
          break;
        }
      }
      if (found) break;
    }
  };

  // Yeni bir sohbet başlatır
  const startNewChat = () => {
    setCurrentChat({...emptyChat, id: 'new-' + Date.now()});
    setIsNewChat(true);
  };

  // Mevcut sohbete yeni mesaj ekler
  const addMessageToCurrentChat = (message) => {
    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: message
    };
    
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage]
    };
    
    setCurrentChat(updatedChat);
    setIsBotReplying(true); // Set loading state to true

    // Function to update history and reset new chat flag
    const updateHistoryAndFinalize = (finalChat) => {
      if (isNewChat) {
        const newHistoryItem = {
          ...finalChat, // Use the chat that includes the bot's response or error
          id: currentChat.id, // Ensure the ID is the one generated for the new chat
          title: message.length > 30 ? message.substring(0, 30) + '...' : message,
        };

        const todayGroup = chatHistory.find(group => group.date === 'Bugün');
        if (todayGroup) {
          const updatedHistory = chatHistory.map(group => {
            if (group.date === 'Bugün') {
              return {
                ...group,
                chats: [newHistoryItem, ...group.chats.filter(chat => chat.id !== newHistoryItem.id)], // Avoid duplicates if any
              };
            }
            return group;
          });
          setChatHistory(updatedHistory);
          setCurrentChat(newHistoryItem); // Update currentChat to have the new title
        } else {
          setChatHistory([
            {
              date: 'Bugün',
              chats: [newHistoryItem],
            },
            ...chatHistory,
          ]);
          setCurrentChat(newHistoryItem); // Update currentChat to have the new title
        }
        setIsNewChat(false); // Reset after adding to history
      } else {
        // If it's not a new chat, we still need to update the existing chat in chatHistory
        // setCurrentChat(finalChat) is already called before this function,
        // so currentChat has the latest messages. We just need to ensure history is updated.
        setChatHistory(prevHistory => {
          return prevHistory.map(group => ({
            ...group,
            chats: group.chats.map(chat =>
              chat.id === finalChat.id ? finalChat : chat
            ),
          }));
        });
      }
    };

    // Call the backend API
    //console.log('🚀 API çağrısı yapılıyor...');
    //console.log('📤 Gönderilen message:', message);
    //console.log('📤 Gönderilen userId:', user?.id || null);
    //console.log('👤 User object:', user);
    
    // User metadata'dan profil ve sağlık bilgilerini çıkar
    const profileData = user?.user_metadata?.profileData || null;
    const healthData = user?.user_metadata?.healthData || null;
    
    //console.log('📋 Profile data from metadata:', profileData);
    //console.log('🏥 Health data from metadata:', healthData);
    
    fetch('/api/chat/hf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: message,
        userId: user?.id || null,
        profileData: profileData,
        healthData: healthData
      }),
    })
      .then(async (response) => {
        //console.log('📥 API yanıtı alındı');
        const data = await response.json();
        //console.log('📄 API data:', data);
        const botReply = data.reply || "Size nasıl yardımcı olabilirim?";
        
        const botResponse = {
          id: Date.now() + 1, // Unique ID for the bot's message
          role: 'system',
          content: botReply,
        };
        
        const updatedChatWithResponse = {
          ...updatedChat,
          messages: [...updatedChat.messages, botResponse],
        };
        
        setCurrentChat(updatedChatWithResponse);
        updateHistoryAndFinalize(updatedChatWithResponse);
      })
      .catch((error) => {
        console.log('❌ Network Error:', error.message);
        
        // Network hatası durumunda basit bir mesaj
        const errorResponse = {
          id: Date.now() + 1,
          role: 'system',
          content: "Size nasıl yardımcı olabilirim? İlaçlar hakkında soru sorabilirsiniz.",
        };
        
        const updatedChatWithError = {
          ...updatedChat,
          messages: [...updatedChat.messages, errorResponse],
        };
        
        setCurrentChat(updatedChatWithError);
        updateHistoryAndFinalize(updatedChatWithError);
      })
      .finally(() => {
        setIsBotReplying(false); // Set loading state to false in all cases
      });
  };

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        currentChat,
        selectChat,
        startNewChat,
        addMessageToCurrentChat,
        isBotReplying, // Expose the new state
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 
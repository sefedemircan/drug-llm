# DrugLLM İlaç Asistanı

Bu uygulama, efedemircan/drugllm-tiny modeli kullanarak ilaç bilgilerine dair sorulara yanıt veren bir yapay zeka asistanıdır.

## Teknolojiler

- **Backend**: Python, Flask, llama-cpp-python
- **Frontend**: React, Mantine UI
- **Model**: efedemircan/drugllm-tiny (GGUF formatında - unsloth.Q4_K_M.gguf)

## Kurulum

### Gereksinimler

- Python 3.8+
- Node.js 18+
- npm 9+

### Backend Kurulumu

```bash
pip install flask flask-cors
pip install llama-cpp-python --prefer-binary
```

### Frontend Kurulumu

```bash
npm install
```

## Çalıştırma

### Windows

Uygulamayı çalıştırmak için:

```bash
start.bat
```

Veya manuel olarak:

1. Backend'i başlatmak için:
```bash
python app.py
```

2. Frontend'i başlatmak için (ayrı bir terminalde):
```bash
npm run dev
```

Tarayıcınızda http://localhost:5173 adresini açarak uygulamaya erişebilirsiniz.

## Model Kullanımı

Uygulama, TinyLlama modelinin fine-tune edilmiş versiyonunu kullanmaktadır. Model, orijinal TinyLlama_drugllm.py'deki Alpaca formatıyla kullanılır:

```python
# TinyLlama_drugllm.py'deki orijinal Alpaca formatı
ALPACA_PROMPT = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.
Instruction:
{}
Input:
{}
Response:
"""

# Kullanım örneği - dikkat ederseniz üçüncü {} yok, çünkü yanıtı model oluşturacak
prompt = ALPACA_PROMPT.format("Can you provide general information about augmentin 625 duo tablet?", "")

# Model yükleme
from llama_cpp import Llama
llm = Llama.from_pretrained(
    repo_id="efedemircan/drugllm-tiny",
    filename="unsloth.Q4_K_M.gguf",
    n_ctx=4096,
    n_threads=4,
    n_batch=512
)

# TinyLlama_drugllm.py'deki parametrelerle çıktı üretme
response = llm(
    prompt,
    max_tokens=512,
    temperature=0.7,
    top_p=0.95,
    echo=False,
    stop=["Instruction:", "Input:", "Response:"]
)
```

## Kullanım

İlaçlar, yan etkiler veya tedavi yöntemleriyle ilgili sorularınızı girin ve yanıtları alın.

## Örnek Sorular

- Parol ilacının kullanım alanları nelerdir?
- Augmentin antibiyotiğinin yan etkileri nelerdir?
- Coraspin ile birlikte kullanılmaması gereken ilaçlar hangileridir?
- Hamilelikte kullanabileceğim ağrı kesiciler nelerdir?
- Atorvastatin dozajı nasıl ayarlanır?

## Hata Ayıklama

Eğer model yanıtlarında tutarsızlık yaşıyorsanız:

1. Prompt formatının doğru olduğundan emin olun (özellikle Response: kelimesinin sonraki satırda olmak üzere korunması)
2. Durdurma noktalarının (stop tokens) doğru ayarlandığından emin olun
3. TinyLlama modelinin orijinal fine-tune edildiği formata mümkün olduğunca bağlı kalmaya çalışın

---

Bu proje [Efe Demircan](https://github.com/efedemircan) tarafından geliştirilmiştir.

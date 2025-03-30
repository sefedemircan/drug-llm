from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import time

app = Flask(__name__)
CORS(app)

# Global değişkenler
llm = None
model_loaded = False
model_loading = False
error_message = None

# TinyLlama_drugllm.py'deki orijinal Alpaca formatı - üçüncü {} kısmına dikkat
ALPACA_PROMPT = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.
Instruction:
{}
Input:
{}
Response:
"""

# Model yükleme
def load_model():
    global llm, model_loaded, model_loading, error_message
    
    if model_loading:
        return False
    
    model_loading = True
    error_message = None
    
    try:
        from llama_cpp import Llama
        
        print("Model yükleniyor...")
        repo_id = "efedemircan/drugllm-tiny"
        filename = "unsloth.Q4_K_M.gguf"
        
        # Doğrudan HuggingFace'den yükle
        llm = Llama.from_pretrained(
            repo_id=repo_id,
            filename=filename,
            n_ctx=4096,  # TinyLlama_drugllm.py'de 4096 kullanılıyor
            n_threads=4,
            n_batch=512,
            verbose=True  # Model yükleme detaylarını görmek için
        )
        
        print("Model başarıyla yüklendi!")
        model_loaded = True
        model_loading = False
        return True
    except ImportError as ie:
        error_message = "llama-cpp-python kütüphanesi bulunamadı"
        print(f"ImportError: {str(ie)}")
        model_loading = False
        return False
    except Exception as e:
        error_message = f"Model yükleme hatası: {str(e)}"
        print(f"Error: {str(e)}")
        model_loading = False
        return False

@app.route('/api/generate', methods=['POST'])
def generate():
    global llm, model_loaded, model_loading, error_message
    
    # Model yüklü değilse ve yüklenmeye çalışılmıyorsa yüklemeyi dene
    if not model_loaded and not model_loading:
        success = load_model()
        if not success:
            return jsonify({"error": error_message or "Model yüklenemedi"}), 500
    
    # Model yüklenmeye çalışılıyorsa bekleyin
    if model_loading:
        return jsonify({"error": "Model yükleniyor, lütfen bekleyin"}), 503
    
    data = request.json
    raw_prompt = data.get('prompt', '')
    
    if not raw_prompt:
        return jsonify({"error": "Prompt gerekli"}), 400
    
    # Sorunun sonuna soru işareti ekleyelim (eksikse)
    if not raw_prompt.strip().endswith('?'):
        raw_prompt = raw_prompt.strip() + '?'
    
    # TinyLlama_drugllm.py'deki ile aynı format - üçüncü {} boş bırakılıyor
    prompt = ALPACA_PROMPT.format(raw_prompt, "")
    print(f"Kullanılan prompt:\n{prompt}")
    
    # Yanıt oluştur - TinyLlama_drugllm.py'deki parametreleri kullan
    try:
        start_time = time.time()
        
        # TinyLlama_drugllm.py'de kullanılan konfigürasyon
        response = llm(
            prompt,
            max_tokens=512,  # TinyLlama_drugllm.py'de 64 kullanılmış ama yanıtların uzun olması için artırıyoruz
            temperature=0.7,  # TinyLlama_drugllm.py'deki değer
            top_p=0.95,      # TinyLlama_drugllm.py'deki değer
            echo=False,
            stop=["Instruction:", "Input:", "Response:"]  # Orijinal formattaki durdurma noktaları
        )
        
        # Yanıtı al
        generated_text = response["choices"][0]["text"].strip()
        
        # Yanıt süresini hesapla
        process_time = time.time() - start_time
        
        return jsonify({
            "response": generated_text,
            "process_time_seconds": process_time
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/status', methods=['GET'])
def status():
    global model_loaded, model_loading, error_message
    
    return jsonify({
        "status": "up", 
        "model_loaded": model_loaded,
        "model_loading": model_loading,
        "error": error_message
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "service": "DrugLLM API", 
        "status": "running",
        "endpoints": [
            {"path": "/api/status", "method": "GET", "description": "API durumunu kontrol et"},
            {"path": "/api/generate", "method": "POST", "description": "Yanıt oluştur"}
        ]
    })

if __name__ == '__main__':
    print("DrugLLM API başlatılıyor...")
    # Başlangıçta yüklemeyi dene (asenkron olarak)
    import threading
    thread = threading.Thread(target=load_model)
    thread.daemon = True
    thread.start()
    
    app.run(host='0.0.0.0', port=5000, debug=True) 
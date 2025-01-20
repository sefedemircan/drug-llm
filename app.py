import streamlit as st
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel, PeftConfig, AutoPeftModelForCausalLM
import torch
from huggingface_hub import login

# Hugging Face token'ı ile otomatik giriş
HF_TOKEN = "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"
login(token=HF_TOKEN)

# Sayfa yapılandırması
st.set_page_config(
    page_title="İlaç Öneri Asistanı",
    page_icon="💊",
    layout="wide"
)

# Başlık ve açıklama
st.title("💊 İlaç Öneri Asistanı")
st.markdown("Bu uygulama, sağlık sorunlarınıza yönelik ilaç önerilerinde bulunabilir. Lütfen şikayetlerinizi detaylı bir şekilde açıklayın.")

@st.cache_resource
def load_model():
    try:
        # Tokenizer'ı yükle
        tokenizer = AutoTokenizer.from_pretrained(
            "efedemircan/drug-llm-tokenizer",
            token=HF_TOKEN
        )
        
        # PEFT config'i yükle
        peft_config = PeftConfig.from_pretrained(
            "efedemircan/drug-llm-v0.1",
            token=HF_TOKEN
        )
        
        # Base modeli yükle
        model = AutoModelForCausalLM.from_pretrained(
            peft_config.base_model_name_or_path,
            torch_dtype=torch.float16,
            device_map="auto",
            token=HF_TOKEN,
            load_in_8bit=True  # 8-bit quantization kullan
        )
        
        # PEFT modelini yükle
        model = AutoPeftModelForCausalLM.from_pretrained(
            model,
            "efedemircan/drug-llm-v0.1",
            token=HF_TOKEN,
            device_map="auto",
            is_trainable=False
        )
        
        # Modeli eval moduna al
        model.eval()
        return model, tokenizer
    except Exception as e:
        st.error(f"Model yüklenirken detaylı hata: {str(e)}")
        return None, None

# Model ve tokenizer'ı yükle
model, tokenizer = load_model()

if model is not None and tokenizer is not None:
    st.success("Model başarıyla yüklendi! ✅")

    # Kullanıcı girişi
    user_input = st.text_area("Lütfen şikayetlerinizi yazın:", height=150)

    # Gönder butonu
    if st.button("Öneri Al"):
        if user_input:
            with st.spinner("Öneri hazırlanıyor..."):
                try:
                    # Girdiyi tokenize et
                    inputs = tokenizer(user_input, return_tensors="pt", padding=True).to(model.device)
                    
                    # Çıktı üretme
                    with torch.no_grad():
                        outputs = model.generate(
                            **inputs,
                            max_length=512,
                            num_return_sequences=1,
                            temperature=0.7,
                            do_sample=True,
                            pad_token_id=tokenizer.eos_token_id
                        )
                    
                    # Çıktıyı decode etme
                    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
                    
                    # Sonucu gösterme
                    st.markdown("### 🤖 Öneri:")
                    st.write(response)
                
                except Exception as e:
                    st.error(f"Çıktı üretilirken bir hata oluştu: {str(e)}")
        else:
            st.warning("Lütfen bir şikayet girin.")

# Footer
st.markdown("---")
st.markdown("⚠️ **Not:** Bu uygulama sadece bilgilendirme amaçlıdır ve bir doktorun yerini tutmaz. Herhangi bir sağlık sorununuz için mutlaka bir sağlık profesyoneline danışın.")
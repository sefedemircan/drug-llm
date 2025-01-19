import streamlit as st
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Sayfa başlığı ve açıklama
st.title("İlaç Bilgi Asistanı")
st.write("Bu uygulama, ilaçlar hakkında bilgi almanıza yardımcı olur.")

@st.cache_resource
def load_model():
    # Model ve tokenizer'ı yükle
    model_name = "efedemircan/drug-llm-v0.1"
    tokenizer = AutoTokenizer.from_pretrained("efedemircan/drug-llm-tokenizer")
    model = AutoModelForCausalLM.from_pretrained(model_name)
    return model, tokenizer

# Model ve tokenizer'ı yükle
try:
    model, tokenizer = load_model()
    st.success("Model başarıyla yüklendi!")
except Exception as e:
    st.error(f"Model yüklenirken bir hata oluştu: {str(e)}")

# Kullanıcı girişi
user_input = st.text_area("Sormak istediğiniz soruyu yazın:", height=100)

if st.button("Cevapla"):
    if user_input:
        with st.spinner("Cevap hazırlanıyor..."):
            try:
                # Mesajı formatlama
                messages = [
                    {"from": "human", "value": user_input},
                ]
                
                # Chat template'i uygula
                inputs = tokenizer.apply_chat_template(
                    messages,
                    tokenize=True,
                    add_generation_prompt=True,
                    return_tensors="pt"
                )

                # GPU varsa kullan
                device = "cuda" if torch.cuda.is_available() else "cpu"
                inputs = inputs.to(device)
                model = model.to(device)

                # Çıktı oluştur
                outputs = model.generate(
                    input_ids=inputs,
                    max_new_tokens=256,
                    temperature=0.7,
                    use_cache=True
                )

                # Yanıtı decode et
                response = tokenizer.batch_decode(outputs)[0]
                
                # Yanıtı göster
                st.write("### Yanıt:")
                st.write(response)
                
            except Exception as e:
                st.error(f"Bir hata oluştu: {str(e)}")
    else:
        st.warning("Lütfen bir soru girin.")
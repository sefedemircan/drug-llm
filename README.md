# İlaç Bilgi Sistemi

Bu proje, kullanıcılara ilaçlar hakkında detaylı bilgi veren bir yapay zeka destekli web uygulamasıdır.

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
pip install -r requirements.txt
```

2. `.env` dosyasını düzenleyin:
- OpenAI API anahtarınızı `.env` dosyasına ekleyin
- `OPENAI_API_KEY=your-api-key-here` satırındaki `your-api-key-here` kısmını kendi API anahtarınızla değiştirin

3. Veri setini yükleyin:
- `drugs_data.csv` dosyasını projenin ana dizinine yerleştirin

## Çalıştırma

```bash
streamlit run app.py
```

## Özellikler

- İlaç adına göre arama
- Detaylı ilaç bilgileri:
  - Kimyasal ve terapötik sınıf
  - Kullanım alanları
  - Yan etkiler
  - Alternatif ilaçlar
- GPT-3.5 destekli doğal dil açıklamaları
- Kullanıcı dostu arayüz

## Güvenlik Notu

Bu sistem sadece bilgilendirme amaçlıdır. Tıbbi tavsiye için her zaman sağlık profesyonellerine danışınız. 
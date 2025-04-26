-- Sağlık bilgileri için veritabanı şeması

-- Kullanıcı profil bilgileri tablosu
CREATE TABLE IF NOT EXISTS user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Temel profil bilgileri
  full_name TEXT NOT NULL,
  birth_date DATE,
  gender TEXT,
  height NUMERIC,
  weight NUMERIC,
  
  -- İletişim bilgileri
  email TEXT,
  phone TEXT,
  
  -- Diğer bilgiler
  address TEXT,
  emergency_contact TEXT,
  
  -- Zaman damgaları
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Kısıtlamalar ve indeksler
  CONSTRAINT fk_user_profile FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Kullanıcı profili için RLS (Row Level Security) Politikaları
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi profil bilgilerini görebilir
CREATE POLICY "Users can view own profile" ON user_profile 
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi profil bilgilerini ekleyebilir
CREATE POLICY "Users can insert own profile" ON user_profile 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi profil bilgilerini güncelleyebilir
CREATE POLICY "Users can update own profile" ON user_profile 
  FOR UPDATE USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi profil bilgilerini silebilir
CREATE POLICY "Users can delete own profile" ON user_profile 
  FOR DELETE USING (auth.uid() = user_id);

-- Kullanıcı sağlık bilgileri tablosu
CREATE TABLE IF NOT EXISTS health_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Temel sağlık bilgileri
  blood_type TEXT,
  chronic_diseases TEXT[], -- Kronik hastalıklar dizisi
  current_medications TEXT[], -- Kullanılan ilaçlar dizisi
  drug_allergies TEXT[], -- İlaç alerjileri dizisi
  food_allergies TEXT[], -- Gıda alerjileri dizisi
  
  -- Ek sağlık bilgileri
  medical_history TEXT, -- Geçmiş hastalık/ameliyat detayları
  family_history TEXT, -- Aile sağlık geçmişi
  lifestyle_info TEXT, -- Yaşam tarzı bilgileri (egzersiz, alkol, sigara vb.)
  
  -- Zaman damgaları
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- İndeksler
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_health UNIQUE (user_id)
);

-- RLS (Row Level Security) Politikaları
ALTER TABLE health_info ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi sağlık bilgilerini görebilir
CREATE POLICY "Users can view own health info" ON health_info 
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi sağlık bilgilerini ekleyebilir
CREATE POLICY "Users can insert own health info" ON health_info 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi sağlık bilgilerini güncelleyebilir
CREATE POLICY "Users can update own health info" ON health_info 
  FOR UPDATE USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi sağlık bilgilerini silebilir
CREATE POLICY "Users can delete own health info" ON health_info 
  FOR DELETE USING (auth.uid() = user_id);

-- İstatistikler için dönüşüm fonksiyonu (anonim veriler)
CREATE OR REPLACE FUNCTION get_anonymous_health_stats() 
RETURNS TABLE (
  blood_type TEXT,
  chronic_disease TEXT,
  count BIGINT
) 
LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT 
    blood_type, 
    unnest(chronic_diseases) as chronic_disease,
    count(*)
  FROM health_info
  GROUP BY blood_type, chronic_disease
  ORDER BY count DESC;
$$; 
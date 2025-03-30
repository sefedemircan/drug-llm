@echo off
echo DrugLLM uygulamasi baslatiliyor...

echo Backend baslatiliyor...
start cmd /k python app.py

timeout /t 5 /nobreak > nul

echo Frontend baslatiliyor...
start cmd /k npm run dev

echo Tarayicinizi http://localhost:5173 adresine yonlendirin. 
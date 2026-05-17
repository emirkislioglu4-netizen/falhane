const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY || '';

export async function falBak(soru: string, falTuru: string): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: 'Sen tecrübeli bir Türk falcısısın. ' + falTuru + ' bakıyorsun. KURALLAR: 3-4 paragraf yaz, her paragraf 2-3 cümle. Şair gibi konuşma, gerçek falcı gibi konuş. Somut şeyler söyle: zaman dilimi, kişi, durum. Net tahminler yap. Sevgili ruh, elimdeki, yıldızlar fısıldıyor gibi klişe ifadeler kullanma. Akıcı, samimi, Türk falcısı gibi konuş. 2-3 emoji kullan. Umut ver ama gerçekçi ol.',
        messages: [{ role: 'user', content: soru }],
      }),
    });

    const data = await response.json();
    
    if (data.content && data.content[0]) {
      return data.content[0].text;
    }
    
    console.log('API yanıtı:', data);
    return 'Yıldızlar şu an sessiz, lütfen tekrar dene.';
  } catch (error) {
    console.error('Fal hatası:', error);
    return 'Bağlantı hatası oluştu. Lütfen internetini kontrol et.';
  }
}
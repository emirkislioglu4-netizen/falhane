import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function bildirimIzniIste() {
  if (Platform.OS === 'web') {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function bildirimGonder(baslik: string, mesaj: string) {
  if (Platform.OS === 'web') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(baslik, {
        body: mesaj,
        icon: '/icon.png',
      });
    }
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: baslik,
      body: mesaj,
      sound: true,
    },
    trigger: null,
  });
}

// Burç bazlı mesajlar
const burcMesajlari: Record<string, string[]> = {
  'Koç': ['Bugün enerjin tavan! Yeni bir başlangıç için harika bir gün 🔥', 'Cesaretin seni yeni yerlere götürecek ⚔️'],
  'Boğa': ['Bugün maddi olarak güzel sürprizler var 💰', 'Sabırlı ol, beklediğin haber yakında gelecek 🌿'],
  'İkizler': ['Bugün çevrenden ilginç bir teklif gelebilir 💬', 'İletişim günün, biriyle önemli konuşma yapacaksın ✨'],
  'Yengeç': ['Aile ile güzel anlar seni bekliyor 🏡', 'Duygularını gizleme, bugün açıkça konuşma günü 🌙'],
  'Aslan': ['Bugün herkesin dikkati üzerinde, parla! 👑', 'Bir başarın takdir görecek, gururlu ol 🦁'],
  'Başak': ['Detaylara dikkat et, bugün önemli bir şeyi yakalayacaksın 📋', 'İş hayatında küçük bir fırsat büyük dönecek 🌾'],
  'Terazi': ['Bugün dengeli karar verme günü ⚖️', 'Yakınlarınla güzel bir uyum yakalayacaksın 🌸'],
  'Akrep': ['Bugün sezgilerin çok güçlü, dinle onları 🦂', 'Gizli bir gerçek ortaya çıkabilir, hazırlıklı ol 🌑'],
  'Yay': ['Bugün yeni bir maceraya atılma günü 🏹', 'Şansın açık, beklenmedik bir fırsat geliyor ✨'],
  'Oğlak': ['Bugün hedeflerine bir adım daha yaklaşacaksın 🎯', 'İş hayatında istikrar günleri başlıyor 🏔️'],
  'Kova': ['Bugün özgün fikirlerin parlayacak 💡', 'Sıradışı bir gün, beklenmedik gelişmelere açık ol 🌟'],
  'Balık': ['Bugün sezgilerin sana yol gösterecek 🐠', 'Romantik anlar seni bekliyor 💜'],
};

export async function kullaniciyaOzelMesaj(): Promise<{baslik: string, mesaj: string}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiller')
        .select('burc, isim')
        .eq('id', user.id)
        .single();
      
      if (data?.burc && burcMesajlari[data.burc]) {
        const mesajlar = burcMesajlari[data.burc];
        const mesaj = mesajlar[Math.floor(Math.random() * mesajlar.length)];
        return {
          baslik: `✨ ${data.isim || 'Merhaba'}, ${data.burc} burcu için`,
          mesaj: mesaj,
        };
      }
    }
  } catch (e) {}
  
  return {
    baslik: '✨ Günaydın!',
    mesaj: 'Bugün senin için harika bir gün olacak. Burç yorumun hazır!',
  };
}

export async function gunlukBildirimZamanla() {
  if (Platform.OS === 'web') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const sabahMesaj = await kullaniciyaOzelMesaj();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: sabahMesaj.baslik,
      body: sabahMesaj.mesaj,
      sound: true,
    },
    trigger: {
      type: 'calendar',
      hour: 9,
      minute: 0,
      repeats: true,
    } as any,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌙 İyi Akşamlar',
      body: 'Gün bitti, yıldızlar sana fısıldıyor. Yarınki yorumun hazır olacak 🔮',
      sound: true,
    },
    trigger: {
      type: 'calendar',
      hour: 21,
      minute: 0,
      repeats: true,
    } as any,
  });
}
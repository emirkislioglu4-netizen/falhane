import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Bildirim ayarları
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Bildirim izni iste
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

// Anlık bildirim gönder
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

// Günlük olumlu mesajlar
const gunlukMesajlar = [
  { baslik: '✨ Günaydın!', mesaj: 'Bugün senin için harika bir gün olacak. Yıldızlar seninle!' },
  { baslik: '🌙 Sabahın Güzelliği', mesaj: 'Bugün yeni fırsatlar kapını çalacak. Hazır ol!' },
  { baslik: '🔮 Yeni Bir Gün', mesaj: 'Bugün hayatında güzel sürprizler var. Burç yorumun hazır!' },
  { baslik: '⭐ Sabah Mesajı', mesaj: 'Sevgi ve bereket dolu bir gün seni bekliyor ✨' },
  { baslik: '🌟 Yıldızlar Konuştu', mesaj: 'Bugün enerjin yüksek olacak. İyi şanslar!' },
  { baslik: '💜 Falhane', mesaj: 'Günün başlıyor! Burcunun sana ne söylediğine bak.' },
  { baslik: '🌅 Yeni Gün', mesaj: 'Bugün kalbini açtığın her şey gerçek olabilir 🦋' },
  { baslik: '✦ İyi Sabahlar', mesaj: 'Kahveni al, burç yorumunu oku. Güzel bir gün seni bekliyor ☕' },
];

const aksamMesajlari = [
  { baslik: '🌙 İyi Akşamlar', mesaj: 'Gün bitti, yıldızlar sana fısıldıyor. Falına bak!' },
  { baslik: '✨ Akşam Vakti', mesaj: 'Bugün nasıldı? Yarın için yıldızlara danış 🔮' },
  { baslik: '💫 Gece Yarısı', mesaj: 'Rüyanda gördüklerini unutma. Yarın yorumlayabilirim!' },
  { baslik: '🌟 Akşam Mesajı', mesaj: 'Bugün öğrendiklerini sakla. Yarın yeni bir gün!' },
];

// Rastgele mesaj seç
export function rastgeleMesaj(zaman: 'sabah' | 'aksam') {
  const mesajlar = zaman === 'sabah' ? gunlukMesajlar : aksamMesajlari;
  return mesajlar[Math.floor(Math.random() * mesajlar.length)];
}

// Günlük bildirim zamanla
export async function gunlukBildirimZamanla() {
  if (Platform.OS === 'web') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  // Sabah 09:00 bildirimi
  const sabahMesaj = rastgeleMesaj('sabah');
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

  // Akşam 21:00 bildirimi
  const aksamMesaj = rastgeleMesaj('aksam');
  await Notifications.scheduleNotificationAsync({
    content: {
      title: aksamMesaj.baslik,
      body: aksamMesaj.mesaj,
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
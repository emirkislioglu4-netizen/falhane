import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { bildirimGonder, bildirimIzniIste, gunlukBildirimZamanla } from '../../lib/bildirimler';

export default function HomeScreen() {
  const router = useRouter();
  const [bildirimGosterildi, setBildirimGosterildi] = useState(false);

  useEffect(() => {
    const kontrolEt = async () => {
      try {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'default') {
            setBildirimGosterildi(true);
          }
        }
      } catch (e) {}
    };
    kontrolEt();
  }, []);

  const bildirimAc = async () => {
    const izin = await bildirimIzniIste();
    if (izin) {
      await bildirimGonder('✨ Bildirimler Aktif!', 'Artık burç yorumların ve mesajların için bildirim alacaksın 🔮');
      await gunlukBildirimZamanla();
      setBildirimGosterildi(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>✦ FALHANE</Text>
        <Text style={styles.logoSub}>RUHUNLA BULUŞ</Text>
        <Text style={styles.gunluk}>🔮 Günlük yorumun hazır</Text>
        <Text style={styles.gunlukSub}>Bugün güçlü değişimler seni bekliyor...</Text>
      </View>

      {bildirimGosterildi && (
        <View style={styles.bildirimBanner}>
          <Text style={styles.bildirimIcon}>🔔</Text>
          <View style={styles.bildirimMetin}>
            <Text style={styles.bildirimBaslik}>Bildirimleri Aç</Text>
            <Text style={styles.bildirimAlt}>Her sabah burç yorumun ve özel mesajlar için</Text>
          </View>
          <TouchableOpacity style={styles.bildirimBtn} onPress={bildirimAc}>
            <Text style={styles.bildirimBtnText}>Aç</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>NE İSTİYORSUN?</Text>
        <View style={styles.cards}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/fal')}>
            <Text style={styles.cardIcon}>🤖</Text>
            <Text style={styles.cardLabel}>AI Fal</Text>
            <Text style={styles.cardPrice}>59₺</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/falcilar')}>
            <Text style={styles.cardIcon}>🎴</Text>
            <Text style={styles.cardLabel}>Tarot</Text>
            <Text style={styles.cardPrice}>249₺</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/burclar')}>
            <Text style={styles.cardIcon}>⭐</Text>
            <Text style={styles.cardLabel}>Burçlar</Text>
            <Text style={styles.cardPrice}>Ücretsiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/falcilar')}>
            <Text style={styles.cardIcon}>🔮</Text>
            <Text style={styles.cardLabel}>Falcılar</Text>
            <Text style={styles.cardPrice}>199₺+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>ÜYELİK PAKETLERİ</Text>
        <View style={styles.planlar}>
          <TouchableOpacity style={styles.plan}>
            <Text style={styles.planIcon}>✨</Text>
            <Text style={styles.planIsim}>Standart</Text>
            <Text style={styles.planFiyat}>Ücretsiz</Text>
            <Text style={styles.planOzellik}>• Günlük 1 burç yorumu</Text>
            <Text style={styles.planOzellik}>• Sınırlı AI fal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.planPremium}>
            <Text style={styles.planRozet}>EN POPÜLER</Text>
            <Text style={styles.planIcon}>🌟</Text>
            <Text style={styles.planIsim}>Premium</Text>
            <Text style={styles.planFiyat}>99₺/ay</Text>
            <Text style={styles.planOzellik}>• Sınırsız AI fal</Text>
            <Text style={styles.planOzellik}>• Detaylı burç yorumu</Text>
            <Text style={styles.planOzellik}>• İndirimli falcı seansı</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  header: { padding: 32, paddingTop: 60, alignItems: 'center', backgroundColor: '#1a0533' },
  logo: { fontSize: 28, fontWeight: '600', color: '#fff', letterSpacing: 4 },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 6, marginTop: 4, marginBottom: 24 },
  gunluk: { fontSize: 14, color: '#AFA9EC', marginBottom: 6 },
  gunlukSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  bildirimBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(127,119,221,0.15)', margin: 16, padding: 14, borderRadius: 14, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)', gap: 12 },
  bildirimIcon: { fontSize: 28 },
  bildirimMetin: { flex: 1 },
  bildirimBaslik: { fontSize: 13, color: '#fff', fontWeight: '600', marginBottom: 2 },
  bildirimAlt: { fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 14 },
  bildirimBtn: { backgroundColor: '#7F77DD', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  bildirimBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  body: { padding: 16 },
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12, marginTop: 16 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '48%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  cardIcon: { fontSize: 36, marginBottom: 8 },
  cardLabel: { fontSize: 14, color: '#fff', fontWeight: '500', marginBottom: 4 },
  cardPrice: { fontSize: 11, color: '#AFA9EC' },
  planlar: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  plan: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  planPremium: { flex: 1, backgroundColor: 'rgba(127,119,221,0.15)', borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.4)', position: 'relative' },
  planRozet: { position: 'absolute', top: -8, right: 8, backgroundColor: '#7F77DD', color: '#fff', fontSize: 8, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, letterSpacing: 1, overflow: 'hidden' },
  planIcon: { fontSize: 28, marginBottom: 6 },
  planIsim: { fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 4 },
  planFiyat: { fontSize: 13, color: '#AFA9EC', marginBottom: 10 },
  planOzellik: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 3 },
});
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimasyonluGiris from '../../components/AnimasyonluGiris';
import ParlayanButon from '../../components/ParlayanButon';
import YildizArkaPlan from '../../components/YildizArkaPlan';
import { bildirimGonder, bildirimIzniIste, gunlukBildirimZamanla } from '../../lib/bildirimler';

export default function HomeScreen() {
  const router = useRouter();
  const [bildirimGosterildi, setBildirimGosterildi] = useState(false);
  const logoParlama = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo parıltı animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoParlama, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(logoParlama, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

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

  const logoGolge = logoParlama.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 25],
  });

  return (
    <View style={styles.container}>
      <YildizArkaPlan />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Animated.Text 
            style={[
              styles.logo,
              {
                textShadowColor: '#AFA9EC',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: logoGolge,
              },
            ]}
          >
            ✦ FALHANE
          </Animated.Text>
          <Text style={styles.logoSub}>RUHUNLA BULUŞ</Text>
          
          <AnimasyonluGiris gecikme={300}>
            <View style={styles.gunlukKutu}>
              <Text style={styles.gunluk}>🔮 Günlük yorumun hazır</Text>
              <Text style={styles.gunlukSub}>Bugün güçlü değişimler seni bekliyor...</Text>
            </View>
          </AnimasyonluGiris>
        </View>

        {bildirimGosterildi && (
          <AnimasyonluGiris gecikme={200}>
            <View style={styles.bildirimBanner}>
              <Text style={styles.bildirimIcon}>🔔</Text>
              <View style={styles.bildirimMetin}>
                <Text style={styles.bildirimBaslik}>Bildirimleri Aç</Text>
                <Text style={styles.bildirimAlt}>Her sabah burç yorumun ve özel mesajlar için</Text>
              </View>
              <ParlayanButon style={styles.bildirimBtn} onPress={bildirimAc}>
                <Text style={styles.bildirimBtnText}>Aç</Text>
              </ParlayanButon>
            </View>
          </AnimasyonluGiris>
        )}

        <View style={styles.body}>
          <AnimasyonluGiris gecikme={400}>
            <Text style={styles.sectionTitle}>NE İSTİYORSUN?</Text>
          </AnimasyonluGiris>

          <View style={styles.cards}>
            <AnimasyonluGiris gecikme={500} style={styles.cardWrap}>
              <TouchableOpacity style={styles.card} onPress={() => router.push('/fal')} activeOpacity={0.8}>
                <Text style={styles.cardIcon}>🤖</Text>
                <Text style={styles.cardLabel}>AI Fal</Text>
                <Text style={styles.cardPrice}>59₺</Text>
              </TouchableOpacity>
            </AnimasyonluGiris>

            <AnimasyonluGiris gecikme={600} style={styles.cardWrap}>
              <TouchableOpacity style={styles.card} onPress={() => router.push('/burclar')} activeOpacity={0.8}>
                <Text style={styles.cardIcon}>⭐</Text>
                <Text style={styles.cardLabel}>Burçlar</Text>
                <Text style={styles.cardPrice}>Ücretsiz</Text>
              </TouchableOpacity>
            </AnimasyonluGiris>

            <AnimasyonluGiris gecikme={700} style={styles.cardWrap}>
              <TouchableOpacity style={styles.card} onPress={() => router.push('/falcilar')} activeOpacity={0.8}>
                <Text style={styles.cardIcon}>🔮</Text>
                <Text style={styles.cardLabel}>Falcılar</Text>
                <Text style={styles.cardPrice}>199₺+</Text>
              </TouchableOpacity>
            </AnimasyonluGiris>

            <AnimasyonluGiris gecikme={800} style={styles.cardWrap}>
              <TouchableOpacity style={styles.card} onPress={() => router.push('/mesajlar')} activeOpacity={0.8}>
                <Text style={styles.cardIcon}>💬</Text>
                <Text style={styles.cardLabel}>Mesajlar</Text>
                <Text style={styles.cardPrice}>Sohbet</Text>
              </TouchableOpacity>
            </AnimasyonluGiris>
          </View>

          <AnimasyonluGiris gecikme={900}>
            <Text style={styles.sectionTitle}>ÜYELİK PAKETLERİ</Text>
          </AnimasyonluGiris>

          <View style={styles.planlar}>
            <AnimasyonluGiris gecikme={1000} style={{ flex: 1 }}>
              <View style={styles.plan}>
                <Text style={styles.planIcon}>✨</Text>
                <Text style={styles.planIsim}>Standart</Text>
                <Text style={styles.planFiyat}>Ücretsiz</Text>
                <Text style={styles.planOzellik}>• Günlük 1 burç yorumu</Text>
                <Text style={styles.planOzellik}>• Sınırlı AI fal</Text>
              </View>
            </AnimasyonluGiris>

            <AnimasyonluGiris gecikme={1100} style={{ flex: 1 }}>
              <View style={styles.planPremium}>
                <Text style={styles.planRozet}>EN POPÜLER</Text>
                <Text style={styles.planIcon}>🌟</Text>
                <Text style={styles.planIsim}>Premium</Text>
                <Text style={styles.planFiyat}>99₺/ay</Text>
                <Text style={styles.planOzellik}>• Sınırsız AI fal</Text>
                <Text style={styles.planOzellik}>• Detaylı burç yorumu</Text>
                <Text style={styles.planOzellik}>• İndirimli falcı seansı</Text>
              </View>
            </AnimasyonluGiris>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  scroll: { flex: 1 },
  header: { padding: 32, paddingTop: 60, alignItems: 'center' },
  logo: { fontSize: 32, fontWeight: '700', color: '#fff', letterSpacing: 5 },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 6, marginTop: 4, marginBottom: 24 },
  gunlukKutu: { alignItems: 'center', backgroundColor: 'rgba(127,119,221,0.1)', borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.2)' },
  gunluk: { fontSize: 14, color: '#AFA9EC', marginBottom: 6 },
  gunlukSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  bildirimBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(127,119,221,0.15)', marginHorizontal: 16, marginBottom: 8, padding: 14, borderRadius: 14, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)', gap: 12 },
  bildirimIcon: { fontSize: 28 },
  bildirimMetin: { flex: 1 },
  bildirimBaslik: { fontSize: 13, color: '#fff', fontWeight: '600', marginBottom: 2 },
  bildirimAlt: { fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 14 },
  bildirimBtn: { backgroundColor: '#7F77DD', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  bildirimBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  body: { padding: 16 },
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12, marginTop: 16 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardWrap: { width: '48%' },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: 20, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.15)' },
  cardIcon: { fontSize: 38, marginBottom: 8 },
  cardLabel: { fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 4 },
  cardPrice: { fontSize: 11, color: '#AFA9EC' },
  planlar: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  plan: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: 18, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  planPremium: { backgroundColor: 'rgba(127,119,221,0.15)', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: 'rgba(127,119,221,0.4)', position: 'relative' },
  planRozet: { position: 'absolute', top: -8, right: 8, backgroundColor: '#7F77DD', color: '#fff', fontSize: 8, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, letterSpacing: 1, overflow: 'hidden' },
  planIcon: { fontSize: 28, marginBottom: 6 },
  planIsim: { fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 4 },
  planFiyat: { fontSize: 13, color: '#AFA9EC', marginBottom: 10 },
  planOzellik: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 3 },
});
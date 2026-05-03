import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>✦ FALHANE</Text>
        <Text style={styles.logoSub}>RUHUNLA BULUŞ</Text>
        <Text style={styles.gunluk}>🔮 Günlük yorumun hazır</Text>
        <Text style={styles.gunlukSub}>Bugün güçlü değişimler seni bekliyor...</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>NE İSTİYORSUN?</Text>
        <View style={styles.cards}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>🤖</Text>
            <Text style={styles.cardLabel}>AI Fal</Text>
            <Text style={styles.cardPrice}>59₺</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>🎴</Text>
            <Text style={styles.cardLabel}>Tarot</Text>
            <Text style={styles.cardPrice}>249₺</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>📹</Text>
            <Text style={styles.cardLabel}>Canlı</Text>
            <Text style={styles.cardPrice}>349₺</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>ŞU AN ÇEVRİMİÇİ</Text>

        <TouchableOpacity style={styles.falciCard}>
          <View style={styles.falciAvatar}>
            <Text style={styles.falciAvatarIcon}>🌙</Text>
          </View>
          <View style={styles.falciInfo}>
            <Text style={styles.falciName}>Esra Hanım</Text>
            <Text style={styles.falciSpec}>🟢 Tarot · Kahve · Astroloji</Text>
          </View>
          <View style={styles.falciRight}>
            <Text style={styles.falciPrice}>249₺</Text>
            <Text style={styles.falciRating}>★ 4.9</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.falciCard}>
          <View style={[styles.falciAvatar, { backgroundColor: 'rgba(29,158,117,0.2)' }]}>
            <Text style={styles.falciAvatarIcon}>⭐</Text>
          </View>
          <View style={styles.falciInfo}>
            <Text style={styles.falciName}>Zeynep Aura</Text>
            <Text style={styles.falciSpec}>🟢 Kristal · Numeroloji</Text>
          </View>
          <View style={styles.falciRight}>
            <Text style={styles.falciPrice}>349₺</Text>
            <Text style={styles.falciRating}>★ 5.0</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>ÜYELİK</Text>
        <View style={styles.plans}>
          <View style={styles.planFree}>
            <Text style={styles.planName}>Ücretsiz</Text>
            <Text style={styles.planPrice}>0₺</Text>
            <Text style={styles.planFeature}>3 AI fal/ay</Text>
          </View>
          <View style={styles.planPremium}>
            <Text style={[styles.planName, { color: '#AFA9EC' }]}>Premium</Text>
            <Text style={[styles.planPrice, { color: '#AFA9EC' }]}>199₺</Text>
            <Text style={styles.planFeature}>Sınırsız AI{'\n'}%20 indirim</Text>
          </View>
          <View style={styles.planVip}>
            <Text style={[styles.planName, { color: '#EF9F27' }]}>VIP</Text>
            <Text style={[styles.planPrice, { color: '#EF9F27' }]}>499₺</Text>
            <Text style={styles.planFeature}>Her şey{'\n'}dahil</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  header: { padding: 32, paddingTop: 60, alignItems: 'center', backgroundColor: '#1a0533' },
  logo: { fontSize: 28, fontWeight: '600', color: '#fff', letterSpacing: 4 },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 6, marginTop: 4 },
  gunluk: { marginTop: 20, fontSize: 14, color: '#AFA9EC' },
  gunlukSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  body: { padding: 16 },
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12, marginTop: 20 },
  cards: { flexDirection: 'row', gap: 10 },
  card: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  cardIcon: { fontSize: 24, marginBottom: 6 },
  cardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  cardPrice: { fontSize: 10, color: '#AFA9EC', marginTop: 3 },
  falciCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  falciAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(127,119,221,0.2)', alignItems: 'center', justifyContent: 'center' },
  falciAvatarIcon: { fontSize: 20 },
  falciInfo: { flex: 1 },
  falciName: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  falciSpec: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  falciRight: { alignItems: 'flex-end' },
  falciPrice: { fontSize: 13, color: '#AFA9EC', fontWeight: '500' },
  falciRating: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  plans: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  planFree: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  planPremium: { flex: 1, backgroundColor: 'rgba(127,119,221,0.1)', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)' },
  planVip: { flex: 1, backgroundColor: 'rgba(186,117,23,0.1)', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(186,117,23,0.3)' },
  planName: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  planPrice: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: 6 },
  planFeature: { fontSize: 9, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 14 },
});
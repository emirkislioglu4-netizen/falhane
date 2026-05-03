import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const falcilar = [
  { id: 1, isim: 'Esra Hanım', icon: '🌙', uzmanlik: 'Tarot · Kahve · Astroloji', puan: '4.9', yorumSayisi: '2.4k', fiyat: '249₺', durum: 'online', deneyim: '12 yıl', hakkinda: 'Doğu ve Batı astrolojisini harmanlayan mistik bir yolculuk sizi bekliyor.' },
  { id: 2, isim: 'Zeynep Aura', icon: '⭐', uzmanlik: 'Kristal · Numeroloji', puan: '5.0', yorumSayisi: '891', fiyat: '349₺', durum: 'online', deneyim: '8 yıl', hakkinda: 'Kristallerin enerjisi ve sayıların gizemi ile hayatınızı aydınlatıyorum.' },
  { id: 3, isim: 'Fatma Baci', icon: '🔮', uzmanlik: 'Kahve · El Falı', puan: '4.8', yorumSayisi: '5.1k', fiyat: '199₺', durum: 'online', deneyim: '20 yıl', hakkinda: 'Geleneksel yöntemlerle kaderinizi okuyorum. 20 yıllık deneyim.' },
  { id: 4, isim: 'Ayşe Nur', icon: '🌟', uzmanlik: 'Tarot · Rüya Yorumu', puan: '4.7', yorumSayisi: '1.2k', fiyat: '299₺', durum: 'offline', deneyim: '6 yıl', hakkinda: 'Tarot kartları ve rüyalarınızın gizli mesajlarını birlikte keşfedelim.' },
  { id: 5, isim: 'Hüma Hanım', icon: '🌙', uzmanlik: 'Astroloji · Burç', puan: '4.9', yorumSayisi: '3.2k', fiyat: '399₺', durum: 'offline', deneyim: '15 yıl', hakkinda: 'Yıldızların size söylediği şeyleri birlikte dinleyelim.' },
];

export default function FalcilarScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👁 Falcılar</Text>
        <Text style={styles.subtitle}>Uzman falcılarla canlı görüşün</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>3 falcı şu an çevrimiçi</Text>
        </View>

        <Text style={styles.sectionTitle}>TÜM FALCILAR</Text>

        {falcilar.map((f) => (
          <TouchableOpacity key={f.id} style={styles.falciCard}>
            <View style={styles.falciTop}>
              <View style={styles.falciAvatar}>
                <Text style={styles.falciIcon}>{f.icon}</Text>
              </View>
              <View style={styles.falciInfo}>
                <View style={styles.falciIsimRow}>
                  <Text style={styles.falciIsim}>{f.isim}</Text>
                  <View style={[styles.durumBadge, f.durum === 'online' ? styles.online : styles.offline]}>
                    <Text style={styles.durumText}>{f.durum === 'online' ? '● Çevrimiçi' : '○ Çevrimdışı'}</Text>
                  </View>
                </View>
                <Text style={styles.falciUzmanlik}>{f.uzmanlik}</Text>
                <Text style={styles.falciDeneyim}>{f.deneyim} deneyim</Text>
              </View>
            </View>

            <Text style={styles.falciHakkinda}>{f.hakkinda}</Text>

            <View style={styles.falciBottom}>
              <View style={styles.falciStats}>
                <Text style={styles.falciPuan}>★ {f.puan}</Text>
                <Text style={styles.falciYorum}>{f.yorumSayisi} yorum</Text>
              </View>
              <View style={styles.falciButtons}>
                <TouchableOpacity style={styles.btnMesaj}>
                  <Text style={styles.btnMesajText}>💬 Mesaj</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnCanli, f.durum === 'offline' && styles.btnDisabled]}>
                  <Text style={styles.btnCanliText}>📹 {f.fiyat}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  header: { padding: 32, paddingTop: 60, alignItems: 'center', backgroundColor: '#1a0533' },
  title: { fontSize: 24, fontWeight: '600', color: '#fff', letterSpacing: 2 },
  subtitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 },
  body: { padding: 16 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(29,158,117,0.1)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start', marginTop: 16, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.3)' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1D9E75' },
  onlineText: { fontSize: 12, color: '#1D9E75' },
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12, marginTop: 20 },
  falciCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  falciTop: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  falciAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(127,119,221,0.2)', alignItems: 'center', justifyContent: 'center' },
  falciIcon: { fontSize: 24 },
  falciInfo: { flex: 1 },
  falciIsimRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  falciIsim: { fontSize: 14, color: '#fff', fontWeight: '600' },
  durumBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  online: { backgroundColor: 'rgba(29,158,117,0.2)' },
  offline: { backgroundColor: 'rgba(255,255,255,0.05)' },
  durumText: { fontSize: 9, color: '#1D9E75' },
  falciUzmanlik: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  falciDeneyim: { fontSize: 10, color: 'rgba(127,119,221,0.8)' },
  falciHakkinda: { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 18, marginBottom: 12 },
  falciBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  falciStats: { flexDirection: 'row', gap: 10 },
  falciPuan: { fontSize: 12, color: '#EF9F27' },
  falciYorum: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  falciButtons: { flexDirection: 'row', gap: 8 },
  btnMesaj: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  btnMesajText: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  btnCanli: { backgroundColor: '#7F77DD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  btnDisabled: { opacity: 0.4 },
  btnCanliText: { fontSize: 11, color: '#fff', fontWeight: '500' },
});
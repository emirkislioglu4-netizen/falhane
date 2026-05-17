import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { falBak } from '../../lib/claude';

const burclar = [
  { id: 'koc', isim: 'Koç', icon: '♈', tarih: '21 Mart - 19 Nisan', renk: '#E74C3C' },
  { id: 'boga', isim: 'Boğa', icon: '♉', tarih: '20 Nisan - 20 Mayıs', renk: '#27AE60' },
  { id: 'ikizler', isim: 'İkizler', icon: '♊', tarih: '21 Mayıs - 20 Haziran', renk: '#F39C12' },
  { id: 'yengec', isim: 'Yengeç', icon: '♋', tarih: '21 Haziran - 22 Temmuz', renk: '#3498DB' },
  { id: 'aslan', isim: 'Aslan', icon: '♌', tarih: '23 Temmuz - 22 Ağustos', renk: '#F1C40F' },
  { id: 'basak', isim: 'Başak', icon: '♍', tarih: '23 Ağustos - 22 Eylül', renk: '#16A085' },
  { id: 'terazi', isim: 'Terazi', icon: '♎', tarih: '23 Eylül - 22 Ekim', renk: '#E91E63' },
  { id: 'akrep', isim: 'Akrep', icon: '♏', tarih: '23 Ekim - 21 Kasım', renk: '#8E44AD' },
  { id: 'yay', isim: 'Yay', icon: '♐', tarih: '22 Kasım - 21 Aralık', renk: '#D35400' },
  { id: 'oglak', isim: 'Oğlak', icon: '♑', tarih: '22 Aralık - 19 Ocak', renk: '#34495E' },
  { id: 'kova', isim: 'Kova', icon: '♒', tarih: '20 Ocak - 18 Şubat', renk: '#1ABC9C' },
  { id: 'balik', isim: 'Balık', icon: '♓', tarih: '19 Şubat - 20 Mart', renk: '#9B59B6' },
];

// Sabah 7'den önce ise önceki günü ver, sonra ise bugünü ver
function getFalGunu(): string {
  const simdi = new Date();
  if (simdi.getHours() < 7) {
    // Sabah 7'den önce, dün başlayan günü kullan
    simdi.setDate(simdi.getDate() - 1);
  }
  return simdi.toISOString().split('T')[0];
}

export default function BurclarScreen() {
  const [secilenBurc, setSecilenBurc] = useState<any>(null);
  const [yorum, setYorum] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const burcYorumuAl = async (burc: any) => {
    setSecilenBurc(burc);
    setYukleniyor(true);
    setYorum('');

    const falGunu = getFalGunu();
    const anahtar = `burc_${burc.id}_${falGunu}`;

    try {
      const kayitli = await AsyncStorage.getItem(anahtar);
      if (kayitli) {
        setYorum(kayitli);
        setYukleniyor(false);
        return;
      }
    } catch (e) {}

    const saat = new Date().getHours();
    let gunZamani = '';
    if (saat >= 7 && saat < 12) gunZamani = 'sabah';
    else if (saat >= 12 && saat < 17) gunZamani = 'öğleden sonra';
    else if (saat >= 17 && saat < 21) gunZamani = 'akşam';
    else gunZamani = 'gece';

    const tarihYazi = new Date().toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    const soru = `Şu an ${tarihYazi}, saat ${new Date().getHours()}:00 yani ${gunZamani} vakti. ${burc.isim} burcu için günlük yorum yap. Bugünün geri kalanı için tahminlerini yaz. Aşk, iş, sağlık ve para konularına değin. 4-5 paragraf yaz.`;
    
    const cevap = await falBak(soru, `${burc.isim} burcu günlük yorumu`);
    
    try {
      await AsyncStorage.setItem(anahtar, cevap);
    } catch (e) {}
    
    setYorum(cevap);
    setYukleniyor(false);
  };

  if (secilenBurc) {
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.header, { backgroundColor: secilenBurc.renk + '40' }]}>
          <Text style={styles.burcIconBuyuk}>{secilenBurc.icon}</Text>
          <Text style={styles.burcIsimBuyuk}>{secilenBurc.isim}</Text>
          <Text style={styles.burcTarihBuyuk}>{secilenBurc.tarih}</Text>
        </View>

        <View style={styles.body}>
          <TouchableOpacity style={styles.geriBtn} onPress={() => { setSecilenBurc(null); setYorum(''); }}>
            <Text style={styles.geriBtnText}>← Tüm Burçlar</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>BUGÜNKÜ YORUMUN</Text>

          {yukleniyor ? (
            <View style={styles.yukleniyorBox}>
              <ActivityIndicator color="#AFA9EC" size="large" />
              <Text style={styles.yukleniyorText}>Yıldızlar okunuyor...</Text>
            </View>
          ) : (
            <View style={styles.yorumKutu}>
              <Text style={styles.yorumText}>{yorum}</Text>
            </View>
          )}

          <Text style={styles.notText}>
            🌙 Her burcun günlük yorumu her sabah 07:00'de yenilenir.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⭐ Burçlar</Text>
        <Text style={styles.subtitle}>Burcunu seç, günlük yorumunu oku</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>BURCUNU SEÇ</Text>
        
        <View style={styles.burcGrid}>
          {burclar.map((b) => (
            <TouchableOpacity 
              key={b.id}
              style={[styles.burcKart, { borderColor: b.renk + '60' }]}
              onPress={() => burcYorumuAl(b)}
            >
              <Text style={styles.burcIcon}>{b.icon}</Text>
              <Text style={styles.burcIsim}>{b.isim}</Text>
              <Text style={styles.burcTarih}>{b.tarih}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 16, marginTop: 8 },
  burcGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  burcKart: { width: '31%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 0.5 },
  burcIcon: { fontSize: 32, marginBottom: 6 },
  burcIsim: { fontSize: 13, color: '#fff', fontWeight: '600', marginBottom: 3 },
  burcTarih: { fontSize: 8, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 12 },
  burcIconBuyuk: { fontSize: 70, marginBottom: 8 },
  burcIsimBuyuk: { fontSize: 28, color: '#fff', fontWeight: '600', marginBottom: 4 },
  burcTarihBuyuk: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  geriBtn: { paddingVertical: 12 },
  geriBtnText: { fontSize: 13, color: '#AFA9EC' },
  yorumKutu: { backgroundColor: 'rgba(127,119,221,0.1)', borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)' },
  yorumText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 22 },
  yukleniyorBox: { padding: 40, alignItems: 'center', gap: 12 },
  yukleniyorText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  notText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 16, lineHeight: 18 },
});
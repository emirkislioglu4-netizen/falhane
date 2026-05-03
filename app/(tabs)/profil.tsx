import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfilScreen() {
  const [aktifPlan, setAktifPlan] = useState('Ücretsiz');

  const planlar = [
    {
      isim: 'Ücretsiz',
      fiyat: '0₺',
      renk: 'rgba(255,255,255,0.6)',
      arkaplan: 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.08)',
      ozellikler: ['Ayda 3 AI fal', 'Falcı profillerini gör', 'Temel özellikler'],
    },
    {
      isim: 'Premium',
      fiyat: '199₺/ay',
      renk: '#AFA9EC',
      arkaplan: 'rgba(127,119,221,0.1)',
      border: 'rgba(127,119,221,0.4)',
      ozellikler: ['Sınırsız AI fal', '%20 seans indirimi', 'Öncelikli eşleşme', 'Fal geçmişi'],
    },
    {
      isim: 'VIP',
      fiyat: '499₺/ay',
      renk: '#EF9F27',
      arkaplan: 'rgba(186,117,23,0.1)',
      border: 'rgba(186,117,23,0.4)',
      ozellikler: ['Her şey dahil', 'Özel falcı atama', '7/24 öncelik', 'Grup seansı ücretsiz', 'VIP rozeti'],
    },
  ];

  const istatistikler = [
    { label: 'Baktırdığım Fal', deger: '12' },
    { label: 'Favori Falcı', deger: '3' },
    { label: 'Üyelik Günü', deger: '28' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>🌙</Text>
        </View>
        <Text style={styles.isim}>Kullanıcı</Text>
        <Text style={styles.plan}>✦ {aktifPlan} Üye</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.istatistikler}>
          {istatistikler.map((ist) => (
            <View key={ist.label} style={styles.istatistikKart}>
              <Text style={styles.istatistikDeger}>{ist.deger}</Text>
              <Text style={styles.istatistikLabel}>{ist.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>ÜYELİK PLANLARI</Text>

        {planlar.map((plan) => (
          <TouchableOpacity
            key={plan.isim}
            style={[styles.planKart, { backgroundColor: plan.arkaplan, borderColor: plan.border }, aktifPlan === plan.isim && styles.planAktif]}
            onPress={() => setAktifPlan(plan.isim)}
          >
            <View style={styles.planUst}>
              <Text style={[styles.planIsim, { color: plan.renk }]}>{plan.isim}</Text>
              <Text style={[styles.planFiyat, { color: plan.renk }]}>{plan.fiyat}</Text>
            </View>
            {plan.ozellikler.map((o) => (
              <Text key={o} style={styles.planOzellik}>✓ {o}</Text>
            ))}
            {aktifPlan === plan.isim ? (
              <View style={styles.aktifBadge}>
                <Text style={styles.aktifText}>✦ Mevcut Planın</Text>
              </View>
            ) : (
              <TouchableOpacity style={[styles.secBtn, { borderColor: plan.renk }]}>
                <Text style={[styles.secBtnText, { color: plan.renk }]}>Bu Planı Seç</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>AYARLAR</Text>
        <View style={styles.ayarlar}>
          {['Bildirimler', 'Gizlilik', 'Yardım', 'Çıkış Yap'].map((a) => (
            <TouchableOpacity key={a} style={styles.ayarSatir}>
              <Text style={styles.ayarText}>{a}</Text>
              <Text style={styles.ayarOk}>›</Text>
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
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(127,119,221,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(127,119,221,0.4)' },
  avatarIcon: { fontSize: 32 },
  isim: { fontSize: 20, fontWeight: '600', color: '#fff' },
  plan: { fontSize: 11, color: '#AFA9EC', marginTop: 4, letterSpacing: 2 },
  body: { padding: 16 },
  istatistikler: { flexDirection: 'row', gap: 10, marginTop: 16 },
  istatistikKart: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  istatistikDeger: { fontSize: 22, fontWeight: '600', color: '#AFA9EC', marginBottom: 4 },
  istatistikLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12, marginTop: 24 },
  planKart: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 0.5 },
  planAktif: { borderWidth: 1.5 },
  planUst: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  planIsim: { fontSize: 16, fontWeight: '600' },
  planFiyat: { fontSize: 16, fontWeight: '600' },
  planOzellik: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4, lineHeight: 20 },
  aktifBadge: { marginTop: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 8, alignItems: 'center' },
  aktifText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 },
  secBtn: { marginTop: 12, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 0.5 },
  secBtnText: { fontSize: 12, fontWeight: '500' },
  ayarlar: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', marginBottom: 40 },
  ayarSatir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.06)' },
  ayarText: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  ayarOk: { fontSize: 18, color: 'rgba(255,255,255,0.3)' },
});

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function FalcilarScreen() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [falcilar, setFalcilar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yorumModal, setYorumModal] = useState(false);
  const [secilenFalci, setSecilenFalci] = useState<any>(null);
  const [puan, setPuan] = useState(5);
  const [yorum, setYorum] = useState('');

  useEffect(() => {
    yukle();
  }, []);

  const yukle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setKullanici(user);

    const { data } = await supabase
      .from('profiller')
      .select('*')
      .eq('rol', 'falci');

    if (data) setFalcilar(data);
    setYukleniyor(false);
  };

  const mesajAt = async (falci: any) => {
    if (!kullanici) {
      Alert.alert('Giriş Yap', 'Mesaj atmak için önce giriş yapmalısın');
      router.push('/giris');
      return;
    }

    if (falci.id === kullanici.id) {
      Alert.alert('Hata', 'Kendine mesaj atamazsın');
      return;
    }

    const { data: mevcut } = await supabase
      .from('sohbetler')
      .select('id')
      .eq('musteri_id', kullanici.id)
      .eq('falci_id', falci.id)
      .maybeSingle();

    if (mevcut) {
      router.push(`/sohbet/${mevcut.id}`);
      return;
    }

    const { data: yeni, error } = await supabase
      .from('sohbetler')
      .insert({
        musteri_id: kullanici.id,
        falci_id: falci.id,
        son_mesaj: 'Sohbet başlatıldı',
      })
      .select()
      .single();

    if (error) {
      Alert.alert('Hata', 'Sohbet başlatılamadı: ' + error.message);
      return;
    }

    if (yeni) {
      router.push(`/sohbet/${yeni.id}`);
    }
  };

  const yorumAc = (falci: any) => {
    if (!kullanici) {
      Alert.alert('Giriş Yap', 'Yorum yapmak için önce giriş yapmalısın');
      return;
    }
    setSecilenFalci(falci);
    setPuan(5);
    setYorum('');
    setYorumModal(true);
  };

  const yorumKaydet = async () => {
    if (!secilenFalci || !kullanici) return;

    const { error } = await supabase
      .from('yorumlar')
      .upsert({
        falci_id: secilenFalci.id,
        musteri_id: kullanici.id,
        puan: puan,
        yorum: yorum,
      }, { onConflict: 'falci_id,musteri_id' });

    if (error) {
      Alert.alert('Hata', error.message);
      return;
    }

    Alert.alert('Başarılı', 'Yorumun kaydedildi!');
    setYorumModal(false);
    yukle();
  };

  if (yukleniyor) {
    return (
      <View style={styles.bosContainer}>
        <ActivityIndicator color="#AFA9EC" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👁 Falcılar</Text>
        <Text style={styles.subtitle}>Uzman falcılarla yazışın</Text>
      </View>

      <View style={styles.body}>
        {falcilar.length === 0 ? (
          <View style={styles.bosBox}>
            <Text style={styles.bosIcon}>🔮</Text>
            <Text style={styles.bosBaslik}>Henüz falcı yok</Text>
            <Text style={styles.bosAlt}>Falcılar kayıt olunca burada görünecekler.</Text>
          </View>
        ) : (
          <>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>{falcilar.filter(f => f.durum === 'online').length} falcı şu an çevrimiçi</Text>
            </View>

            <Text style={styles.sectionTitle}>TÜM FALCILAR</Text>

            {falcilar.map((f) => (
              <View key={f.id} style={styles.falciCard}>
                <View style={styles.falciTop}>
                  <View style={styles.falciAvatar}>
                    <Text style={styles.falciIcon}>{f.avatar || '🌙'}</Text>
                  </View>
                  <View style={styles.falciInfo}>
                    <View style={styles.falciIsimRow}>
                      <Text style={styles.falciIsim}>{f.isim || 'Falcı'}</Text>
                      <View style={[styles.durumBadge, f.durum === 'online' ? styles.online : styles.offline]}>
                        <Text style={styles.durumText}>{f.durum === 'online' ? '● Çevrimiçi' : '○ Çevrimdışı'}</Text>
                      </View>
                    </View>
                    <Text style={styles.falciUzmanlik}>{f.uzmanlik || 'Genel Fal'}</Text>
                  </View>
                </View>

                {f.hakkinda && <Text style={styles.falciHakkinda}>{f.hakkinda}</Text>}

                <View style={styles.falciBottom}>
                  <View style={styles.falciStats}>
                    <Text style={styles.falciPuan}>★ {f.puan || '5.0'}</Text>
                    <Text style={styles.falciYorum}>{f.yorum_sayisi || 0} yorum</Text>
                  </View>
                  <View style={styles.btnGrup}>
                    <TouchableOpacity 
                      style={styles.btnYorum}
                      onPress={() => yorumAc(f)}
                    >
                      <Text style={styles.btnYorumText}>★ Yorum Yap</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.btnMesaj}
                      onPress={() => mesajAt(f)}
                    >
                      <Text style={styles.btnMesajText}>💬 {f.fiyat || 199}₺</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </View>

      <Modal
        visible={yorumModal}
        transparent
        animationType="fade"
        onRequestClose={() => setYorumModal(false)}
      >
        <View style={styles.modalArkaPlan}>
          <View style={styles.modalKutu}>
            <Text style={styles.modalBaslik}>
              {secilenFalci?.isim} için yorum
            </Text>
            <Text style={styles.modalAlt}>Puan ver ve yorumunu yaz</Text>

            <View style={styles.yildizlar}>
              {[1, 2, 3, 4, 5].map((p) => (
                <TouchableOpacity key={p} onPress={() => setPuan(p)}>
                  <Text style={[styles.yildiz, p <= puan && styles.yildizAktif]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Falcı hakkındaki yorumun..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={yorum}
              onChangeText={setYorum}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalBtnGrup}>
              <TouchableOpacity 
                style={styles.modalBtnIptal}
                onPress={() => setYorumModal(false)}
              >
                <Text style={styles.modalBtnIptalText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalBtnKaydet}
                onPress={yorumKaydet}
              >
                <Text style={styles.modalBtnKaydetText}>✓ Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  bosContainer: { flex: 1, backgroundColor: '#0A0814', alignItems: 'center', justifyContent: 'center' },
  bosBox: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  bosIcon: { fontSize: 60, marginBottom: 16 },
  bosBaslik: { fontSize: 18, color: '#fff', fontWeight: '600', marginBottom: 8 },
  bosAlt: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20 },
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
  falciHakkinda: { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 18, marginBottom: 12 },
  falciBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  falciStats: { flexDirection: 'row', gap: 10 },
  falciPuan: { fontSize: 12, color: '#EF9F27' },
  falciYorum: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  btnGrup: { flexDirection: 'row', gap: 6 },
  btnYorum: { backgroundColor: 'rgba(239,159,39,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 9, borderWidth: 0.5, borderColor: 'rgba(239,159,39,0.3)' },
  btnYorumText: { fontSize: 10, color: '#EF9F27', fontWeight: '500' },
  btnMesaj: { backgroundColor: '#7F77DD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 },
  btnMesajText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  modalArkaPlan: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalKutu: { backgroundColor: '#1a0533', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)' },
  modalBaslik: { fontSize: 18, color: '#fff', fontWeight: '600', marginBottom: 4 },
  modalAlt: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20 },
  yildizlar: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  yildiz: { fontSize: 36, color: 'rgba(255,255,255,0.2)' },
  yildizAktif: { color: '#EF9F27' },
  modalInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 14, color: '#fff', fontSize: 13, minHeight: 80, textAlignVertical: 'top', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  modalBtnGrup: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalBtnIptal: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 14, alignItems: 'center' },
  modalBtnIptalText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  modalBtnKaydet: { flex: 1, backgroundColor: '#7F77DD', borderRadius: 12, padding: 14, alignItems: 'center' },
  modalBtnKaydetText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
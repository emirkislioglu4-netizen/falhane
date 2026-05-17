import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ProfilScreen() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [profil, setProfil] = useState<any>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [duzenleModu, setDuzenleModu] = useState(false);
  
  const [isim, setIsim] = useState('');
  const [uzmanlik, setUzmanlik] = useState('');
  const [hakkinda, setHakkinda] = useState('');
  const [fiyat, setFiyat] = useState('199');
  const [avatar, setAvatar] = useState('🌙');

  useFocusEffect(
    useCallback(() => {
      yukle();
    }, [])
  );

  const yukle = async () => {
    setYukleniyor(true);
    const { data: { user } } = await supabase.auth.getUser();
    setKullanici(user);

    if (!user) {
      setYukleniyor(false);
      return;
    }

    const { data } = await supabase
      .from('profiller')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfil(data);
      setIsim(data.isim || '');
      setUzmanlik(data.uzmanlik || '');
      setHakkinda(data.hakkinda || '');
      setFiyat(String(data.fiyat || 199));
      setAvatar(data.avatar || '🌙');
    }

    setYukleniyor(false);
  };

  const kaydet = async () => {
    if (!kullanici) return;

    const { error } = await supabase
      .from('profiller')
      .update({
        isim,
        uzmanlik,
        hakkinda,
        fiyat: parseInt(fiyat) || 199,
        avatar,
      })
      .eq('id', kullanici.id);

    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      Alert.alert('Başarılı', 'Profilin güncellendi!');
      setDuzenleModu(false);
      yukle();
    }
  };

  const cikisYap = async () => {
    await supabase.auth.signOut();
    router.push('/giris');
  };

  if (yukleniyor) {
    return (
      <View style={styles.bosContainer}>
        <ActivityIndicator color="#AFA9EC" size="large" />
      </View>
    );
  }

  if (!kullanici) {
    return (
      <View style={styles.bosContainer}>
        <Text style={styles.bosIcon}>🔒</Text>
        <Text style={styles.bosBaslik}>Giriş Yap</Text>
        <Text style={styles.bosAlt}>Profilini görmek için giriş yapman gerekiyor</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/giris')}>
          <Text style={styles.btnText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFalci = profil?.rol === 'falci';
  const avatarSecenekleri = ['🌙', '⭐', '🔮', '🌟', '✨', '👁', '🦋', '🌹'];

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, isFalci && styles.headerFalci]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>{avatar}</Text>
        </View>
        <Text style={styles.isim}>{profil?.isim || 'Kullanıcı'}</Text>
        <Text style={styles.rol}>
          {isFalci ? '🔮 Falcı' : '✨ Müşteri'}
        </Text>
        <Text style={styles.email}>{kullanici.email}</Text>
      </View>

      {isFalci && !duzenleModu && (
        <View style={styles.istatistikler}>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{profil?.fiyat || 199}₺</Text>
            <Text style={styles.istatistikLabel}>Seans Ücreti</Text>
          </View>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>★ {profil?.puan || '5.0'}</Text>
            <Text style={styles.istatistikLabel}>Puan</Text>
          </View>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{profil?.yorum_sayisi || 0}</Text>
            <Text style={styles.istatistikLabel}>Yorum</Text>
          </View>
        </View>
      )}

      <View style={styles.body}>
        {duzenleModu ? (
          <>
            <Text style={styles.sectionTitle}>AVATAR SEÇ</Text>
            <View style={styles.avatarlar}>
              {avatarSecenekleri.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.avatarSecim, avatar === a && styles.avatarSecimAktif]}
                  onPress={() => setAvatar(a)}
                >
                  <Text style={styles.avatarSecimIcon}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>İSMİN</Text>
            <TextInput
              style={styles.input}
              value={isim}
              onChangeText={setIsim}
              placeholder="Adın..."
              placeholderTextColor="rgba(255,255,255,0.3)"
            />

            {isFalci && (
              <>
                <Text style={styles.sectionTitle}>UZMANLIK ALANIN</Text>
                <TextInput
                  style={styles.input}
                  value={uzmanlik}
                  onChangeText={setUzmanlik}
                  placeholder="Tarot · Kahve · Astroloji"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />

                <Text style={styles.sectionTitle}>HAKKINDA</Text>
                <TextInput
                  style={[styles.input, styles.inputCokSatir]}
                  value={hakkinda}
                  onChangeText={setHakkinda}
                  placeholder="Kendini tanıt..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.sectionTitle}>SEANS ÜCRETİN (₺)</Text>
                <TextInput
                  style={styles.input}
                  value={fiyat}
                  onChangeText={setFiyat}
                  placeholder="199"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="numeric"
                />
              </>
            )}

            <View style={styles.btnGrup}>
              <TouchableOpacity style={styles.btnIptal} onPress={() => setDuzenleModu(false)}>
                <Text style={styles.btnIptalText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnKaydet} onPress={kaydet}>
                <Text style={styles.btnKaydetText}>✓ Kaydet</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {isFalci && profil?.hakkinda && (
              <>
                <Text style={styles.sectionTitle}>HAKKIMDA</Text>
                <View style={styles.hakkindaBox}>
                  <Text style={styles.hakkindaText}>{profil.hakkinda}</Text>
                </View>
              </>
            )}

            {isFalci && profil?.uzmanlik && (
              <>
                <Text style={styles.sectionTitle}>UZMANLIK</Text>
                <View style={styles.hakkindaBox}>
                  <Text style={styles.hakkindaText}>{profil.uzmanlik}</Text>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.btnDuzenle} onPress={() => setDuzenleModu(true)}>
              <Text style={styles.btnDuzenleText}>✏️ Profili Düzenle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCikis} onPress={cikisYap}>
              <Text style={styles.btnCikisText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  bosContainer: { flex: 1, backgroundColor: '#0A0814', alignItems: 'center', justifyContent: 'center', padding: 32 },
  header: { padding: 32, paddingTop: 60, alignItems: 'center', backgroundColor: '#1a0533' },
  headerFalci: { backgroundColor: '#2a1547' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(127,119,221,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(127,119,221,0.4)' },
  avatarIcon: { fontSize: 36 },
  isim: { fontSize: 22, fontWeight: '600', color: '#fff', marginBottom: 4 },
  rol: { fontSize: 12, color: '#AFA9EC', letterSpacing: 2, marginBottom: 4 },
  email: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  istatistikler: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 0 },
  istatistikKart: { flex: 1, backgroundColor: 'rgba(127,119,221,0.1)', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)' },
  istatistikDeger: { fontSize: 18, fontWeight: '600', color: '#AFA9EC', marginBottom: 4 },
  istatistikLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  body: { padding: 16 },
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 10, marginTop: 16 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, color: '#fff', fontSize: 13, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  inputCokSatir: { minHeight: 80, textAlignVertical: 'top' },
  hakkindaBox: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  hakkindaText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  avatarlar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  avatarSecim: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  avatarSecimAktif: { backgroundColor: 'rgba(127,119,221,0.3)', borderColor: 'rgba(127,119,221,0.6)' },
  avatarSecimIcon: { fontSize: 22 },
  btnGrup: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btnIptal: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  btnIptalText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '500' },
  btnKaydet: { flex: 1, backgroundColor: '#7F77DD', borderRadius: 14, padding: 14, alignItems: 'center' },
  btnKaydetText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  btnDuzenle: { backgroundColor: 'rgba(127,119,221,0.15)', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 24, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)' },
  btnDuzenleText: { color: '#AFA9EC', fontSize: 14, fontWeight: '500' },
  btnCikis: { backgroundColor: 'rgba(255,80,80,0.1)', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 10, borderWidth: 0.5, borderColor: 'rgba(255,80,80,0.2)' },
  btnCikisText: { color: '#ff6b6b', fontSize: 13 },
  btn: { backgroundColor: '#7F77DD', borderRadius: 14, padding: 14, paddingHorizontal: 30 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MesajlarScreen() {
  const router = useRouter();
  const [sohbetler, setSohbetler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kullanici, setKullanici] = useState<any>(null);
  const [profil, setProfil] = useState<any>(null);

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

    const { data: profilData } = await supabase
      .from('profiller')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfil(profilData);

    const { data: sohbetlerData } = await supabase
      .from('sohbetler')
      .select('*')
      .or(`musteri_id.eq.${user.id},falci_id.eq.${user.id}`)
      .order('son_mesaj_tarihi', { ascending: false });

    if (sohbetlerData) {
      // Her sohbet için karşı tarafın bilgilerini al
      const sohbetlerleProfil = await Promise.all(
        sohbetlerData.map(async (s) => {
          const digerId = s.musteri_id === user.id ? s.falci_id : s.musteri_id;
          const { data: digerProfil } = await supabase
            .from('profiller')
            .select('*')
            .eq('id', digerId)
            .single();
          return { ...s, digerKisi: digerProfil };
        })
      );
      setSohbetler(sohbetlerleProfil);
    }

    setYukleniyor(false);
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
        <Text style={styles.bosAlt}>Mesajlaşmak için önce giriş yapman gerekiyor</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/giris')}>
          <Text style={styles.btnText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFalci = profil?.rol === 'falci';

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, isFalci && styles.headerFalci]}>
        <Text style={styles.title}>
          {isFalci ? '🔮 Müşteri Mesajları' : '💬 Mesajlar'}
        </Text>
        <Text style={styles.subtitle}>
          {isFalci ? 'Müşterilerinle sohbet et, kazan' : 'Falcılarınla sohbet et'}
        </Text>
      </View>

      {isFalci && (
        <View style={styles.istatistikler}>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{sohbetler.length}</Text>
            <Text style={styles.istatistikLabel}>Toplam{'\n'}Müşteri</Text>
          </View>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{profil?.puan || '5.0'}</Text>
            <Text style={styles.istatistikLabel}>Puan{'\n'}Ortalaması</Text>
          </View>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{profil?.fiyat || 199}₺</Text>
            <Text style={styles.istatistikLabel}>Seans{'\n'}Ücretin</Text>
          </View>
        </View>
      )}

      <View style={styles.body}>
        {sohbetler.length === 0 ? (
          <View style={styles.bosBox}>
            <Text style={styles.bosIcon}>{isFalci ? '🔮' : '💬'}</Text>
            <Text style={styles.bosBaslik}>
              {isFalci ? 'Henüz müşterin yok' : 'Henüz mesajın yok'}
            </Text>
            <Text style={styles.bosAlt}>
              {isFalci 
                ? 'Müşteriler sana mesaj atınca burada görünecekler. Sabırlı ol!' 
                : 'Falcılar sekmesinden bir falcıya mesaj at, burada görünsün'}
            </Text>
            {!isFalci && (
              <TouchableOpacity style={styles.btn} onPress={() => router.push('/falcilar')}>
                <Text style={styles.btnText}>Falcılara Git</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {isFalci ? 'MÜŞTERİLERİN' : 'SOHBETLERİN'}
            </Text>
            {sohbetler.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.sohbetCard}
                onPress={() => router.push(`/sohbet/${s.id}`)}
              >
                <View style={styles.sohbetAvatar}>
                  <Text style={styles.sohbetIcon}>
                    {s.digerKisi?.avatar || (s.digerKisi?.rol === 'falci' ? '🔮' : '👤')}
                  </Text>
                </View>
                <View style={styles.sohbetInfo}>
                  <Text style={styles.sohbetIsim}>
                    {s.digerKisi?.isim || (s.digerKisi?.rol === 'falci' ? 'Falcı' : 'Müşteri')}
                  </Text>
                  <Text style={styles.sohbetSonMesaj} numberOfLines={1}>
                    {s.son_mesaj || 'Sohbete başla...'}
                  </Text>
                </View>
                {isFalci && (
                  <View style={styles.yeniBadge}>
                    <Text style={styles.yeniBadgeText}>Yeni</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  header: { padding: 32, paddingTop: 60, alignItems: 'center', backgroundColor: '#1a0533' },
  headerFalci: { backgroundColor: '#2a1547' },
  title: { fontSize: 24, fontWeight: '600', color: '#fff', letterSpacing: 2 },
  subtitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 },
  istatistikler: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 0 },
  istatistikKart: { flex: 1, backgroundColor: 'rgba(127,119,221,0.1)', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)' },
  istatistikDeger: { fontSize: 22, fontWeight: '600', color: '#AFA9EC', marginBottom: 4 },
  istatistikLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 12 },
  body: { padding: 16 },
  bosContainer: { flex: 1, backgroundColor: '#0A0814', alignItems: 'center', justifyContent: 'center', padding: 32 },
  bosBox: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  bosIcon: { fontSize: 60, marginBottom: 16 },
  bosBaslik: { fontSize: 18, color: '#fff', fontWeight: '600', marginBottom: 8 },
  bosAlt: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  btn: { backgroundColor: '#7F77DD', borderRadius: 14, padding: 14, paddingHorizontal: 30 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12, marginTop: 12 },
  sohbetCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  sohbetAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(127,119,221,0.2)', alignItems: 'center', justifyContent: 'center' },
  sohbetIcon: { fontSize: 20 },
  sohbetInfo: { flex: 1 },
  sohbetIsim: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500', marginBottom: 3 },
  sohbetSonMesaj: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  yeniBadge: { backgroundColor: 'rgba(29,158,117,0.2)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  yeniBadgeText: { fontSize: 9, color: '#1D9E75', fontWeight: '600' },
});
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function GirisScreen() {
  const [mod, setMod] = useState<'giris' | 'kayit'>('giris');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [isim, setIsim] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState('');
  const [basarili, setBasarili] = useState(false);

  const handleSubmit = async () => {
    if (!email || !sifre) return;
    setYukleniyor(true);
    setMesaj('');

    if (mod === 'kayit') {
      const { error } = await supabase.auth.signUp({
        email,
        password: sifre,
        options: { data: { full_name: isim } },
      });
      if (error) {
        setMesaj('Hata: ' + error.message);
      } else {
        setBasarili(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: sifre,
      });
      if (error) {
        setMesaj('Hata: E-posta veya şifre yanlış.');
      } else {
        setBasarili(true);
      }
    }
    setYukleniyor(false);
  };

  if (basarili) {
    return (
      <View style={styles.basariliContainer}>
        <Text style={styles.basariliIcon}>🔮</Text>
        <Text style={styles.basariliBaslik}>Hoş Geldin!</Text>
        <Text style={styles.basariliAlt}>Falhane'ye katıldın. Yıldızlar seni bekliyor...</Text>
        <TouchableOpacity style={styles.basariliBtn} onPress={() => setBasarili(false)}>
          <Text style={styles.basarliBtnText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>✦ FALHANE</Text>
        <Text style={styles.logoSub}>RUHUNLA BULUŞ</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.modSecici}>
          <TouchableOpacity
            style={[styles.modBtn, mod === 'giris' && styles.modBtnAktif]}
            onPress={() => setMod('giris')}
          >
            <Text style={[styles.modBtnText, mod === 'giris' && styles.modBtnTextAktif]}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modBtn, mod === 'kayit' && styles.modBtnAktif]}
            onPress={() => setMod('kayit')}
          >
            <Text style={[styles.modBtnText, mod === 'kayit' && styles.modBtnTextAktif]}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>

        {mod === 'kayit' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>İSMİN</Text>
            <TextInput
              style={styles.input}
              placeholder="Adın ve soyadın..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={isim}
              onChangeText={setIsim}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>E-POSTA</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>ŞİFRE</Text>
          <TextInput
            style={styles.input}
            placeholder="En az 6 karakter..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={sifre}
            onChangeText={setSifre}
            secureTextEntry
          />
        </View>

        {mesaj !== '' && (
          <View style={styles.mesajBox}>
            <Text style={styles.mesajText}>{mesaj}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn, (!email || !sifre) && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={!email || !sifre || yukleniyor}
        >
          {yukleniyor ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              {mod === 'giris' ? '✨ Giriş Yap' : '🔮 Kayıt Ol'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  header: { padding: 32, paddingTop: 80, alignItems: 'center', backgroundColor: '#1a0533' },
  logo: { fontSize: 28, fontWeight: '600', color: '#fff', letterSpacing: 4 },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 6, marginTop: 4 },
  body: { padding: 24 },
  modSecici: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 4, marginTop: 24, marginBottom: 24 },
  modBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10 },
  modBtnAktif: { backgroundColor: '#7F77DD' },
  modBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  modBtnTextAktif: { color: '#fff' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, color: '#fff', fontSize: 13, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  mesajBox: { backgroundColor: 'rgba(255,80,80,0.1)', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 0.5, borderColor: 'rgba(255,80,80,0.3)' },
  mesajText: { fontSize: 12, color: '#ff6b6b' },
  btn: { backgroundColor: '#7F77DD', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 1 },
  basariliContainer: { flex: 1, backgroundColor: '#0A0814', alignItems: 'center', justifyContent: 'center', padding: 32 },
  basariliIcon: { fontSize: 60, marginBottom: 20 },
  basariliBaslik: { fontSize: 28, fontWeight: '600', color: '#fff', marginBottom: 10 },
  basariliAlt: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20, marginBottom: 30 },
  basariliBtn: { backgroundColor: '#7F77DD', borderRadius: 14, padding: 16, paddingHorizontal: 40 },
  basarliBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
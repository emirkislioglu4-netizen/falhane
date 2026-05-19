import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

function burcHesapla(tarih: string): string {
  if (!tarih) return '';
  const [yil, ay, gun] = tarih.split('-').map(Number);
  if (!ay || !gun) return '';
  
  if ((ay === 3 && gun >= 21) || (ay === 4 && gun <= 19)) return 'Koç';
  if ((ay === 4 && gun >= 20) || (ay === 5 && gun <= 20)) return 'Boğa';
  if ((ay === 5 && gun >= 21) || (ay === 6 && gun <= 20)) return 'İkizler';
  if ((ay === 6 && gun >= 21) || (ay === 7 && gun <= 22)) return 'Yengeç';
  if ((ay === 7 && gun >= 23) || (ay === 8 && gun <= 22)) return 'Aslan';
  if ((ay === 8 && gun >= 23) || (ay === 9 && gun <= 22)) return 'Başak';
  if ((ay === 9 && gun >= 23) || (ay === 10 && gun <= 22)) return 'Terazi';
  if ((ay === 10 && gun >= 23) || (ay === 11 && gun <= 21)) return 'Akrep';
  if ((ay === 11 && gun >= 22) || (ay === 12 && gun <= 21)) return 'Yay';
  if ((ay === 12 && gun >= 22) || (ay === 1 && gun <= 19)) return 'Oğlak';
  if ((ay === 1 && gun >= 20) || (ay === 2 && gun <= 18)) return 'Kova';
  if ((ay === 2 && gun >= 19) || (ay === 3 && gun <= 20)) return 'Balık';
  return '';
}

export default function GirisScreen() {
  const [rol, setRol] = useState<'musteri' | 'falci' | null>(null);
  const [mod, setMod] = useState<'giris' | 'kayit'>('giris');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [isim, setIsim] = useState('');
  const [uzmanlik, setUzmanlik] = useState('');
  const [dogumTarihi, setDogumTarihi] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState('');
  const [basarili, setBasarili] = useState(false);

  const burc = burcHesapla(dogumTarihi);

  const handleSubmit = async () => {
    if (!email || !sifre) return;
    setYukleniyor(true);
    setMesaj('');

    if (mod === 'kayit') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: sifre,
        options: { 
          data: { 
            full_name: isim,
            rol: rol,
            uzmanlik: rol === 'falci' ? uzmanlik : null,
            dogum_tarihi: dogumTarihi || null,
            burc: burc || null,
          } 
        },
      });
      
      if (error) {
        setMesaj('Hata: ' + error.message);
        setYukleniyor(false);
        return;
      }

      // Kayıt sonrası profile doğum tarihi ve burç ekle
      if (data.user) {
        await supabase
          .from('profiller')
          .update({ 
            dogum_tarihi: dogumTarihi || null,
            burc: burc || null,
          })
          .eq('id', data.user.id);
      }

      const { error: girisError } = await supabase.auth.signInWithPassword({
        email,
        password: sifre,
      });

      if (girisError) {
        setMesaj('Kayıt başarılı! Ama giriş için tekrar dene.');
        setMod('giris');
        setYukleniyor(false);
        return;
      }

      setBasarili(true);
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
        <Text style={styles.basariliIcon}>{rol === 'falci' ? '🔮' : '✨'}</Text>
        <Text style={styles.basariliBaslik}>Hoş Geldin!</Text>
        <Text style={styles.basariliAlt}>
          {rol === 'falci' 
            ? 'Falhane falcı paneline katıldın. Müşterilerin seni bekliyor...' 
            : burc ? `${burc} burcu olarak Falhane'ye katıldın ✨` : 'Falhane\'ye katıldın. Yıldızlar seni bekliyor...'}
        </Text>
        <TouchableOpacity style={styles.basariliBtn} onPress={() => { setBasarili(false); setRol(null); }}>
          <Text style={styles.basarliBtnText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!rol) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>✦ FALHANE</Text>
          <Text style={styles.logoSub}>RUHUNLA BULUŞ</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.rolBaslik}>NASIL DEVAM ETMEK İSTERSİN?</Text>
          
          <TouchableOpacity style={styles.rolCard} onPress={() => setRol('musteri')}>
            <Text style={styles.rolIcon}>👤</Text>
            <Text style={styles.rolName}>Müşteri Olarak</Text>
            <Text style={styles.rolDesc}>Fal baktır, AI ile sohbet et, falcılarla mesajlaş</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rolCardFalci} onPress={() => setRol('falci')}>
            <Text style={styles.rolIcon}>🔮</Text>
            <Text style={styles.rolName}>Falcı Olarak</Text>
            <Text style={styles.rolDesc}>Müşterilere fal bak, mesajlaş, kazan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>✦ FALHANE</Text>
        <Text style={styles.logoSub}>
          {rol === 'falci' ? 'FALCI GİRİŞİ' : 'MÜŞTERİ GİRİŞİ'}
        </Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity style={styles.geriBtn} onPress={() => setRol(null)}>
          <Text style={styles.geriBtnText}>← Geri</Text>
        </TouchableOpacity>

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

        {mod === 'kayit' && rol === 'musteri' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DOĞUM TARİHİN</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-AA-GG (örn: 2000-03-15)"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={dogumTarihi}
              onChangeText={setDogumTarihi}
            />
            {burc !== '' && (
              <View style={styles.burcBox}>
                <Text style={styles.burcText}>🔮 Senin burcun: <Text style={styles.burcAd}>{burc}</Text></Text>
              </View>
            )}
          </View>
        )}

        {mod === 'kayit' && rol === 'falci' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>UZMANLIK ALANIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Tarot, Kahve, Astroloji..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={uzmanlik}
              onChangeText={setUzmanlik}
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
            autoCapitalize="none"
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
              {mod === 'giris' ? '✨ Giriş Yap' : (rol === 'falci' ? '🔮 Falcı Olarak Kayıt Ol' : '✨ Kayıt Ol')}
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
  rolBaslik: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, marginTop: 30, marginBottom: 20, textAlign: 'center' },
  rolCard: { backgroundColor: 'rgba(127,119,221,0.1)', borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)' },
  rolCardFalci: { backgroundColor: 'rgba(186,117,23,0.1)', borderRadius: 18, padding: 24, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(186,117,23,0.3)' },
  rolIcon: { fontSize: 50, marginBottom: 12 },
  rolName: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 8 },
  rolDesc: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 18 },
  geriBtn: { paddingVertical: 8, marginBottom: 8 },
  geriBtnText: { fontSize: 13, color: '#AFA9EC' },
  modSecici: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 4, marginTop: 16, marginBottom: 24 },
  modBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10 },
  modBtnAktif: { backgroundColor: '#7F77DD' },
  modBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  modBtnTextAktif: { color: '#fff' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, color: '#fff', fontSize: 13, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  burcBox: { backgroundColor: 'rgba(127,119,221,0.15)', borderRadius: 10, padding: 10, marginTop: 8, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)' },
  burcText: { fontSize: 13, color: '#fff', textAlign: 'center' },
  burcAd: { color: '#AFA9EC', fontWeight: '600' },
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
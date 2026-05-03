import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FalScreen() {
  const [soru, setSoru] = useState('');
  const [cevap, setCevap] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [seciliFal, setSeciliFal] = useState('');

  const falTurleri = [
    { id: 'genel', icon: '🔮', label: 'Genel Fal' },
    { id: 'ask', icon: '❤️', label: 'Aşk Falı' },
    { id: 'para', icon: '💰', label: 'Para Falı' },
    { id: 'kariyer', icon: '⭐', label: 'Kariyer' },
  ];

  const falBak = async () => {
    if (!soru || !seciliFal) return;
    setYukleniyor(true);
    setCevap('');

    await new Promise(r => setTimeout(r, 2000));

    const cevaplar = [
      `✨ ${seciliFal} için yıldızlar çok güzel bir şey söylüyor sana...\n\nBu dönem hayatında büyük bir dönüşüm yaşanacak. Uzun süredir beklediğin fırsat kapını çalıyor. Sabırlı ol, doğru an yakında gelecek.\n\nKalbin seni doğru yöne çekiyor. O sese kulak ver. Çevrendeki insanlar sana destek verecek, yalnız değilsin.\n\nYıldızlar şunu fısıldıyor: Korkma, adımını at. Bu ay içinde güzel bir haber gelecek ve hayatın yeni bir sayfa açacak. ✦`,
      `🌙 ${seciliFal} falın çok şey anlatıyor...\n\nGecenin karanlığında bile yıldızlar parlıyor. Tıpkı senin yolun gibi. Şu an zor görünse de bu geçici bir bulut.\n\nYakında bir kapı açılacak. O kapıdan içeri girmekten çekinme. Seni bekleyen güzel sürprizler var.\n\nEnerji akışın çok güçlü. Bu dönem attığın adımlar kalıcı sonuçlar doğuracak. Cesaretini topla! ✦`,
      `🔮 ${seciliFal} için kartlar açıldı...\n\nBu dönem sabır ve azmin zamanı. Zorluklara rağmen yoluna devam edersen büyük ödüller seni bekliyor.\n\nBir yakının sana çok önemli bir şey söyleyecek. Bu sözlere kulak ver, hayatını değiştirebilir.\n\nAy sonu itibarıyla güzel gelişmeler kapıda. Umudunu kaybetme, en karanlık gece bile sabahı getirir. ✦`,
    ];

    setCevap(cevaplar[Math.floor(Math.random() * cevaplar.length)]);
    setYukleniyor(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔮 AI Fal</Text>
        <Text style={styles.subtitle}>Yapay zeka ile geleceğini keşfet</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>FAL TÜRÜ SEÇ</Text>
        <View style={styles.falTurleri}>
          {falTurleri.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.falCard, seciliFal === f.label && styles.falCardActive]}
              onPress={() => setSeciliFal(f.label)}
            >
              <Text style={styles.falIcon}>{f.icon}</Text>
              <Text style={styles.falLabel}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>SORUN NEDİR?</Text>
        <TextInput
          style={styles.input}
          placeholder="Aklındaki soruyu yaz..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={soru}
          onChangeText={setSoru}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.button, (!soru || !seciliFal) && styles.buttonDisabled]}
          onPress={falBak}
          disabled={!soru || !seciliFal || yukleniyor}
        >
          <Text style={styles.buttonText}>✨ Falıma Bak</Text>
        </TouchableOpacity>

        {yukleniyor && (
          <View style={styles.yukleniyor}>
            <ActivityIndicator color="#AFA9EC" size="large" />
            <Text style={styles.yukleniyorText}>Yıldızlar okunuyor...</Text>
          </View>
        )}

        {cevap !== '' && (
          <View style={styles.cevapBox}>
            <Text style={styles.cevapBaslik}>✦ Falın</Text>
            <Text style={styles.cevap}>{cevap}</Text>
          </View>
        )}
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
  sectionTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12, marginTop: 20 },
  falTurleri: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  falCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)' },
  falCardActive: { backgroundColor: 'rgba(127,119,221,0.2)', borderColor: 'rgba(127,119,221,0.5)' },
  falIcon: { fontSize: 24, marginBottom: 6 },
  falLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, color: '#fff', fontSize: 13, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)', minHeight: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#7F77DD', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 1 },
  yukleniyor: { alignItems: 'center', padding: 30, gap: 12 },
  yukleniyorText: { color: '#AFA9EC', fontSize: 13 },
  cevapBox: { backgroundColor: 'rgba(127,119,221,0.1)', borderRadius: 16, padding: 20, marginTop: 16, borderWidth: 0.5, borderColor: 'rgba(127,119,221,0.3)', marginBottom: 40 },
  cevapBaslik: { fontSize: 12, color: '#AFA9EC', letterSpacing: 3, marginBottom: 12 },
  cevap: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },
});
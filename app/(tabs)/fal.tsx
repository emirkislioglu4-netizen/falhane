import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { falBak } from '../../lib/claude';

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

  const handleFalBak = async () => {
    if (!soru || !seciliFal) return;
    setYukleniyor(true);
    setCevap('');
    
    const sonuc = await falBak(soru, seciliFal);
    setCevap(sonuc);
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
          onPress={handleFalBak}
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
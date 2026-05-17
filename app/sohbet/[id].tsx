import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function SohbetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [mesajlar, setMesajlar] = useState<any[]>([]);
  const [yeniMesaj, setYeniMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kullanici, setKullanici] = useState<any>(null);
  const [sohbet, setSohbet] = useState<any>(null);
  const [fotografYukleniyor, setFotografYukleniyor] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    yukle();
    const interval = setInterval(mesajlariYukle, 3000);
    return () => clearInterval(interval);
  }, []);

  const yukle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setKullanici(user);

    if (!user) {
      router.push('/giris');
      return;
    }

    const { data: sohbetData } = await supabase
      .from('sohbetler')
      .select('*')
      .eq('id', id)
      .single();

    setSohbet(sohbetData);
    await mesajlariYukle();
    setYukleniyor(false);
  };

  const mesajlariYukle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !id) return;

    const { data: sohbetData } = await supabase
      .from('sohbetler')
      .select('*')
      .eq('id', id)
      .single();

    if (!sohbetData) return;

    const digerKullanici = sohbetData.musteri_id === user.id 
      ? sohbetData.falci_id 
      : sohbetData.musteri_id;

    const { data } = await supabase
      .from('mesajlar')
      .select('*')
      .or(`and(gonderen_id.eq.${user.id},alici_id.eq.${digerKullanici}),and(gonderen_id.eq.${digerKullanici},alici_id.eq.${user.id})`)
      .order('olusturulma_tarihi', { ascending: true });

    if (data) {
      setMesajlar(data);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const mesajGonder = async (fotografUrl?: string) => {
    if ((!yeniMesaj.trim() && !fotografUrl) || !kullanici || !sohbet) return;

    const aliciId = sohbet.musteri_id === kullanici.id 
      ? sohbet.falci_id 
      : sohbet.musteri_id;

    const mesajMetni = yeniMesaj || (fotografUrl ? '📸 Fotoğraf' : '');
    setYeniMesaj('');

    await supabase.from('mesajlar').insert({
      gonderen_id: kullanici.id,
      alici_id: aliciId,
      mesaj: mesajMetni,
      fotograf: fotografUrl || null,
    });

    await supabase
      .from('sohbetler')
      .update({ son_mesaj: mesajMetni, son_mesaj_tarihi: new Date().toISOString() })
      .eq('id', id);

    await mesajlariYukle();
  };

  const fotografSec = async () => {
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri izni gerekiyor');
      return;
    }

    const sonuc = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (sonuc.canceled || !sonuc.assets[0]) return;

    setFotografYukleniyor(true);

    try {
      const asset = sonuc.assets[0];
      const dosyaAdi = `${kullanici.id}_${Date.now()}.jpg`;
      
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from('mesaj-fotograflari')
        .upload(dosyaAdi, blob, {
          contentType: 'image/jpeg',
        });

      if (error) {
        Alert.alert('Hata', 'Fotoğraf yüklenemedi: ' + error.message);
        setFotografYukleniyor(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('mesaj-fotograflari')
        .getPublicUrl(dosyaAdi);

      await mesajGonder(publicUrl);
    } catch (e: any) {
      Alert.alert('Hata', 'Fotoğraf gönderilemedi: ' + e.message);
    }

    setFotografYukleniyor(false);
  };

  if (yukleniyor) {
    return (
      <View style={styles.bosContainer}>
        <ActivityIndicator color="#AFA9EC" size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.geriBtn}>
          <Text style={styles.geriBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerIcon}>🌙</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerIsim}>Falcı</Text>
          <Text style={styles.headerDurum}>● Çevrimiçi</Text>
        </View>
      </View>

      <ScrollView 
        ref={scrollRef}
        style={styles.body} 
        contentContainerStyle={styles.bodyContent}
      >
        {mesajlar.length === 0 ? (
          <Text style={styles.bosText}>Sohbete başla! İlk mesajını yaz...</Text>
        ) : (
          mesajlar.map((m) => (
            <View 
              key={m.id} 
              style={[
                styles.mesajBox,
                m.gonderen_id === kullanici?.id ? styles.benim : styles.diger
              ]}
            >
              {m.fotograf && (
                <Image 
                  source={{ uri: m.fotograf }} 
                  style={styles.mesajFoto}
                  resizeMode="cover"
                />
              )}
              {m.mesaj && m.mesaj !== '📸 Fotoğraf' && <Text style={styles.mesajText}>{m.mesaj}</Text>}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputBox}>
        <TouchableOpacity 
          style={styles.fotoBtn}
          onPress={fotografSec}
          disabled={fotografYukleniyor}
        >
          {fotografYukleniyor ? (
            <ActivityIndicator color="#AFA9EC" size="small" />
          ) : (
            <Text style={styles.fotoBtnText}>📸</Text>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Mesajını yaz..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={yeniMesaj}
          onChangeText={setYeniMesaj}
          multiline
        />
        <TouchableOpacity 
          style={[styles.gonderBtn, !yeniMesaj.trim() && styles.gonderBtnDisabled]}
          onPress={() => mesajGonder()}
          disabled={!yeniMesaj.trim()}
        >
          <Text style={styles.gonderBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0814' },
  bosContainer: { flex: 1, backgroundColor: '#0A0814', alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, backgroundColor: '#1a0533', gap: 12 },
  geriBtn: { padding: 8 },
  geriBtnText: { fontSize: 24, color: '#fff' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(127,119,221,0.3)', alignItems: 'center', justifyContent: 'center' },
  headerIcon: { fontSize: 20 },
  headerInfo: { flex: 1 },
  headerIsim: { fontSize: 15, color: '#fff', fontWeight: '600' },
  headerDurum: { fontSize: 11, color: '#1D9E75', marginTop: 2 },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 20 },
  bosText: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40 },
  mesajBox: { maxWidth: '75%', padding: 12, borderRadius: 16, marginBottom: 8 },
  benim: { backgroundColor: '#7F77DD', alignSelf: 'flex-end' },
  diger: { backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'flex-start' },
  mesajText: { fontSize: 14, color: '#fff', lineHeight: 20 },
  mesajFoto: { width: 200, height: 200, borderRadius: 10, marginBottom: 8 },
  inputBox: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#1a0533', borderTopWidth: 0.5, borderTopColor: 'rgba(127,119,221,0.2)', alignItems: 'flex-end' },
  fotoBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  fotoBtnText: { fontSize: 18 },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontSize: 13, maxHeight: 100 },
  gonderBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#7F77DD', alignItems: 'center', justifyContent: 'center' },
  gonderBtnDisabled: { opacity: 0.4 },
  gonderBtnText: { fontSize: 20, color: '#fff', fontWeight: '600' },
});
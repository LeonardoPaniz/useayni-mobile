import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { miscellaneousService } from '../services/miscellaneousService';

interface Props {
  sessionId: string;
}

// QR rendering: se o projeto tiver react-native-qrcode-svg instalado usa-o,
// caso contrário mostra o token como texto para ser lido pelo scanner.
let QRCode: React.ComponentType<{ value: string; size: number }> | null = null;
try {
  QRCode = require('react-native-qrcode-svg').default;
} catch {
  // não instalado
}

export default function QRCodeScreen({ sessionId }: Props) {
  const { accessToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    miscellaneousService.getAttendanceToken(sessionId, accessToken)
      .then((t) => { setToken(t.token); setExpiresAt(t.expires_at); })
      .catch(() => setError('Não foi possível gerar o token de presença.'))
      .finally(() => setLoading(false));
  }, [sessionId, accessToken]);

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} color="#6366f1" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu QR de presença</Text>
      {token && QRCode ? (
        <View style={styles.qrBox}>
          <QRCode value={token} size={220} />
        </View>
      ) : (
        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>Token</Text>
          <Text style={styles.token} selectable>{token}</Text>
        </View>
      )}
      {expiresAt && (
        <Text style={styles.expiry}>
          Válido até {new Date(expiresAt).toLocaleTimeString('pt-BR')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 32 },
  qrBox: {
    backgroundColor: '#ffffff', padding: 20, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  tokenBox: {
    backgroundColor: '#ffffff', padding: 20, borderRadius: 16, width: '100%',
    alignItems: 'center',
  },
  tokenLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 8 },
  token: { fontSize: 13, color: '#0f172a', textAlign: 'center', lineHeight: 20 },
  expiry: { marginTop: 20, fontSize: 13, color: '#94a3b8' },
  error: { textAlign: 'center', color: '#dc2626', marginTop: 60, padding: 24 },
});

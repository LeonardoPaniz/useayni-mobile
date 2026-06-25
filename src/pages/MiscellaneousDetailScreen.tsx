import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { miscellaneousService, type MiscSummary } from '../services/miscellaneousService';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  miscId: string;
  onBack: () => void;
}

export default function MiscellaneousDetailScreen({ miscId, onBack }: Props) {
  const { token } = useAuth();
  const [misc, setMisc] = useState<MiscSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!miscId || !token) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await miscellaneousService.getById(miscId, token);
        setMisc(data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [miscId, token]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} color="#6366f1" />;
  }

  if (!misc) {
    return <Text style={styles.empty}>Miscelânea não encontrada.</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>
      <Text style={styles.title}>{misc.title}</Text>
      <Text style={styles.meta}>{misc.type} • {misc.status}</Text>
      <Text style={styles.description}>{(misc as any).description ?? 'Sem descrição adicional.'}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Participação</Text>
        <Text style={styles.cardText}>{(misc as any).participation_type === 'private' ? 'Privada — solicitações são aprovadas pelo dono.' : 'Pública — qualquer membro elegível pode entrar.'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Escopo</Text>
        <Text style={styles.cardText}>{(misc as any).scope_rules?.length ? `${(misc as any).scope_rules.length} regra(s) configurada(s)` : 'Sem regras de escopo específicas.'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  backButton: { marginBottom: 16 },
  backText: { color: '#2563eb', fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  meta: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  description: { fontSize: 15, color: '#334155', lineHeight: 22, marginBottom: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  cardText: { fontSize: 14, color: '#475569' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
});

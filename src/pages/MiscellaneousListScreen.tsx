import { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Pressable,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { miscellaneousService, MiscSummary } from '../services/miscellaneousService';
import MiscellaneousDetailScreen from './MiscellaneousDetailScreen';

const TYPE_LABELS: Record<string, string> = {
  project: 'Projeto', event: 'Evento', goal: 'Meta',
  meeting: 'Reunião', activity: 'Atividade', form: 'Formulário',
};

const STATUS_COLORS: Record<string, string> = {
  active: '#16a34a', draft: '#6b7280', pending_approval: '#d97706',
  under_review: '#2563eb', rejected: '#dc2626', archived: '#94a3b8',
};

interface Props {
  onSelect: (id: string) => void;
}

export default function MiscellaneousListScreen({ onSelect }: Props) {
  const { token } = useAuth();
  const [items, setItems] = useState<MiscSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'owner' | 'participant'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const role = tab === 'all' ? undefined : tab;
      const res = await miscellaneousService.list(token, { myRole: role });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab, token]);

  const filtered = search
    ? items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  if (selectedId) {
    return <MiscellaneousDetailScreen miscId={selectedId} onBack={() => { setSelectedId(null); onSelect(''); }} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar miscelâneas…"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#94a3b8"
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['all', 'owner', 'participant'] as const).map((t) => (
          <Pressable
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'all' ? 'Todas' : t === 'owner' ? 'Sou dono' : 'Participo'}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#6366f1" />
      ) : filtered.length === 0 ? (
        <Text style={styles.empty}>Nenhuma miscelânea encontrada.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => { setSelectedId(item.id); onSelect(item.id); }}>
              <View style={styles.cardHeader}>
                <Text style={[styles.typeBadge, { backgroundColor: '#e0e7ff' }]}>
                  {TYPE_LABELS[item.type] ?? item.type}
                </Text>
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] ?? '#6b7280' }]} />
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardDate}>
                {new Date(item.start_date).toLocaleDateString('pt-BR')}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  search: {
    backgroundColor: '#ffffff', borderRadius: 10, borderWidth: 1,
    borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, color: '#0f172a', marginBottom: 12,
  },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center', backgroundColor: '#ffffff',
  },
  tabActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  tabText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  tabTextActive: { color: '#ffffff' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 16,
    marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  typeBadge: { fontSize: 11, fontWeight: '600', color: '#4338ca', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  cardDate: { fontSize: 12, color: '#94a3b8' },
});

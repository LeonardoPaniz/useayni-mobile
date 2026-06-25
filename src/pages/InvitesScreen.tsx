import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { miscellaneousService } from '../services/miscellaneousService';

interface Invite {
  id: string;
  miscellaneous_id: string;
  status: string;
  expires_at: string;
  miscellaneous: { title: string; type: string };
  invitedBy: { name: string };
}

export default function InvitesScreen() {
  const { accessToken } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await miscellaneousService.getMyInvites(accessToken);
      setInvites(data as Invite[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handle = async (invite: Invite, action: 'accept' | 'reject') => {
    if (!accessToken) return;
    setActing(invite.id);
    try {
      if (action === 'accept') {
        await miscellaneousService.acceptInvite(invite.miscellaneous_id, invite.id, accessToken);
      } else {
        await miscellaneousService.rejectInvite(invite.miscellaneous_id, invite.id, accessToken);
      }
      load();
    } finally {
      setActing(null);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} color="#6366f1" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus convites</Text>
      {invites.length === 0 ? (
        <Text style={styles.empty}>Nenhum convite pendente.</Text>
      ) : (
        <FlatList
          data={invites}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.miscTitle}>{item.miscellaneous?.title}</Text>
              <Text style={styles.meta}>
                Convidado por {item.invitedBy?.name} · Expira {new Date(item.expires_at).toLocaleDateString('pt-BR')}
              </Text>
              <View style={styles.actions}>
                <Pressable
                  style={[styles.btn, styles.btnAccept, acting === item.id && styles.btnDisabled]}
                  disabled={acting === item.id}
                  onPress={() => handle(item, 'accept')}
                >
                  <Text style={styles.btnText}>✓ Aceitar</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.btnReject, acting === item.id && styles.btnDisabled]}
                  disabled={acting === item.id}
                  onPress={() => handle(item, 'reject')}
                >
                  <Text style={[styles.btnText, { color: '#dc2626' }]}>✕ Recusar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 16,
    marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  miscTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  meta: { fontSize: 12, color: '#94a3b8', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  btnAccept: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  btnReject: { backgroundColor: '#ffffff', borderColor: '#fca5a5' },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontWeight: '600', fontSize: 14, color: '#ffffff' },
});

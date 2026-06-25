import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { PanelLeft } from "lucide-react-native";
import { useState } from "react";
import SideMenu from "../components/SideMenu";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [isMenu, setIsMenu] = useState(false);

  return (
    <>
      <SideMenu visible={isMenu} onClose={() => setIsMenu(false)} />
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.headerMenu} onPress={() => setIsMenu(true)}>
          <PanelLeft />
          <Text style={styles.subtitle}>Home</Text>
        </Pressable>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Bem-vindo, {user?.name ?? "usuário"}
            </Text>
            <Text style={styles.subtitle}>
              UseAyni sua plataforma de colaboração acadêmica.
            </Text>
          </View>
        </View>
        <Pressable style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comunidades</Text>
          <Text style={styles.sectionText}>
            Acompanhe grupos, projetos e entregas do seu curso.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metas</Text>
          <Text style={styles.sectionText}>
            Veja seu progresso e mantenha o foco nas próximas atividades.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos</Text>
          <Text style={styles.sectionText}>
            Fique por dentro de avisos, reuniões e datas importantes.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
  },
  headerMenu: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    marginTop: 50,
  },
  header: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
  },
  logoutButton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  logoutText: {
    color: "#1E293B",
    fontWeight: "700",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
});

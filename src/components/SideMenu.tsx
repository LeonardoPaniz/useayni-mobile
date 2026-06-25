import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import {
  PanelLeft,
  MessageSquare,
  Users,
  Target,
  Calendar,
  Award,
  CheckSquare,
  Settings,
  ChevronRight,
  X,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentMember } from "../hooks/useCurrentMember";

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
}

const mockComunidades = ["Comunidade A", "Comunidade B", "Comunidade C"];

export default function SideMenu({
  visible,
  onClose,
  onNavigate,
}: SideMenuProps) {
  const { member } = useCurrentMember();
  const insets = useSafeAreaInsets();
  const [comunidadesOpen, setComunidadesOpen] = useState(false);
  const [tarefasOpen, setTarefasOpen] = useState(false);
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);

  const roles = useMemo(() => member?.roles ?? [], [member?.roles]);
  const activeRole = roles[activeRoleIndex] ?? roles[0];

  const handleNavigate = (screen: string) => {
    onClose();
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      backdropOpacity={0.45}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}>
      <View style={styles.backdrop}>
        <View style={styles.menuContainer}>
          <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
            <View style={styles.headerRow}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.profileRow}
              onPress={() =>
                roles.length > 1 &&
                setActiveRoleIndex((prev) => (prev + 1) % roles.length)
              }
              activeOpacity={0.8}>
              <Image
                source={{
                  uri:
                    member?.profile_picture_url ||
                    "https://via.placeholder.com/100",
                }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {member?.name ?? "Usuário"}
                </Text>
                <Text style={styles.profileEmail}>
                  {member?.email_personal ??
                    member?.email_university ??
                    "email@example.com"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileCard}
              onPress={() =>
                roles.length > 1 &&
                setActiveRoleIndex((prev) => (prev + 1) % roles.length)
              }
              activeOpacity={0.85}>
              <Text style={styles.profileLabel}>
                Perfil • toque para alternar
              </Text>
              <Text style={styles.profileValue}>
                {activeRole?.name ?? "Sem cargo"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Navegação</Text>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemActive]}
              onPress={() => handleNavigate("Home")}>
              <View style={styles.iconContainerActive}>
                <PanelLeft size={20} color="#475569" />
              </View>
              <Text style={styles.menuItemText}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("MiscellaneousList")}>
              <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                  <MessageSquare size={20} color="#475569" />
                </View>
                <Text style={styles.menuItemText}>Miscelâneas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setComunidadesOpen(!comunidadesOpen)}>
              <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                  <Users size={20} color="#475569" />
                </View>
                <Text style={styles.menuItemText}>Comunidades</Text>
              </View>
              <ChevronRight
                size={18}
                color="#475569"
                style={{
                  transform: [{ rotate: comunidadesOpen ? "90deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>
            {comunidadesOpen && (
              <View style={styles.submenuContainer}>
                {mockComunidades.map((comunidade) => (
                  <TouchableOpacity key={comunidade} style={styles.submenuItem}>
                    <Text style={styles.submenuText}>{comunidade}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.submenuItem}>
                  <Text style={styles.submenuText}>Explorar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Metas")}>
              <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                  <Target size={20} color="#475569" />
                </View>
                <Text style={styles.menuItemText}>Metas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Agenda")}>
              <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                  <Calendar size={20} color="#475569" />
                </View>
                <Text style={styles.menuItemText}>Agenda</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Participações")}>
              <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                  <Award size={20} color="#475569" />
                </View>
                <Text style={styles.menuItemText}>Participações</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setTarefasOpen(!tarefasOpen)}>
              <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                  <CheckSquare size={20} color="#475569" />
                </View>
                <Text style={styles.menuItemText}>Tarefas</Text>
              </View>
              <ChevronRight
                size={18}
                color="#475569"
                style={{
                  transform: [{ rotate: tarefasOpen ? "90deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>
            {tarefasOpen && (
              <View style={styles.submenuContainer}>
                <TouchableOpacity style={styles.submenuItem}>
                  <Text style={styles.submenuText}>Vinculadas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submenuItem}>
                  <Text style={styles.submenuText}>Explorar</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>Configurações</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Configurações")}>
              <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                  <Settings size={20} color="#475569" />
                </View>
                <Text style={styles.menuItemText}>Configurações</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-start",
  },
  menuContainer: {
    width: 320,
    height: "100%",
    backgroundColor: "#ffffff",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#020617",
  },
  closeButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
  },
  profileRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#020617",
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  profileCard: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    shadowColor: "#cbd5e1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profileLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#64748b",
  },
  profileValue: {
    marginTop: 8,
    fontSize: 14,
    color: "#334155",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  menuItemActive: {
    backgroundColor: "#f1f5f9",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconContainerActive: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#cbd5e1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#020617",
  },
  submenuContainer: {
    marginLeft: 28,
    marginBottom: 12,
  },
  submenuItem: {
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  submenuText: {
    fontSize: 14,
    color: "#334155",
  },
});

import { useState } from "react";
import type { StackNavigationProp } from "@react-navigation/stack";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import CheckBox from "expo-checkbox";

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
};

type SignInScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "SignIn"
>;

type Props = {
  navigation: SignInScreenNavigationProp;
};

export default function SignInScreen({ navigation }: Props) {
  const { setUser, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({
        personalEmail: email,
        password,
        rememberMe,
      });
      setUser(response.member);
      setToken(response.accessToken);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao entrar. Verifique email e senha e tente novamente.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Image
          source={require("../../assets/icon.png")}
          style={{
            width: 440,
            height: 80,
            marginBottom: 60,
            alignSelf: "center",
          }}
        />
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>
          Use suas credenciais para acessar a plataforma.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Email pessoal</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
        </View>

        <View style={styles.checkbox}>
          <CheckBox value={rememberMe} onValueChange={setRememberMe} />
          <Text style={styles.labelCheckbox}>Lembrar-se de mim</Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size={20} color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>

        <View style={styles.footer}>
          <View
            style={{
              flexDirection: "column",
              marginRight: 20,
            }}>
            <Text style={styles.footerText}>Ainda não tem conta?</Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.footerLink}>Cadastre-se</Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "column",
              marginLeft: 20,
            }}>
            <Text style={styles.footerText}>Esqueceu sua senha?</Text>
            <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={styles.footerLink}>Recuperar senha</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: "#475569",
  },
  labelCheckbox: {
    fontSize: 14,
    color: "#475569",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#0F172A",
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 35,
  },
  footerText: {
    color: "#475569",
    marginRight: 6,
  },
  footerLink: {
    color: "#2563EB",
    fontWeight: "600",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 12,
    textAlign: "center",
  },
});

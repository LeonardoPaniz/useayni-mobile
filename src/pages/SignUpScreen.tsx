import { useState } from "react";
import type { StackNavigationProp } from "@react-navigation/stack";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { authService } from "../services/authService";

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "SignUp"
>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [emailPersonal, setEmailPersonal] = useState("");
  const [emailUniversity, setEmailUniversity] = useState("");
  const [ra, setRa] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (
      !name ||
      !cpf ||
      !phone ||
      !emailPersonal ||
      !emailUniversity ||
      !ra ||
      !birthDate ||
      !admissionDate ||
      !password
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Senhas não conferem.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.signUp({
        name,
        cpf,
        phone,
        email_personal: emailPersonal,
        email_university: emailUniversity,
        ra,
        birth_date: birthDate,
        admission_date: admissionDate,
        password,
        confirm_password: confirmPassword,
        university_not_applicable: true,
        course_not_applicable: true,
        current_semester_not_applicable: true,
      });
      setSuccess(
        "Cadastro enviado com sucesso! Aguarde a análise e faça login em seguida.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha no cadastro. Verifique os dados e tente novamente.";
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
        <Text style={styles.brand}>Ayni</Text>
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>
          Preencha seus dados para criar uma conta.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="João Silva"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            placeholder="12345678900"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
            editable={!isLoading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="(41) 99999-9999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!isLoading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email pessoal</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="seu@email.com"
            value={emailPersonal}
            onChangeText={setEmailPersonal}
            editable={!isLoading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email universitário</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="seu@universidade.edu"
            value={emailUniversity}
            onChangeText={setEmailUniversity}
            editable={!isLoading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>RA</Text>
          <TextInput
            style={styles.input}
            placeholder="RA da universidade"
            value={ra}
            onChangeText={setRa}
            editable={!isLoading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data de nascimento</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={birthDate}
            onChangeText={setBirthDate}
            editable={!isLoading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data de admissão</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={admissionDate}
            onChangeText={setAdmissionDate}
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

        <View style={styles.field}>
          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme a senha"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isLoading}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size={20} color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem conta?</Text>
          <Pressable onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.footerLink}>Entrar</Text>
          </Pressable>
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
  label: {
    marginBottom: 8,
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
  successText: {
    color: "#16a34a",
    marginBottom: 12,
    textAlign: "center",
  },
});

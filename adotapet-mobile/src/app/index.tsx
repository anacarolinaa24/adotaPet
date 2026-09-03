import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin() {
    try {
      const resposta = await fetch(
        "http://192.168.18.249:3000/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        },
      );

      const dados = await resposta.json();

      console.log(dados);

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao realizar login");
        return;
      }

      await AsyncStorage.setItem("token", dados.token);

      await AsyncStorage.setItem("tipo_usuario", dados.usuario.tipo_usuario);

      if (dados.usuario.tipo_usuario === "USUARIO") {
        router.replace("/home");
        return;
      }

      if (dados.usuario.tipo_usuario === "ADMIN") {
        alert("Área administrativa será criada em seguida.");
      }
    } catch (erro) {
      console.error("Erro no login:", erro);

      alert("Não foi possível conectar com a API.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AdotaPet 🐾</Text>

      <Text style={styles.subtitle}>
        Entre para encontrar seu novo melhor amigo
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={fazerLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.register}>
        Ainda não possui uma conta? Cadastre-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F7F7F7",
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 20,
    fontSize: 16,
  },

  button: {
    height: 50,
    backgroundColor: "#5C7CFA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  register: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 14,
  },
});

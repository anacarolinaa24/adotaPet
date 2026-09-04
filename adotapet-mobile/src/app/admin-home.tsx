import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminHomeScreen() {
  async function fazerLogout() {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("tipo_usuario");

      router.replace("/");
    } catch (erro) {
      console.error("Erro ao sair:", erro);
      alert("Não foi possível sair da conta.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdotaPet 🐾</Text>

      <Text style={styles.subtitle}>Área Administrativa</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/admin-solicitacoes")}
      >
        <Text style={styles.cardTitle}>Gerenciar solicitações</Text>

        <Text style={styles.cardText}>
          Visualize, aprove ou recuse solicitações de adoção.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/admin-animais")}
      >
        <Text style={styles.cardTitle}>Gerenciar animais</Text>

        <Text style={styles.cardText}>
          Cadastre, edite e gerencie os animais disponíveis para adoção.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={fazerLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 35,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 22,
  },

  logoutButton: {
    height: 50,
    backgroundColor: "#EAEAEA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

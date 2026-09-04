import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Animal = {
  id_animal: number;
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
  idade: number;
  descricao: string;
  status: string;
  foto: string | null;
};

export default function HomeScreen() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarAnimais();
  }, []);

  async function buscarAnimais() {
    try {
      const resposta = await fetch("http://192.168.18.249:3000/animais");

      const dados = await resposta.json();

      setAnimais(dados);
    } catch (erro) {
      console.error("Erro ao buscar animais:", erro);
      alert("Não foi possível carregar os animais.");
    } finally {
      setCarregando(false);
    }
  }

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

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />

        <Text>Carregando animais...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdotaPet 🐾</Text>

      <Text style={styles.subtitle}>Animais disponíveis para adoção</Text>

      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.solicitacoesButton}
          onPress={() => router.push("/minhas-solicitacoes")}
        >
          <Text style={styles.solicitacoesButtonText}>Minhas solicitações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={fazerLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={animais}
        keyExtractor={(item) => item.id_animal.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.foto ? (
              <Image
                source={{
                  uri: `http://192.168.18.249:3000/uploads/${item.foto}`,
                }}
                style={styles.image}
              />
            ) : (
              <View style={styles.semFoto}>
                <Text>Sem foto</Text>
              </View>
            )}

            <Text style={styles.nome}>{item.nome}</Text>

            <Text style={styles.info}>
              {item.especie} • {item.raca}
            </Text>

            <Text style={styles.info}>
              {item.idade} ano(s) • {item.sexo}
            </Text>

            <Text style={styles.status}>Status: {item.status}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/detalhes",
                  params: {
                    id_animal: item.id_animal.toString(),

                    nome: item.nome,

                    especie: item.especie,

                    raca: item.raca,

                    sexo: item.sexo,

                    idade: item.idade.toString(),

                    descricao: item.descricao,

                    status: item.status,

                    foto: item.foto || "",
                  },
                })
              }
            >
              <Text style={styles.buttonText}>Ver detalhes</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  topButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  solicitacoesButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#5C7CFA",
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  solicitacoesButtonText: {
    color: "#5C7CFA",
    fontSize: 15,
    fontWeight: "bold",
  },

  logoutButton: {
    height: 45,
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "600",
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },

  semFoto: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  nome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },

  info: {
    fontSize: 15,
    marginBottom: 4,
  },

  status: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },

  button: {
    backgroundColor: "#5C7CFA",
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

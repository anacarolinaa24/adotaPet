import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetalhesScreen() {
  const {
    id_animal,
    nome,
    especie,
    raca,
    sexo,
    idade,
    descricao,
    status,
    foto,
  } = useLocalSearchParams();

  async function solicitarAdocao() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const resposta = await fetch("http://192.168.18.249:3000/solicitacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_animal: Number(id_animal),
        }),
      });

      const dados = await resposta.json();

      console.log("Solicitação:", dados);

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao realizar solicitação de adoção");
        return;
      }

      alert("Solicitação de adoção enviada com sucesso!");
    } catch (erro) {
      console.error("Erro ao solicitar adoção:", erro);

      alert("Não foi possível enviar a solicitação de adoção.");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {foto ? (
        <Image
          source={{
            uri: `http://192.168.18.249:3000/uploads/${foto}`,
          }}
          style={styles.image}
        />
      ) : (
        <View style={styles.semFoto}>
          <Text>Sem foto</Text>
        </View>
      )}

      <Text style={styles.nome}>{nome}</Text>

      <Text style={styles.info}>Espécie: {especie}</Text>

      <Text style={styles.info}>Raça: {raca}</Text>

      <Text style={styles.info}>Sexo: {sexo}</Text>

      <Text style={styles.info}>Idade: {idade} ano(s)</Text>

      <Text style={styles.status}>Status: {status}</Text>

      <Text style={styles.tituloDescricao}>Sobre</Text>

      <Text style={styles.descricao}>{descricao}</Text>

      {status === "DISPONIVEL" && (
        <TouchableOpacity style={styles.button} onPress={solicitarAdocao}>
          <Text style={styles.buttonText}>Quero adotar</Text>
        </TouchableOpacity>
      )}

      {status === "ADOTADO" && (
        <View style={styles.indisponivel}>
          <Text style={styles.indisponivelText}>
            Este animal já foi adotado.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },

  semFoto: {
    width: "100%",
    height: 300,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 20,
  },

  nome: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
  },

  info: {
    fontSize: 17,
    marginBottom: 8,
  },

  status: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 20,
  },

  tituloDescricao: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  descricao: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#5C7CFA",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  indisponivel: {
    backgroundColor: "#EAEAEA",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },

  indisponivelText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});

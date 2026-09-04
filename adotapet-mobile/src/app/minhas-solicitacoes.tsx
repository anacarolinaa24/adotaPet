import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Solicitacao = {
  id_solicitacao: number;
  data_solicitacao: string;
  status: string;
  id_animal: number;
  nome_animal: string;
  especie: string;
  raca: string;
  foto: string | null;
  status_animal: string;
};

export default function MinhasSolicitacoesScreen() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  async function buscarSolicitacoes() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const resposta = await fetch(
        "http://192.168.18.249:3000/solicitacoes/minhas",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao buscar solicitações.");
        return;
      }

      setSolicitacoes(dados);
    } catch (erro) {
      console.error("Erro ao buscar solicitações:", erro);

      alert("Não foi possível carregar suas solicitações.");
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Carregando solicitações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas solicitações 🐾</Text>

      {solicitacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioText}>
            Você ainda não possui solicitações de adoção.
          </Text>
        </View>
      ) : (
        <FlatList
          data={solicitacoes}
          keyExtractor={(item) => item.id_solicitacao.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.animal}>{item.nome_animal}</Text>

              <Text style={styles.info}>
                {item.especie} • {item.raca}
              </Text>

              <Text style={styles.info}>
                Solicitação nº {item.id_solicitacao}
              </Text>

              <Text style={styles.status}>
                Status da solicitação: {item.status}
              </Text>

              <Text style={styles.statusAnimal}>
                Status do animal: {item.status_animal}
              </Text>
            </View>
          )}
        />
      )}
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },

  animal: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  info: {
    fontSize: 15,
    marginBottom: 5,
  },

  status: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },

  statusAnimal: {
    fontSize: 14,
    marginTop: 6,
  },

  vazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  vazioText: {
    fontSize: 16,
    textAlign: "center",
  },
});

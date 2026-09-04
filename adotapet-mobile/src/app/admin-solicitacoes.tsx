import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Solicitacao = {
  id_solicitacao: number;
  data_solicitacao: string;
  status: string;

  id_usuario: number;
  nome_usuario: string;
  email_usuario: string;

  id_animal: number;
  nome_animal: string;
  especie: string;
  raca: string;
};

export default function AdminSolicitacoesScreen() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState<number | null>(null);

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  async function buscarSolicitacoes() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Administrador não autenticado.");
        return;
      }

      const resposta = await fetch("http://192.168.18.249:3000/solicitacoes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resposta.json();

      console.log("Solicitações ADMIN:", dados);

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao carregar solicitações.");
        return;
      }

      setSolicitacoes(dados);
    } catch (erro) {
      console.error("Erro ao buscar solicitações:", erro);

      alert("Não foi possível carregar as solicitações.");
    } finally {
      setCarregando(false);
    }
  }

  async function aprovarSolicitacao(id: number) {
    try {
      setProcessando(id);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Administrador não autenticado.");
        return;
      }

      const resposta = await fetch(
        `http://192.168.18.249:3000/solicitacoes/${id}/aprovar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const dados = await resposta.json();

      console.log("Aprovação:", dados);

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao aprovar solicitação.");
        return;
      }

      alert("Solicitação aprovada com sucesso!");

      await buscarSolicitacoes();
    } catch (erro) {
      console.error("Erro ao aprovar solicitação:", erro);

      alert("Não foi possível aprovar a solicitação.");
    } finally {
      setProcessando(null);
    }
  }

  async function recusarSolicitacao(id: number) {
    try {
      setProcessando(id);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Administrador não autenticado.");
        return;
      }

      const resposta = await fetch(
        `http://192.168.18.249:3000/solicitacoes/${id}/recusar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const dados = await resposta.json();

      console.log("Recusa:", dados);

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao recusar solicitação.");
        return;
      }

      alert("Solicitação recusada com sucesso!");

      await buscarSolicitacoes();
    } catch (erro) {
      console.error("Erro ao recusar solicitação:", erro);

      alert("Não foi possível recusar a solicitação.");
    } finally {
      setProcessando(null);
    }
  }

  function confirmarAprovacao(id: number) {
    Alert.alert(
      "Aprovar solicitação",
      "Deseja realmente aprovar esta solicitação de adoção?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aprovar",
          onPress: () => aprovarSolicitacao(id),
        },
      ],
    );
  }

  function confirmarRecusa(id: number) {
    Alert.alert(
      "Recusar solicitação",
      "Deseja realmente recusar esta solicitação de adoção?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Recusar",
          style: "destructive",
          onPress: () => recusarSolicitacao(id),
        },
      ],
    );
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
      <Text style={styles.title}>Solicitações de adoção 🐾</Text>

      {solicitacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioText}>Nenhuma solicitação encontrada.</Text>
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

              <Text style={styles.usuario}>
                Solicitante: {item.nome_usuario}
              </Text>

              <Text style={styles.info}>{item.email_usuario}</Text>

              <Text style={styles.status}>Status: {item.status}</Text>

              {item.status === "PENDENTE" && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[
                      styles.aprovarButton,
                      processando === item.id_solicitacao &&
                        styles.buttonDisabled,
                    ]}
                    disabled={processando === item.id_solicitacao}
                    onPress={() => confirmarAprovacao(item.id_solicitacao)}
                  >
                    {processando === item.id_solicitacao ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={styles.actionText}>Aprovar</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.recusarButton,
                      processando === item.id_solicitacao &&
                        styles.buttonDisabled,
                    ]}
                    disabled={processando === item.id_solicitacao}
                    onPress={() => confirmarRecusa(item.id_solicitacao)}
                  >
                    <Text style={styles.actionText}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {item.status === "APROVADA" && (
                <View style={styles.finalizada}>
                  <Text style={styles.finalizadaText}>
                    Solicitação aprovada
                  </Text>
                </View>
              )}

              {item.status === "RECUSADA" && (
                <View style={styles.finalizada}>
                  <Text style={styles.finalizadaText}>
                    Solicitação recusada
                  </Text>
                </View>
              )}
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

  usuario: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },

  info: {
    fontSize: 15,
    marginBottom: 5,
  },

  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  aprovarButton: {
    flex: 1,
    height: 45,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  recusarButton: {
    flex: 1,
    height: 45,
    backgroundColor: "#D9534F",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  finalizada: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },

  finalizadaText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
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

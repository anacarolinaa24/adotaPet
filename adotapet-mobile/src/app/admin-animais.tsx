import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import {
  ActivityIndicator,
  Alert,
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

export default function AdminAnimaisScreen() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState<number | null>(null);

  useEffect(() => {
    buscarAnimais();
  }, []);

  async function buscarAnimais() {
    try {
      const resposta = await fetch("http://192.168.18.249:3000/animais");

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao carregar animais.");
        return;
      }

      setAnimais(dados);
    } catch (erro) {
      console.error("Erro ao buscar animais:", erro);

      alert("Não foi possível carregar os animais.");
    } finally {
      setCarregando(false);
    }
  }

  async function excluirAnimal(id: number) {
    try {
      setExcluindo(id);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Administrador não autenticado.");
        return;
      }

      const resposta = await fetch(`http://192.168.18.249:3000/animais/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resposta.json();

      console.log("Exclusão animal:", dados);

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao excluir animal.");
        return;
      }

      alert("Animal excluído com sucesso!");

      await buscarAnimais();
    } catch (erro) {
      console.error("Erro ao excluir animal:", erro);

      alert("Não foi possível excluir o animal.");
    } finally {
      setExcluindo(null);
    }
  }

  function confirmarExclusao(animal: Animal) {
    Alert.alert("Excluir animal", `Deseja realmente excluir ${animal.nome}?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => excluirAnimal(animal.id_animal),
      },
    ]);
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
      <Text style={styles.title}>Gerenciar animais 🐾</Text>

      <TouchableOpacity
        style={styles.novoButton}
        onPress={() => router.push("/admin-cadastrar-animal")}
      >
        <Text style={styles.novoButtonText}>+ Cadastrar animal</Text>
      </TouchableOpacity>

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

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editarButton}
                onPress={() =>
                  router.push({
                    pathname: "/admin-editar-animal",
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
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.excluirButton,
                  excluindo === item.id_animal && styles.buttonDisabled,
                ]}
                disabled={excluindo === item.id_animal}
                onPress={() => confirmarExclusao(item)}
              >
                {excluindo === item.id_animal ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.actionText}>Excluir</Text>
                )}
              </TouchableOpacity>
            </View>
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  novoButton: {
    height: 48,
    backgroundColor: "#5C7CFA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  novoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },

  semFoto: {
    width: "100%",
    height: 180,
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
    fontSize: 15,
    fontWeight: "600",
    marginTop: 5,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  editarButton: {
    flex: 1,
    height: 45,
    backgroundColor: "#F0AD4E",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  excluirButton: {
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
});

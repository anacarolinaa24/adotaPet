import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { fetch } from "expo/fetch";
import { router, useLocalSearchParams } from "expo-router";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminEditarAnimalScreen() {
  const {
    id_animal,
    nome: nomeInicial,
    especie: especieInicial,
    raca: racaInicial,
    sexo: sexoInicial,
    idade: idadeInicial,
    descricao: descricaoInicial,
    status: statusInicial,
    foto: fotoInicial,
  } = useLocalSearchParams();

  const [nome, setNome] = useState(String(nomeInicial || ""));
  const [especie, setEspecie] = useState(String(especieInicial || ""));
  const [raca, setRaca] = useState(String(racaInicial || ""));
  const [sexo, setSexo] = useState(String(sexoInicial || ""));
  const [idade, setIdade] = useState(String(idadeInicial || ""));
  const [descricao, setDescricao] = useState(String(descricaoInicial || ""));
  const [status, setStatus] = useState(String(statusInicial || "DISPONIVEL"));

  const [novaImagemUri, setNovaImagemUri] = useState<string | null>(null);

  async function escolherNovaImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      alert("Permissão para acessar a galeria é necessária.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setNovaImagemUri(resultado.assets[0].uri);
    }
  }

  async function salvarAlteracoes() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Administrador não autenticado.");
        return;
      }

      if (
        !nome ||
        !especie ||
        !raca ||
        !sexo ||
        !idade ||
        !descricao ||
        !status
      ) {
        alert("Preencha todos os campos.");
        return;
      }

      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("especie", especie);
      formData.append("raca", raca);
      formData.append("sexo", sexo.toUpperCase());
      formData.append("idade", idade);
      formData.append("descricao", descricao);
      formData.append("status", status.toUpperCase());

      if (novaImagemUri) {
        const arquivo = new File(novaImagemUri);

        formData.append("foto", arquivo);
      }

      const resposta = await fetch(
        `http://192.168.18.249:3000/animais/${id_animal}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const dados = await resposta.json();

      console.log("Edição animal:", dados);

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao atualizar animal.");
        return;
      }

      alert("Animal atualizado com sucesso!");

      router.replace("/admin-animais");
    } catch (erro) {
      console.error("Erro ao atualizar animal:", erro);

      alert("Não foi possível atualizar o animal.");
    }
  }

  const fotoAtual =
    novaImagemUri ||
    (fotoInicial ? `http://192.168.18.249:3000/uploads/${fotoInicial}` : null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Editar animal 🐾</Text>

      {fotoAtual ? (
        <Image
          source={{
            uri: fotoAtual,
          }}
          style={styles.preview}
        />
      ) : (
        <View style={styles.semFoto}>
          <Text>Animal sem foto</Text>
        </View>
      )}

      <TouchableOpacity style={styles.imageButton} onPress={escolherNovaImagem}>
        <Text style={styles.imageButtonText}>Escolher nova foto</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Nome</Text>

      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Espécie</Text>

      <TextInput
        style={styles.input}
        value={especie}
        onChangeText={setEspecie}
      />

      <Text style={styles.label}>Raça</Text>

      <TextInput style={styles.input} value={raca} onChangeText={setRaca} />

      <Text style={styles.label}>Sexo</Text>

      <TextInput
        style={styles.input}
        value={sexo}
        onChangeText={setSexo}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Idade</Text>

      <TextInput
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descrição</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Text style={styles.label}>Status</Text>

      <TextInput
        style={styles.input}
        value={status}
        onChangeText={(texto) => setStatus(texto.toUpperCase())}
      />

      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar alterações</Text>
      </TouchableOpacity>
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

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  preview: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 15,
  },

  semFoto: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  imageButton: {
    height: 48,
    borderWidth: 1,
    borderColor: "#5C7CFA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 25,
  },

  imageButtonText: {
    color: "#5C7CFA",
    fontSize: 16,
    fontWeight: "bold",
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
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 18,
    fontSize: 16,
  },

  textArea: {
    height: 110,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  button: {
    height: 50,
    backgroundColor: "#F0AD4E",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});

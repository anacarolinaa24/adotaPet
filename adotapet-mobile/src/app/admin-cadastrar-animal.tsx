import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { fetch } from "expo/fetch";
import { router } from "expo-router";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function AdminCadastrarAnimalScreen() {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [sexo, setSexo] = useState("");
  const [idade, setIdade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("DISPONIVEL");

  const [imagemUri, setImagemUri] = useState<string | null>(null);

  async function escolherImagem() {
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
      setImagemUri(resultado.assets[0].uri);
    }
  }

  async function cadastrarAnimal() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Administrador não autenticado.");
        return;
      }

      if (!nome || !especie || !raca || !sexo || !idade || !descricao) {
        alert("Preencha todos os campos obrigatórios.");
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

      if (imagemUri) {
        const arquivo = new File(imagemUri);

        formData.append("foto", arquivo);
      }

      const resposta = await fetch("http://192.168.18.249:3000/animais", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const dados = await resposta.json();

      console.log("Cadastro animal:", dados);

      if (!resposta.ok) {
        alert(dados.mensagem || "Erro ao cadastrar animal.");
        return;
      }

      alert("Animal cadastrado com sucesso!");

      router.replace("/admin-animais");
    } catch (erro) {
      console.error("Erro ao cadastrar animal:", erro);

      alert("Não foi possível cadastrar o animal.");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cadastrar animal 🐾</Text>

      <Text style={styles.label}>Nome</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do animal"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Espécie</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex.: Cachorro"
        value={especie}
        onChangeText={setEspecie}
      />

      <Text style={styles.label}>Raça</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex.: SRD"
        value={raca}
        onChangeText={setRaca}
      />

      <Text style={styles.label}>Sexo</Text>

      <TextInput
        style={styles.input}
        placeholder="MACHO ou FEMEA"
        value={sexo}
        onChangeText={setSexo}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Idade</Text>

      <TextInput
        style={styles.input}
        placeholder="Idade em anos"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descrição</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Conte um pouco sobre o animal"
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

      <TouchableOpacity style={styles.imageButton} onPress={escolherImagem}>
        <Text style={styles.imageButtonText}>Escolher foto</Text>
      </TouchableOpacity>

      {imagemUri && (
        <Image
          source={{
            uri: imagemUri,
          }}
          style={styles.preview}
        />
      )}

      <TouchableOpacity
        style={styles.cadastrarButton}
        onPress={cadastrarAnimal}
      >
        <Text style={styles.cadastrarButtonText}>Cadastrar animal</Text>
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

  imageButton: {
    height: 48,
    borderWidth: 1,
    borderColor: "#5C7CFA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },

  imageButtonText: {
    color: "#5C7CFA",
    fontSize: 16,
    fontWeight: "bold",
  },

  preview: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },

  cadastrarButton: {
    height: 50,
    backgroundColor: "#5C7CFA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  cadastrarButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});

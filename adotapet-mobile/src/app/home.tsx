import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdotaPet 🐾</Text>

      <Text style={styles.subtitle}>Bem-vinda!</Text>

      <Text style={styles.text}>
        Aqui você verá os animais disponíveis para adoção.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F7F7F7",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    textAlign: "center",
  },
});

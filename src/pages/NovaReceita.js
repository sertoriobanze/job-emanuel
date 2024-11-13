import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { React, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

const NovaReceita = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [db, setDb] = useState(null);
  const [formData, setFormData] = useState({
    nomeReceita: "",
    tipoReceita: "",
    valor: "",
  });

  // Initialize database
  useEffect(() => {
    async function initializeDatabase() {
      try {
        const database = await SQLite.openDatabaseAsync("financas.db");
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS receita (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nomeReceita TEXT NOT NULL,
            tipoReceita TEXT NOT NULL,
            valor REAL NOT NULL,
            dataRegistro TEXT DEFAULT CURRENT_TIMESTAMP
          );
        `);
      } catch (err) {
        console.error("Database initialization error:", err);
        setError("Erro ao inicializar banco de dados");
      }
    }

    initializeDatabase();
  }, []);

  const submit = async () => {
    if (!db) {
      setError("Banco de dados não inicializado");
      return;
    }

    if (!formData.nomeReceita || !formData.tipoReceita || !formData.valor) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const valor = parseFloat(formData.valor) || 0;

      const result = await db.runAsync(
        `INSERT INTO receita (nomeReceita, tipoReceita, valor) VALUES (?, ?, ?)`,
        [formData.nomeReceita, formData.tipoReceita, valor]
      );

      const insertedReceita = await db.getFirstAsync(
        "SELECT * FROM receita WHERE id = ?",
        result.lastInsertRowId
      );

      if (insertedReceita) {
        setMessage("Receita registrada com sucesso!");
        setFormData({
          nomeReceita: "",
          tipoReceita: "",
          valor: "",
        });
      } else {
        setError("Erro ao verificar registro da receita");
      }
    } catch (err) {
      console.error("Error saving income:", err);
      setError("Erro ao salvar os dados");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const renderInput = (placeholder, field, keyboardType = "default") => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.header}>Nova Receita</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {message ? <Text style={styles.successText}>{message}</Text> : null}

      {renderInput("Nome da Receita", "nomeReceita")}
      {renderInput("Tipo de Receita", "tipoReceita")}
      {renderInput("Valor", "valor", "numeric")}

      <TouchableOpacity
        style={loading ? styles.buttonDisabled : styles.button}
        onPress={submit}
        disabled={loading}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {loading ? "Registrando..." : "Registrar Receita"}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
  },
  inputContainer: {
    flex: 1,
    minHeight: 56,
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f8f8",
    minHeight: 40,
    width: "100%",
  },
  errorText: {
    color: "#f87171",
    marginBottom: 8,
  },
  successText: {
    color: "#34d399",
    marginBottom: 8,
  },
  button: {
    width: "100%",
    backgroundColor: "#10b981",
    justifyContent: "center",
    minHeight: 40,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    width: "100%",
    backgroundColor: "#6ee7b7",
    justifyContent: "center",
    minHeight: 40,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContent: {
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  spacer: {
    height: 40,
    width: "100%",
  },
});

export default NovaReceita;

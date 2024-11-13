import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

const NovaDespesa = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [db, setDb] = useState(null);
  const [formData, setFormData] = useState({
    nomeDespesa: "",
    tipoDespesa: "",
    valor: "",
  });

  useEffect(() => {
    async function initializeDatabase() {
      try {
        const database = await SQLite.openDatabaseAsync("financas.db");
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS despesa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nomeDespesa TEXT NOT NULL,
            tipoDespesa TEXT NOT NULL,
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

    if (!formData.nomeDespesa || !formData.tipoDespesa || !formData.valor) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const valor = parseFloat(formData.valor) || 0;

      const result = await db.runAsync(
        `INSERT INTO despesa (nomeDespesa, tipoDespesa, valor) VALUES (?, ?, ?)`,
        [formData.nomeDespesa, formData.tipoDespesa, valor]
      );

      const insertedDespesa = await db.getFirstAsync(
        "SELECT * FROM despesa WHERE id = ?",
        result.lastInsertRowId
      );

      if (insertedDespesa) {
        setMessage("Despesa registrada com sucesso!");
        setFormData({
          nomeDespesa: "",
          tipoDespesa: "",
          valor: "",
        });
      } else {
        setError("Erro ao verificar registro da despesa");
      }
    } catch (err) {
      console.error("Error saving expense:", err);
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
        <Text style={styles.title}>Nova Despesa</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {message ? <Text style={styles.successText}>{message}</Text> : null}

      {renderInput("Nome da Despesa", "nomeDespesa")}
      {renderInput("Tipo de Despesa", "tipoDespesa")}
      {renderInput("Valor", "valor", "numeric")}

      <TouchableOpacity onPress={submit} disabled={loading}>
        <View
          style={[
            styles.button,
            loading ? styles.buttonDisabled : styles.buttonEnabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registrando..." : "Registrar Despesa"}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.spacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 56,
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    minHeight: 40,
    width: "100%",
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 8,
  },
  successText: {
    color: "#10b981",
    marginBottom: 8,
  },
  button: {
    width: "100%",
    minHeight: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonEnabled: {
    backgroundColor: "#ef4444",
  },
  buttonDisabled: {
    backgroundColor: "#fecaca",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  spacing: {
    height: 40,
    width: "100%",
  },
});

export default NovaDespesa;

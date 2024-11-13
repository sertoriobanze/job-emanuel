import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { React, useState, useEffect, useCallback } from "react";
import * as SQLite from "expo-sqlite";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const TelaPrincipal = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [resumo, setResumo] = useState({
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
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

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS despesa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nomeDespesa TEXT NOT NULL,
            tipoDespesa TEXT NOT NULL,
            valor REAL NOT NULL,
            dataRegistro TEXT DEFAULT CURRENT_TIMESTAMP
          );
        `);

        await carregarDados(database);
      } catch (err) {
        console.error("Database initialization error:", err);
        setError("Erro ao inicializar banco de dados");
      } finally {
        setLoading(false);
      }
    }

    initializeDatabase();
  }, []);

  const carregarDados = async (database) => {
    try {
      const receitas = await database.getFirstAsync(
        "SELECT COALESCE(SUM(valor), 0) as total FROM receita"
      );

      const despesas = await database.getFirstAsync(
        "SELECT COALESCE(SUM(valor), 0) as total FROM despesa"
      );

      const totalReceitas = receitas?.total || 0;
      const totalDespesas = despesas?.total || 0;
      const saldo = totalReceitas - totalDespesas;

      setResumo({
        totalReceitas,
        totalDespesas,
        saldo,
      });
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Erro ao carregar dados");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (db) {
      await carregarDados(db);
    }
    setRefreshing(false);
  }, [db]);

  const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "MZN",
    });
  };

  const ResumoCard = ({ titulo, valor, icone, cor, corFundo }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: corFundo,
          padding: 16,
          marginBottom: 16,
          borderRadius: 12,
        },
      ]}
    >
      <View style={styles.cardRow}>
        <View>
          <Text style={styles.cardTitle}>{titulo}</Text>
          <Text style={[styles.cardValue, { color: cor }]}>
            {formatarMoeda(valor)}
          </Text>
        </View>
        <MaterialCommunityIcons name={icone} size={40} color={cor} />
      </View>
    </View>
  );

  const NovaOperacaoButton = ({ titulo, icone, cor, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.operationButton, { backgroundColor: cor }]}
    >
      <View style={styles.operationButtonContent}>
        <MaterialCommunityIcons name={icone} size={24} color="#FFFFFF" />
        <Text style={styles.operationButtonText}>{titulo}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Resumo Financeiro</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <ResumoCard
          titulo="Saldo Total"
          valor={resumo.saldo}
          icone="wallet"
          cor={resumo.saldo >= 0 ? "#3B82F6" : "#EF4444"}
          corFundo={resumo.saldo >= 0 ? "#EFF6FF" : "#FEE2E2"}
        />

        <ResumoCard
          titulo="Total Receitas"
          valor={resumo.totalReceitas}
          icone="trending-up"
          cor="#10B981"
          corFundo="#ECFDF5"
        />

        <ResumoCard
          titulo="Total Despesas"
          valor={resumo.totalDespesas}
          icone="trending-down"
          cor="#EF4444"
          corFundo="#FEE2E2"
        />

        <View style={styles.buttonRow}>
          <NovaOperacaoButton
            titulo="Listar Receita"
            icone="plus-circle"
            cor="#10B981"
            onPress={() => navigation.navigate("ListarReceitas")}
          />

          <NovaOperacaoButton
            titulo="Listar Despesa"
            icone="minus-circle"
            cor="#EF4444"
            onPress={() => navigation.navigate("ListarDespesas")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  container: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  errorText: {
    color: "#FF5A5A",
    marginBottom: 16,
  },
  card: {
    elevation: 3,
    backgroundColor: "white",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#666666",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  operationButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 8,
    elevation: 2,
  },
  operationButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  operationButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 16,
  },
});

export default TelaPrincipal;

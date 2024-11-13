import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { React, useState, useEffect, useCallback } from "react";
import * as SQLite from "expo-sqlite";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const ListarReceitas = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receitas, setReceitas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [db, setDb] = useState(null);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        const database = await SQLite.openDatabaseAsync("financas.db");
        setDb(database);
        await carregarReceitas(database);
      } catch (err) {
        console.error("Database initialization error:", err);
        setError("Erro ao inicializar banco de dados");
      } finally {
        setLoading(false);
      }
    }

    initializeDatabase();
  }, []);

  const carregarReceitas = async (database) => {
    try {
      const result = await database.getAllAsync(
        "SELECT * FROM receita ORDER BY dataRegistro DESC"
      );
      setReceitas(result);
    } catch (err) {
      console.error("Error loading incomes:", err);
      setError("Erro ao carregar receitas");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (db) {
      await carregarReceitas(db);
    }
    setRefreshing(false);
  }, [db]);

  const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "MZN",
    });
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const renderReceita = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nomeReceita}</Text>
        <Text style={styles.cardDate}>{formatarData(item.dataRegistro)}</Text>
      </View>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardType}>{item.tipoReceita}</Text>
          <Text style={[styles.cardValue, { color: "#10B981" }]}>
            {formatarMoeda(item.valor)}
          </Text>
        </View>
        <MaterialCommunityIcons name="cash-plus" size={24} color="#10B981" />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Receitas</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: "#10B981" }]}
          onPress={() => navigation.navigate("NovaReceita")}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={receitas}
        renderItem={renderReceita}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    color: "#FF5A5A",
    margin: 16,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDate: {
    color: "#666666",
    fontSize: 12,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardType: {
    color: "#666666",
    fontSize: 14,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListarReceitas;

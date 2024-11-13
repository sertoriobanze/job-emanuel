import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const CadastroReceita = () => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");

  const handleSalvar = () => {
    // Aqui você pode implementar a lógica para salvar os dados
    console.log({ nome, tipo, valor });
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 pt-4">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Cadastro de Receita
        </Text>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Nome da Receita</Text>
          <TextInput
            className="w-full bg-white border border-gray-300 rounded-lg p-3"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome da receita"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Tipo de Receita</Text>
          <TextInput
            className="w-full bg-white border border-gray-300 rounded-lg p-3"
            value={tipo}
            onChangeText={setTipo}
            placeholder="Ex: Salário, Freelance, Investimentos"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base mb-2">Valor da Receita</Text>
          <TextInput
            className="w-full bg-white border border-gray-300 rounded-lg p-3"
            value={valor}
            onChangeText={setValor}
            placeholder="R$ 0,00"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          onPress={handleSalvar}
          className="bg-green-500 rounded-lg p-4"
        >
          <Text className="text-white text-center font-bold text-lg">
            Salvar Receita
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CadastroReceita;

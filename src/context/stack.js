import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TelaPrincipal from "../pages/TelaPrincipal"; // Sua tela principal
import NovaReceita from "../pages/NovaReceita"; // Sua tela de nova receita
import NovaDespesa from "../pages/NovaDespesa"; // Sua tela de nova despesa
import ListarDespesas from "../pages/ListarDespesas"; // Sua tela de nova despesa
import ListarReceitas from "../pages/ListarReceitas"; // Sua tela de nova despesa

// Criação do stack navigator
const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator initialRouteName="TelaPrincipal">
      <Stack.Screen
        name="TelaPrincipal"
        component={TelaPrincipal}
        options={{ title: "Resumo Financeiro" }}
      />
      <Stack.Screen
        name="NovaReceita"
        component={NovaReceita}
        options={{ title: "Adicionar Receita" }}
      />
      <Stack.Screen
        name="NovaDespesa"
        component={NovaDespesa}
        options={{ title: "Adicionar Despesa" }}
      />

      <Stack.Screen
        name="ListarDespesas"
        component={ListarDespesas}
        options={{ title: "Lista De Despesas" }}
      />
      <Stack.Screen
        name="ListarReceitas"
        component={ListarReceitas}
        options={{ title: "Lista De Receitas" }}
      />
    </Stack.Navigator>
  );
};

export default MyStack;

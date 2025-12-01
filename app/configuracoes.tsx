//A tela de configurações, onde o usuario pode mudar o tema do appkkkk

/*
Sinceramente eu não sabia muito bem o que colocar nessa tela, então por enquanto só tem a opção de mudar o tema do app (claro/escuro).
Não consegui achar um uso para os Switches e Sliders em nenhuma area do app.. porem pelomenos o picker de tema faz sentido aqui.

Assim como comentado no arquivo cores-tema.ts Inicialmente era pra ter um tema de "Dispositivo" mas não tava funcionando.. então só ficou claro e escuro..

*/
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useTema } from './contexto-tema';
import { temaClaro, temaEscuro } from './cores-tema';
import { styles } from './styles';

type TemaType = 'claro' | 'escuro';

export default function Configuracoes() {
  const router = useRouter();
  const { tema, definirTema, temaPrincipal } = useTema();
  const corAtiva = temaPrincipal === 'escuro' ? temaEscuro : temaClaro;

  const carregarTema = async () => {
  };

  const salvarTema = async (novoTema: TemaType) => {
    definirTema(novoTema);
  };

  const opcoesTema: { label: string; value: TemaType }[] = [
    { label: 'Claro', value: 'claro' },
    { label: 'Escuro', value: 'escuro' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: corAtiva.fundo }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: corAtiva.primary, fontWeight: '600' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: corAtiva.texto }]}>Configurações</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.containerPadding} keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.label, { color: corAtiva.textSecundario }]}>Tema</Text>
          <View style={{ marginTop: 12, borderWidth: 1, borderColor: corAtiva.border, borderRadius: 8, backgroundColor: corAtiva.fundo, overflow: 'hidden' }}>
            <Picker
              selectedValue={tema}
              onValueChange={(itemValue: any) => salvarTema(itemValue as TemaType)}
              style={{ height: 50, color: corAtiva.texto }}
            >
              <Picker.Item label="Claro" value="claro" />
              <Picker.Item label="Escuro" value="escuro" />
            </Picker>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

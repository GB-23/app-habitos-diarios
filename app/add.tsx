//A tela de adicionar habito, que originalmente foi feita pra tambem editar o habito mas ai eu li que era pra editar em um modal.
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from './contexto-tema';
import { temaClaro, temaEscuro } from './cores-tema';
import { styles } from './styles';


//Variaveis em portugues 🤢.. 
export default function AddHabit() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { temaPrincipal } = useTema();
  const corAtiva = temaPrincipal === 'escuro' ? temaEscuro : temaClaro;
  const [nome, definirNome] = useState('');
  const [descricao, definirDescricao] = useState('');
  const [editandoId, definirEditandoId] = useState<string | null>(null);
  const [itens, definirItens] = useState<Array<{ id: string; texto: string; feito?: boolean }>>([]);
  const [textoNovoItem, definirTextoNovoItem] = useState('');
  const [erroNome, definirErroNome] = useState('');

  useEffect(() => {
    if (params && (params as any).id) {
      carregarParaEdicao((params as any).id as string);
    }
  }, [params]);

  const carregarParaEdicao = async (id: string) => {
    try {
      const texto = await AsyncStorage.getItem('habitos');
      if (!texto) return;
      const lista = JSON.parse(texto) as any[];
      const h = lista.find(x => x.id === id);
      if (h) {
        definirEditandoId(h.id);
        definirNome(h.nome || '');
        definirDescricao(h.descricao || '');
        definirItens(h.itens && Array.isArray(h.itens) ? h.itens : []);
      }
    } catch (e) {
    }
  };

  const aoCancelar = () => {
    router.back();
  };

  const aoSalvar = async () => {
    if (!nome || !nome.trim()) {
      definirErroNome('Erm... O nome do hábito é obrigatório ☝️🤓');
      return;
    }
    try {
      const texto = await AsyncStorage.getItem('habitos');
      const lista = texto ? JSON.parse(texto) as any[] : [];
      if (editandoId) {
        const nova = lista.map(h => h.id === editandoId ? { ...h, nome, descricao, itens } : h);
        await AsyncStorage.setItem('habitos', JSON.stringify(nova));
      } else {
        const novo = { id: Date.now().toString(), nome, descricao, itens, criadoEm: Date.now(), concluidoHoje: false };
        lista.unshift(novo);
        await AsyncStorage.setItem('habitos', JSON.stringify(lista));
      }
      router.back();
    } catch (e) {
    }
  };

  const adicionarItemChecklist = () => {
    if (!textoNovoItem.trim()) return;
    const novo = { id: Date.now().toString(), texto: textoNovoItem.trim(), feito: false };
    definirItens(prev => [novo, ...prev]);
    definirTextoNovoItem('');
  };

  const alternarItem = (id: string) => {
    definirItens(prev => prev.map(it => it.id === id ? { ...it, feito: !it.feito } : it));
  };

  const removerItem = (id: string) => {
    definirItens(prev => prev.filter(it => it.id !== id));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.flex, { backgroundColor: corAtiva.fundo }]}>
      <ScrollView contentContainerStyle={[styles.containerPadding, { backgroundColor: corAtiva.fundo }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.header, { color: corAtiva.texto }]}>{editandoId ? 'Editar hábito' : 'Adicionar hábito'}</Text>

        <Text style={[styles.label, { color: corAtiva.textSecundario }]}>Nome</Text>
        <TextInput value={nome} onChangeText={text => { definirNome(text); if (erroNome) definirErroNome(''); }} placeholder="Beber água" style={[styles.input, { color: corAtiva.texto, backgroundColor: corAtiva.background, borderColor: corAtiva.border }, erroNome ? styles.inputErro : null]} placeholderTextColor={corAtiva.textSecundario} accessibilityLabel="Nome do habito" />
        {erroNome ? <Text style={[styles.errorText, { color: corAtiva.danger }]}>{erroNome}</Text> : null}

        <Text style={[styles.label, { color: corAtiva.textSecundario }]}>Notas</Text>
        <TextInput value={descricao} onChangeText={definirDescricao} placeholder="Descrição opcional" style={[styles.input, styles.textArea, { color: corAtiva.texto, backgroundColor: corAtiva.background, borderColor: corAtiva.border }]} placeholderTextColor={corAtiva.textSecundario} multiline numberOfLines={4} accessibilityLabel="Descrição opcional do habito" />

        <Text style={[styles.label, { color: corAtiva.textSecundario }]}>Tarefas</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TextInput 
            value={textoNovoItem} 
            onChangeText={definirTextoNovoItem} 
            placeholder="Novo item" 
            placeholderTextColor={corAtiva.textSecundario}
            style={[styles.input, { flex: 1, marginRight: 8, color: corAtiva.texto, backgroundColor: corAtiva.background, borderColor: corAtiva.border }]} 
          />
          <TouchableOpacity onPress={adicionarItemChecklist} style={[styles.saveButton, { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: corAtiva.primary }]}>
            <Text style={styles.saveText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        {itens.map(it => (
          <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Text style={[{ flex: 1, color: corAtiva.texto }]}>{it.texto}</Text>
            <TouchableOpacity onPress={() => removerItem(it.id)} style={{ marginLeft: 8, marginRight: 8 }}>
              <Text style={{ color: corAtiva.danger }}>Remover</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alternarItem(it.id)} style={[styles.checkbox, { width: 28, height: 28, borderRadius: 6, backgroundColor: it.feito ? corAtiva.primary : 'transparent', borderColor: corAtiva.primary }]}>
              <Text style={{ color: it.feito ? '#fff' : corAtiva.primary, fontSize: 14 }}>{it.feito ? '✓' : ''}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.cancelButton, { backgroundColor: corAtiva.border }]} onPress={aoCancelar} accessibilityLabel="Cancelar">
            <Text style={[styles.cancelText, { color: corAtiva.texto }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: corAtiva.primary }]} onPress={aoSalvar} accessibilityLabel="Salvar habito">
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

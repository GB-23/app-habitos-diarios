//O modal de edição. 😈
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { useTema } from './contexto-tema';
import { temaClaro, temaEscuro } from './cores-tema';
import { styles } from './styles';


/*
Essa parte do codigo é o modal de edição do habito, é quase a mesma coisa que a tela de adicionar habito (add.tsx) porem em modal.

Nota: Imagina escrever "aoAdicionarItem", "aoMudarNome" que feio kkkk, não gosto de variavel em portugues! onNomeChange é melhor.. eu mantenho a base em ingles mas deixo entendivel em portugues.
*/
interface ModalEditarProps {
  visivel: boolean;
  nomeEdit: string;
  descricaoEdit: string;
  itensEdit: Array<{ id: string; texto: string; feito?: boolean }>;
  textoNovoItem: string;
  onNomeChange: (text: string) => void;
  onDescricaoChange: (text: string) => void;
  onTextoNovoItemChange: (text: string) => void;
  onAdicionarItem: () => void;
  onAlternarItem: (id: string) => void;
  onRemoverItem: (id: string) => void;
  onSalvar: () => void;
  onFechar: () => void;
  onDeletar: () => void;
}

export default function ModalEditar({
  visivel,
  nomeEdit,
  descricaoEdit,
  itensEdit,
  textoNovoItem,
  onNomeChange,
  onDescricaoChange,
  onTextoNovoItemChange,
  onAdicionarItem,
  onAlternarItem,
  onRemoverItem,
  onSalvar,
  onFechar,
  onDeletar,
}: ModalEditarProps) {
  const { temaPrincipal } = useTema();
  const corAtiva = temaPrincipal === 'escuro' ? temaEscuro : temaClaro;
  return (
    <Modal visible={visivel} animationType="slide" transparent={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.modalFlex, { backgroundColor: corAtiva.fundo }]}>
        <ScrollView contentContainerStyle={[styles.containerPadding, { backgroundColor: corAtiva.fundo }]} keyboardShouldPersistTaps="handled">
          <Text style={[styles.header, { color: corAtiva.texto }]}>Editar hábito</Text>
            
          <Text style={[styles.label, { color: corAtiva.textSecundario }]}>Nome</Text>
          <TextInput 
            value={nomeEdit} 
            onChangeText={onNomeChange}
            placeholder="Nome do hábito" 
            placeholderTextColor={corAtiva.textSecundario}
            style={[styles.input, { color: corAtiva.texto, backgroundColor: corAtiva.background, borderColor: corAtiva.border }]} 
          />

          <Text style={[styles.label, { color: corAtiva.textSecundario }]}>Notas</Text>
          <TextInput 
            value={descricaoEdit} 
            onChangeText={onDescricaoChange} 
            placeholder="Descrição opcional" 
            placeholderTextColor={corAtiva.textSecundario}
            style={[styles.input, styles.textArea, { color: corAtiva.texto, backgroundColor: corAtiva.background, borderColor: corAtiva.border }]} 
            multiline 
            numberOfLines={4} 
          />

          <Text style={[styles.label, { color: corAtiva.textSecundario }]}>Itens da checklist</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TextInput 
              value={textoNovoItem} 
              onChangeText={onTextoNovoItemChange} 
              placeholder="Novo item" 
              placeholderTextColor={corAtiva.textSecundario}
              style={[styles.input, { flex: 1, marginRight: 8, color: corAtiva.texto, backgroundColor: corAtiva.background, borderColor: corAtiva.border }]} 
            />
            <TouchableOpacity onPress={onAdicionarItem} style={[styles.saveButton, { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: corAtiva.primary }]}>
              <Text style={styles.saveText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          {itensEdit.map(it => (
            <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ flex: 1, color: corAtiva.texto }}>{it.texto}</Text>
              <TouchableOpacity onPress={() => onRemoverItem(it.id)} style={{ marginLeft: 8, marginRight: 8 }}>
                <Text style={{ color: corAtiva.danger }}>Remover</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onAlternarItem(it.id)} style={[styles.checkbox, { width: 28, height: 28, borderRadius: 6, backgroundColor: it.feito ? corAtiva.primary : 'transparent', borderColor: corAtiva.primary }]}>
                <Text style={{ color: it.feito ? '#fff' : corAtiva.primary, fontSize: 14 }}>{it.feito ? '✓' : ''}</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.deleteButton, { backgroundColor: corAtiva.danger }]} onPress={onDeletar}>
              <Text style={styles.deleteText}>Deletar</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: corAtiva.border }]} onPress={onFechar}>
              <Text style={[styles.cancelText, { color: corAtiva.texto }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: corAtiva.primary }]} onPress={onSalvar}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

//Pagina innicial do projeto, aqui é onde aparecem os habitos tambem da pra editar

/*
- Eu pessoalmente não gosto de escrever codigos em portugues, pois não estou acostumado mas assim fica melhor para entender.

Tambem não sou muito fã de deixar comentarios no codigo, mas vou deixar alguns para facilitar o entendimento.


Inicialmente esse arquivo era BEM maior mas agora tá tudo bem dividido.
*/
//IMPORTS
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalEditar from './modal';
import ModalConfirmacao from './modal-confirmacao';
import { useTema } from './contexto-tema';
import { temaClaro, temaEscuro } from './cores-tema';
import { styles } from './styles';


//EXPORT
export default function Index() {
  const router = useRouter();
  const { temaPrincipal } = useTema();
  const corAtiva = temaPrincipal === 'escuro' ? temaEscuro : temaClaro; //sim nos temos temas tambem
  const [habitos, setHabitos] = useState<any[]>([]);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [descricaoEdit, setDescricaoEdit] = useState('');
  const [itensEdit, setItensEdit] = useState<Array<{ id: string; texto: string; feito?: boolean }>>([]);
  const [textoNovoItem, setTextoNovoItem] = useState('');
  const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);
  const [confirmacaoTipo, setConfirmacaoTipo] = useState<'deletar' | 'salvar' | 'removerItem'>('deletar');
  const [itemParaRemover, setItemParaRemover] = useState<string | null>(null);

  const totalConcluidosHoje = habitos.filter(h => h.concluidoHoje).length;

  //pra quando você entrar na pagina os habitos carregarem pela primeira vez
  useEffect(() => {
    carregarHabitos();
  }, []);

  //toda vez que voce VOLTAR para pagina os habitos recarregam
  useFocusEffect(
    React.useCallback(() => {
      carregarHabitos();
    }, [])
  );

  //carrega os habitos do async storage
  const carregarHabitos = async () => {
    try {
      const texto = await AsyncStorage.getItem('habitos');
      if (texto) {
        const lista = JSON.parse(texto);
        setHabitos(lista);
      }
    } catch (e) {
    }
  };

  //salva os habitos no async storage
  const salvarHabitos = async (lista: any[]) => {
    try {
      await AsyncStorage.setItem('habitos', JSON.stringify(lista));
      setHabitos(lista);
    } catch (e) {
    }
  };

  const aoPressionarAdicionar = () => {
    router.push('/add' as any);
  };

  //quando você pressiona para editar um habito na lista ele encontra o habito (habitos.find) pelo id e abre o modal colocando as informações la
  const aoPressionarEditar = (id: string) => {
    const h = habitos.find(x => x.id === id);
    if (h) {
      setEditandoId(id);
      setNomeEdit(h.nome || '');
      setDescricaoEdit(h.descricao || '');
      setItensEdit(h.itens && Array.isArray(h.itens) ? h.itens : []);
      setModalVisivel(true);
    }
  };

  const aoFecharModal = () => {
    setModalVisivel(false);
    setEditandoId(null);
    setNomeEdit('');
    setDescricaoEdit('');
    setItensEdit([]);
    setTextoNovoItem('');
  };

  const aoSalvarEdicao = async () => {
    if (!nomeEdit || !nomeEdit.trim()) return;
    setConfirmacaoTipo('salvar');
    setConfirmacaoVisivel(true);
  };

  const confirmarSalvar = async () => {
    setConfirmacaoVisivel(false); 
    const nova = habitos.map(h => h.id === editandoId ? { ...h, nome: nomeEdit, descricao: descricaoEdit, itens: itensEdit } : h); //adoramos o SPREAD do js!!!!
    await salvarHabitos(nova);
    aoFecharModal();
  };

  const adicionarItemModal = () => {
    if (!textoNovoItem.trim()) return;
    const novo = { id: Date.now().toString(), texto: textoNovoItem.trim(), feito: false };
    setItensEdit(prev => [novo, ...prev]);
    setTextoNovoItem('');
  };

  const alternarItemModal = (id: string) => {
    setItensEdit(prev => prev.map(it => it.id === id ? { ...it, feito: !it.feito } : it));
  };

  const removerItemModal = (id: string) => {
    setItemParaRemover(id);
    setConfirmacaoTipo('removerItem');
    setConfirmacaoVisivel(true);
  };

  const confirmarRemoverItem = () => {
    setConfirmacaoVisivel(false);
    if (itemParaRemover) {
      setItensEdit(prev => prev.filter(it => it.id !== itemParaRemover));
      setItemParaRemover(null);
    }
  };

  const aoExpandir = (id: string, temItens: boolean) => {
    if (!temItens) return;
    setExpandido(expandido === id ? null : id);
  };

  const alternarItemChecklist = (idHabito: string, idItem: string) => {
    const nova = habitos.map(h => {
      if (h.id === idHabito && h.itens) {
        const itensAtualizados = h.itens.map((it: any) => it.id === idItem ? { ...it, feito: !it.feito } : it);
        const todosFeitos = itensAtualizados.every((it: any) => it.feito);
        return {
          ...h,
          itens: itensAtualizados,
          concluidoHoje: todosFeitos
        };
      }
      return h;
    });
    salvarHabitos(nova);
  };

  const alternarConcluidoHoje = (id: string) => {
    const nova = habitos.map(h => {
      if (h.id === id) {
        const novoEstado = !h.concluidoHoje;
        const itensAtualizados = h.itens && h.itens.length > 0 
          ? h.itens.map((it: any) => ({ ...it, feito: novoEstado }))
          : h.itens;
        return { ...h, concluidoHoje: novoEstado, itens: itensAtualizados };
      }
      return h;
    });
    salvarHabitos(nova);
  };

  const aoDeletarHabito = async () => {
    setConfirmacaoTipo('deletar');
    setConfirmacaoVisivel(true);
  };

  const confirmarDeletarHabito = async () => {
    setConfirmacaoVisivel(false);
    if (!editandoId) return;
    const nova = habitos.filter(h => h.id !== editandoId);
    salvarHabitos(nova);
    aoFecharModal();
  };

  /* 
  não coloquei comentarios ali embaixo porque o VSCode fica marcando errado (mó agonia) mas basicamente é a pagina em si aqui
  se eu tivesse que dizer alguma coisa eu diria que basicamente a ideia é que ele mapeia os habitos e cria um TouchableOpacity pra cada um
  ai dentro desse TouchableOpacity tem o nome do habito, quantos itens ele tem e quantos foram feitos
  e um checkbox pra marcar se concluiu hoje ou não
  e se o habito estiver expandido ele mostra a checklist dos itens tambem (ele só mostra se tiver itens dentro do habito)
  se alguem estiver com duvida na funcionalidade do "? :" que aparece muito ali embaixo, é um operador ternario, basicamente é um if simplificado.
  INFELIZMENTE não arrumei onde colocar os sliders e switches que foram pedidos no projeto, mas o picker eu consegui, nas configurações pra selecionar o tema.
  */
  return (
    <View
      style={[styles.container, { backgroundColor: corAtiva.fundo }]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40 }}>
        <Text style={[styles.title, { color: corAtiva.texto }]}>Hábitos</Text>
        <TouchableOpacity onPress={() => router.push('/configuracoes')}>
          <Text style={{ fontSize: 24, color: corAtiva.primary }}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.stats, { color: corAtiva.textSecundario }]}>{`Concluídos hoje: ${totalConcluidosHoje} / ${habitos.length}`}</Text>

      <FlatList
        data={habitos}
        keyExtractor={item => item.id}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              style={[styles.item, { backgroundColor: corAtiva.background, borderColor: corAtiva.border }]}
              onPress={() => aoExpandir(item.id, item.itens && item.itens.length > 0)}
              onLongPress={() => aoPressionarEditar(item.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitulo, { color: corAtiva.texto }]}>{item.nome}</Text>
                <Text style={[styles.itemSub, { color: corAtiva.textSecundario }]}>{`${(item.itens||[]).length} itens • ${((item.itens||[]).filter((i:any)=>i.feito)).length} feitos`}</Text>
              </View>
              <TouchableOpacity onPress={() => alternarConcluidoHoje(item.id)} style={[styles.checkbox, { backgroundColor: item.concluidoHoje ? corAtiva.primary : 'transparent', borderColor: corAtiva.primary }]}> 
                <Text style={{ color: item.concluidoHoje ? '#fff' : corAtiva.primary }}>{item.concluidoHoje ? '✓' : ''}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            {expandido === item.id && item.itens && item.itens.length > 0 ? (
              <View style={[styles.checklistContainer, { backgroundColor: corAtiva.background }]}>
                {item.itens.map((it: any) => (
                  <View key={it.id} style={[styles.checklistItem, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.checklistText, { color: corAtiva.texto }]}>{it.texto}</Text>
                    <TouchableOpacity onPress={() => alternarItemChecklist(item.id, it.id)} style={[styles.checklistBtn, { backgroundColor: it.feito ? corAtiva.primary : 'transparent', borderColor: corAtiva.primary }]}> 
                      <Text style={{ color: it.feito ? '#fff' : corAtiva.primary, fontSize: 14 }}>{it.feito ? '✓' : ''}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        )}
      />


      <TouchableOpacity
        style={[styles.fab, { backgroundColor: corAtiva.primary }]}
        activeOpacity={0.85}
        onPress={aoPressionarAdicionar}
        accessibilityLabel="Adicionar novo habito"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <ModalEditar
        visivel={modalVisivel}
        nomeEdit={nomeEdit}
        descricaoEdit={descricaoEdit}
        itensEdit={itensEdit}
        textoNovoItem={textoNovoItem}
        onNomeChange={setNomeEdit}
        onDescricaoChange={setDescricaoEdit}
        onTextoNovoItemChange={setTextoNovoItem}
        onAdicionarItem={adicionarItemModal}
        onAlternarItem={alternarItemModal}
        onRemoverItem={removerItemModal}
        onSalvar={aoSalvarEdicao}
        onFechar={aoFecharModal}
        onDeletar={aoDeletarHabito}
      />

      <ModalConfirmacao // modal de confirmação multi-uso (vem do componente modal-confirmacao.tsx)
        visivel={confirmacaoVisivel}
        titulo={
          confirmacaoTipo === 'deletar'
            ? 'Deletar hábito?'
            : confirmacaoTipo === 'salvar'
            ? 'Salvar alterações?'
            : 'Remover tarefa?'
        }
        mensagem={
          confirmacaoTipo === 'deletar'
            ? 'Tem certeza que deseja deletar este hábito? Esta ação não pode ser desfeita.'
            : confirmacaoTipo === 'salvar'
            ? 'Tem certeza que deseja salvar as alterações deste hábito?'
            : 'Tem certeza que deseja remover esta tarefa?'
        }
        textoConfirmar={confirmacaoTipo === 'deletar' ? 'Deletar' : 'Confirmar'}
        onConfirmar={
          confirmacaoTipo === 'deletar'
            ? confirmarDeletarHabito
            : confirmacaoTipo === 'salvar'
            ? confirmarSalvar
            : confirmarRemoverItem
        }
        onCancelar={() => setConfirmacaoVisivel(false)}
        isDanger={confirmacaoTipo === 'deletar'} //perigoso 😨
      />
    </View>
    
  );
}
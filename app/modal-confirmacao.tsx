import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTema } from './contexto-tema';
import { temaClaro, temaEscuro } from './cores-tema';
import { styles } from './styles';

interface ModalConfirmacaoProps {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  isDanger?: boolean;
}

export default function ModalConfirmacao({
  visivel,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
  isDanger = false,
}: ModalConfirmacaoProps) {
  const { temaPrincipal } = useTema();
  const corAtiva = temaPrincipal === 'escuro' ? temaEscuro : temaClaro;
  return (
    <Modal visible={visivel} animationType="fade" transparent={true}>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalConfirmacao, { backgroundColor: corAtiva.fundo }]}>
          <Text style={[styles.modalTitulo, { color: corAtiva.texto }]}>{titulo}</Text>
          <Text style={[styles.modalMensagem, { color: corAtiva.textSecundario }]}>{mensagem}</Text>

          <View style={styles.modalBotoes}>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: corAtiva.border }]} onPress={onCancelar}>
              <Text style={[styles.cancelText, { color: corAtiva.texto }]}>{textoCancelar}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, isDanger && { backgroundColor: corAtiva.danger }]} 
              onPress={onConfirmar}
            >
              <Text style={styles.saveText}>{textoConfirmar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TemaType = 'claro' | 'escuro';

interface TemaContextType {
  tema: TemaType;
  temaPrincipal: 'claro' | 'escuro';
  definirTema: (tema: TemaType) => void;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<TemaType>('claro');
  const [temaPrincipal, setTemaPrincipal] = useState<'claro' | 'escuro'>('claro');
  const colorScheme = useColorScheme();

  useEffect(() => {
    carregarTema();
  }, []);

  useEffect(() => {
    setTemaPrincipal(tema);
  }, [tema]);

  const carregarTema = async () => {
    try {
      const temaSalvo = await AsyncStorage.getItem('tema');
      if (temaSalvo) {
        setTema(temaSalvo as TemaType);
      }
    } catch (e) {
    }
  };

  const definirTema = async (novoTema: TemaType) => {
    try {
      setTema(novoTema);
      await AsyncStorage.setItem('tema', novoTema);
    } catch (e) {
    }
  };

  return (
    <TemaContext.Provider value={{ tema, temaPrincipal, definirTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);
  if (context === undefined) {
    throw new Error('useTema deve ser usado dentro de TemaProvider');
  }
  return context;
}

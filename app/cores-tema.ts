// aqui ficam as cores do tema claro e escuro, eu tentei implementar um "tema" chamado "dispositivo" que pegaria o tema do proprio celular mas n estava funcionando então ficou só esses dois
export const temaClaro = {
  fundo: '#fff',
  texto: '#2d3436',
  textSecundario: '#636e72',
  border: '#dfe6e9',
  primary: '#6C5CE7',
  danger: '#ff6b6b',
  background: '#f9f9f9',
};

export const temaEscuro = {
  fundo: '#1a1a1a',
  texto: '#e0e0e0',
  textSecundario: '#a8a8a8',
  border: '#333',
  primary: '#8b7ae8',
  danger: '#ff8787',
  background: '#242424',
};

export type Tema = typeof temaClaro;

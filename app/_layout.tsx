import { Stack } from "expo-router";
import { TemaProvider } from "./contexto-tema";

export default function RootLayout() {
  return (
    <TemaProvider>
      <Stack />
    </TemaProvider>
  );
}

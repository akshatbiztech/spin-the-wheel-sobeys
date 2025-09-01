import { StatusBar } from "expo-status-bar";
import { Layout } from "./src/layout";
import "./src/config/firebase"; // Initialize Firebaser

export default function App() {
  return (
    <>
      <Layout />
      <StatusBar style="auto" />
    </>
  );
}

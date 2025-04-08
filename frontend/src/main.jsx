// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ColorModeScript, ChakraProvider, theme } from "@chakra-ui/react";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode></StrictMode>,
  <Provider store={store}>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </Provider>
);

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // import tailwind styles
import reportWebVitals from "./reportWebVitals";
import { BoardContextProvider } from "./contexts";

console.log(process.env.REACT_APP_API_URL);
const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ApolloProvider client={client}>
    <BoardContextProvider>
      <App />
    </BoardContextProvider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

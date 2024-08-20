import StoreProvider from "@/store/store-context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </div>
  );
}


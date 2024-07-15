import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import celoGroups from "@celo/rainbowkit-celo/lists";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../Theme";
import logo from "../public/assets/logo-inline-transparent.png";
import WidgetContainer from "@/components/WidgetContainer";
import { UserCountryProvider } from "@/utils/UserCountryContext";
import { GoogleTagManager } from '@next/third-parties/google'
import Head from "next/head";
import Script from "next/script";


const projectId = process.env.NEXT_PUBLIC_WC_ID as string;

const { chains, publicClient } = configureChains(
  [Celo],
  [publicProvider()]
);

const connectors = [new InjectedConnector({ chains })];

// const connectors = celoGroups({ chains, projectId });

const appInfo = {
  appName: "Celo Composer",
};

const wagmiConfig = createConfig({
  connectors,
  publicClient: publicClient,
});


function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
    <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}></Script>
    <Script dangerouslySetInnerHTML={{__html:`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${process.env.NEXT_PUBLIC_GTM_ID}');`}}
  >
      
</Script>
    </Head>
    <UserCountryProvider>
    <ChakraProvider theme={theme}>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} coolMode={true}>
        <WidgetContainer>
          <Component {...pageProps} />
        </WidgetContainer>
      </RainbowKitProvider>
    </WagmiConfig>
  </ChakraProvider>
  </UserCountryProvider></>
    
    
  );
}

export default App;

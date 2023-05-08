import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="As a member of the Ethereum Foundation's Privacy & Scaling Explorations Group, Wallet Account eXperiments (WAX) delivers novel account features to enhance wallets, dApps, and SDKs."
          />
          <meta charSet="utf-8" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
            rel="stylesheet"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/Favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

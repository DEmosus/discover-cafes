import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preload" href="/fonts/Lato-Bold.ttf" as="font" crossOrigin="anonymous"></link>
          <link rel="preload" href="/fonts/Lato-Light.ttf" as="font" crossOrigin="anonymous"></link>
          <link rel="preload" href="/fonts/Lato-Regular.ttf" as="font" crossOrigin="anonymous"></link>
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;
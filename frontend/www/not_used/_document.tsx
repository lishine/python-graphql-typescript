import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    // static async getInitialProps(ctx) {
    // const initialProps = await Document.getInitialProps(ctx)
    // return { ...initialProps }
    // }

    render() {
        return (
            <Html>
                <Head>
                    {/* <meta name='description' content='Giftbox' /> */}
                    {/* <meta
                        charSet='utf-8'
                        name='viewport'
                        // content='width=1170'
                        content='width=device-width, initial-scale=1, shrink-to-fit=no'
                    /> */}
                    {/* <link
                        rel='stylesheet'
                        href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,500,500i,600,600i,700,700i&amp;subset=latin-ext'
                    />
                    <link rel='icon' type='image/x-icon' href='favicon.ico' /> */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument

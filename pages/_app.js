import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { SSRProvider } from 'react-bootstrap';

import Link from 'next/link'
import Head from 'next/head'
import { Router } from 'next/router'

import { ToastContainer } from 'react-toastify'

function MyApp ({ Component, pageProps }) {
  Router.events.on('routeChangeComplete', (url) => {
    try {
      window._hmt.push(['_trackPageview', url])
    } catch (e) {}
  })

  const getAnalyticsTag = () => {
    return {
      __html: `var _hmt = _hmt || [];`,
    }
  }

  return (
    <SSRProvider>
      <>
        <Head>
          {/* <script dangerouslySetInnerHTML={getAnalyticsTag()} /> */}
        </Head>
        <Component {...pageProps} />
        <ToastContainer
          theme="light"
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
        />
      </>
    </SSRProvider>
  )
}

export default MyApp

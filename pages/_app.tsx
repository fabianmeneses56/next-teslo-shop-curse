import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { lightTheme } from '../themes'
import { UiProvider, CartProvider, AuthProvider } from '../context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider
        options={{
          'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
        }}
      >
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init).then(res => res.json())
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />{' '}
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}

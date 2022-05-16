import {
  Center,
  ChakraProvider,
  ColorModeScript,
  Spinner,
} from '@chakra-ui/react';
import '@fontsource/roboto';
import loadable from '@loadable/component';
import TagManager from 'react-gtm-module'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import './i18n';
import * as serviceWorker from './serviceWorker';
import store, { persistor } from './store';
import theme from './theme';

const App = loadable(() => import('./App'));

TagManager.initialize({
  gtmId: 'GTM-KV2HNTW'
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <PersistGate
          loading={
            <Center>
              <Spinner />
            </Center>
          }
          persistor={persistor}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

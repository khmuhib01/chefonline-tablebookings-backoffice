// src/App.jsx

import {BrowserRouter} from 'react-router-dom';
import AppRoutes from './route';
import {HelmetProvider} from 'react-helmet-async';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store/store';
import AuthProviderRestaurant from './context/AuthContextRestaurant';
import {useEffect} from 'react';

const queryClient = new QueryClient();

function App() {
	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<BrowserRouter>
							<AuthProviderRestaurant>
								<AppRoutes />
							</AuthProviderRestaurant>
						</BrowserRouter>
					</PersistGate>
				</Provider>
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;

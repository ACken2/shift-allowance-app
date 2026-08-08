import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import './index.css';
import App from 'containers';
import darkTheme from './theme';

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

createRoot(rootElement).render(
	<React.StrictMode>
		<ThemeProvider theme={darkTheme}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<CssBaseline />
				<Router>
					<App />
				</Router>
			</LocalizationProvider>
		</ThemeProvider>
	</React.StrictMode>
);

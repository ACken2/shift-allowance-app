import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Home from './Home';
import darkTheme from '../../theme';

describe('Home', () => {
	it('renders without crashing', () => {
		render(
			<ThemeProvider theme={darkTheme}>
				<Home onGettingStarted={() => undefined} />
			</ThemeProvider>
		);
		expect(screen.getByText('Shift Duty Allowance Calculator')).toBeInTheDocument();
		expect(screen.getByText('Get Started')).toBeInTheDocument();
	});
});

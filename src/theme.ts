import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#90caf9',
		},
		secondary: {
			main: '#f48fb1',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				textPrimary: {
					color: '#FF9F71',
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					'&.Mui-focused': {
						color: '#FF9F71',
					},
				},
			},
		},
		MuiInput: {
			styleOverrides: {
				underline: {
					'&:after': {
						borderBottom: '2px solid #FF9F71',
					},
				},
			},
		},
	},
});

export default darkTheme;

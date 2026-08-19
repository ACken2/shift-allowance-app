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
        background: {
            default: '#282c34',
            paper: '#424242',
        },
        text: {
            primary: '#ffffff',
            secondary: '#bdbdbd',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            '"Fira Sans"',
            '"Droid Sans"',
            '"Helvetica Neue"',
            'sans-serif',
        ].join(','),
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '10px 16px',
                },
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

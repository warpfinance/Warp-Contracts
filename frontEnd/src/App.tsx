import * as React from "react";

import { createMuiTheme } from "@material-ui/core/styles";

// prettier-ignore
import {
	CssBaseline,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import {
	GlobalContextProviders,
} from "./pages/GlobalContextProviders";
import { AppRouter } from "./AppRouter";

const outerTheme = createMuiTheme({
	palette: {
		background: {
			default: "#292929",
		},
		secondary: {
			main: "#62d066",
			contrastText: "#fff",
		},
		error: {
			main: "#ff6666",
		},
		text: {
			primary: "#FFFFFF",
			secondary: "#a9a9a9",
		},
		type: "dark",
	},
	typography: {
		fontFamily: '"MuseoModerno"',
	},
	overrides: {
		MuiCard: {
			root: {
				borderRadius: "25px",
				boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25);",
				margin: "15px",
			},
		},
		MuiTypography: {
			root: {
				margin: "5px",
			},
		},
	},
	props: {
		MuiPaper: {
			elevation: 24,
		},
	},
});

function getLibrary(provider?: any, connector?: any): any {
	let ethersProvider = new ethers.providers.Web3Provider(provider);
	return ethersProvider;
}

const App: React.FC = () => {
	return (
		<ThemeProvider theme={outerTheme}>
			<CssBaseline>
				<Web3ReactProvider getLibrary={getLibrary}>
					<GlobalContextProviders>
						<AppRouter/>
					</GlobalContextProviders>
				</Web3ReactProvider>
			</CssBaseline>
		</ThemeProvider>
	);
};

export default App;

import * as React from "react";

import {
	Borrower,
	Connect,
	Dashboard,
	Home,
	Lender,
	Markets
} from "./pages";
import {
	Route,
	BrowserRouter as Router,
	Switch,
} from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";

import { Web3ReactProvider } from '@web3-react/core'

// prettier-ignore
import {
	CssBaseline,
} from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ConnectedWeb3 } from "./hooks/connectedWeb3";

const outerTheme = createMuiTheme({
	palette: {
		secondary: {
			main: '#62d066',
			contrastText: "#fff",
		},
		error: {
			main: '#ff6666',
		},
		text: {
			primary: "#FFFFFF",
			secondary: "#a9a9a9"
		},
		type: 'dark',
	},
	typography: {
		fontFamily: '"MuseoModerno"',
	},
	overrides: {
		MuiCard: {
			root: {
				borderRadius: "25px",
				boxShadow : "0 40px 80px -20px rgba(0, 0, 0, 0.25);",
				margin: "15px",
			}
		},
		MuiTypography: {
			root: {
				margin: "5px",
			}
		}
	},
	props: {
		MuiPaper: {
			elevation: 24,
		},
	},
});

const useStyles = makeStyles(theme => ({
	root: {
		fontWeight: 500,
		fontStretch: 'normal',
		fontStyle: 'normal',
		lineHeight: 'normal',
		letterSpacing: '0.5px',
		textAlign: 'left',
		marginTop: '50px',
		marginRight: '100px',
		marginLeft: '100px',
	},
}));

interface Props { }

function getLibrary(provider?: any, connector?: any): any {
	return provider;
}

const App: React.FC = () => {
	const classes = useStyles();

	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<ConnectedWeb3>
				<Router>
					<ThemeProvider theme={outerTheme}>
						<CssBaseline>
							<div className={classes.root}>
								<Switch>
									<Route exact={true} path="/" component={Home} />
									<Route exact={true} path="/borrower" component={Borrower} />
									<Route exact={true} path="/connect" component={Connect} />
									<Route exact={true} path="/dashboard" component={Dashboard} />
									<Route exact={true} path="/lender" component={Lender} />
									<Route exact={true} path="/markets" component={Markets} />
								</Switch>
							</div>
						</CssBaseline>
					</ThemeProvider>
				</Router>
			</ConnectedWeb3>
		</Web3ReactProvider>
	)
}

export default App;

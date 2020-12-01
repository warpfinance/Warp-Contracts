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
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

import { BorrowerCountdownContext } from "./hooks/borrowerCountdown";
import { ConnectedWeb3 } from "./hooks/connectedWeb3";
// prettier-ignore
import {
	CssBaseline,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { Web3AccountRequired } from "./pages/Web3AccountRequired";
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from "ethers";
import { useState } from "react";

const outerTheme = createMuiTheme({
	palette: {
		background: {
			default: "#292929"
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
			secondary: "#a9a9a9"
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
		fontStretch: "normal",
		fontStyle: "normal",
		lineHeight: "normal",
		letterSpacing: "0.5px",
		textAlign: "left",
		marginTop: "50px",
		marginRight: "100px",
		marginLeft: "100px",
	},
}));

interface Props { }

function getLibrary(provider?: any, connector?: any): any {
	let ethersProvider = new ethers.providers.Web3Provider(provider);
	return ethersProvider;
}

const App: React.FC = () => {
	const classes = useStyles();

	var maxDate = 8640000000000000;
	var countDownDate = new Date(process.env.REACT_APP_BORROWING_ENABLED_DATETIME || maxDate).getTime();

	const [countdown, setCountdown] = useState(true);
	const [countdownText, setCountdownText] = useState("");
	setInterval(function () {
		var now = new Date().getTime();
		var distance = countDownDate - now;
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		setCountdownText(days + "d " + hours + "h "
			+ minutes + "m " + seconds + "s ");
		if (distance < 0) {
			setCountdown(false);
		}
	}, 1000);

	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<Router>
				<ThemeProvider theme={outerTheme}>
					<BorrowerCountdownContext.Provider value={{ countdown: countdown, countdownText: countdownText }} >
						<CssBaseline>
							<div className={classes.root}>
								<Switch>
									<Route exact={true} path="/" component={Home} />
									<Route exact={true} path="/connect" component={Connect} />
									<Route exact={true} path="/borrower"
										render={() => <Web3AccountRequired><Borrower /></Web3AccountRequired>} />
									<Route exact={true} path="/dashboard"
										render={() => <Web3AccountRequired><Dashboard /></Web3AccountRequired>} />
									<Route exact={true} path="/lender"
										render={() => <Web3AccountRequired><Lender /></Web3AccountRequired>} />
									<Route exact={true} path="/markets"
										render={() => <ConnectedWeb3><Markets /></ConnectedWeb3>} />
								</Switch>
							</div>
						</CssBaseline>
					</BorrowerCountdownContext.Provider>
				</ThemeProvider>
			</Router>
		</Web3ReactProvider>
	)
}

export default App;
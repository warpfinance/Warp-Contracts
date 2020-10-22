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
import { ThemeProvider, WithStyles, createStyles, withStyles } from "@material-ui/styles";

// prettier-ignore
import {
	CssBaseline,
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { withRoot } from "./withRoot";

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

const styles = (theme: any) => createStyles({
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

});

interface Props extends WithStyles<typeof styles> { }

const DecoratedApplass = withStyles(styles)(
	class AppClass extends React.Component<Props, {}> {
		render() {
			return (
				<Router>
					<ThemeProvider theme={outerTheme}>
						<CssBaseline>
							<div className={this.props.classes.root}>
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
			);
		}
	}
)

export default withRoot(DecoratedApplass);

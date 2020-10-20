import * as React from "react";

import {
	Borrower,
	Connect,
	Dashboard,
	Lender,
	Markets
} from "./pages";
// prettier-ignore
import {
	CssBaseline,
	Typography,
	useMediaQuery
} from "@material-ui/core";
import {
	Link,
	Route,
	HashRouter as Router,
	Switch,
} from "react-router-dom";
import { Theme, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider, makeStyles } from "@material-ui/styles";

import { withRoot } from "./withRoot";

const outerTheme = createMuiTheme({
	palette: {
		primary: {
			main: "#black"
		},
		secondary: {
			main: "#soft-green"
		},
		text: {
			primary: "#FFFFFF"
		},
		type: 'dark',
	},
	typography: {
		fontFamily: '"MuseoModerno"',
	},
});

function App() {
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = React.useState(true);
	const isMobile = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm")
	);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<Router>
			<ThemeProvider theme={outerTheme}>
				<CssBaseline>
					<div className={classes.root}>
						<Switch>
							<Route exact={true} path="/" component={Connect} />
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

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => ({
	root: {
		fontWeight: 500,
		fontStretch: 'normal',
		fontStyle: 'normal',
		lineHeight: 'normal',
		letterSpacing: '0.5px',
		textAlign: 'left',
	},

}));

export default withRoot(App);

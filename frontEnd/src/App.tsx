import * as React from "react";

// prettier-ignore
import { AppBar, CssBaseline, Drawer as DrawerMui, Hidden, IconButton, Toolbar, Typography, useMediaQuery } from "@material-ui/core";
import { AppPage, DocsPage, HomePage, MarketsPage } from "./pages";
import { Route, HashRouter as Router } from "react-router-dom";
import { Theme, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider, makeStyles } from "@material-ui/styles";

import MenuIcon from "@material-ui/icons/Menu";
import { withRoot } from "./withRoot";

function Routes() {
	const classes = useStyles();

	return (
		<div className={classes.content}>
			<Route exact={true} path="/" component={HomePage} />
			<Route exact={true} path="/home" component={HomePage} />
			<Route exact={true} path="/docs" component={DocsPage} />
			<Route exact={true} path="/markets" component={MarketsPage} />
			<Route exact={true} path="/app" component={AppPage} />
		</div>
	);
}


const outerTheme = createMuiTheme({
	palette: {
		primary: {
			main: "#1a202c"
		},
		secondary: {
			main: "#00c6aa"
		},
		type: 'dark',
		background: {
			default: "#1a202c",
			paper: "#1e2430",
		},
	},
	typography: {
		fontFamily: '"MuseoModerno"',
	},
	props: {
		MuiPaper: {
			elevation: 2,
			variant: 'outlined'
		},
	}
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
			<CssBaseline>
				<ThemeProvider theme={outerTheme}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerToggle}
								className={classes.navIconHide}
							>
								<MenuIcon />
							</IconButton>
							<Typography
								variant="h6"
								color="inherit"
								noWrap={isMobile}
							>
								Create-React-App with Material-UI, Typescript,
								Redux and Routing
							</Typography>
						</Toolbar>
					</AppBar>
					<Hidden mdUp>
						<DrawerMui
							variant="temporary"
							anchor={"left"}
							open={mobileOpen}
							classes={{
								paper: classes.drawerPaper,
							}}
							onClose={handleDrawerToggle}
							ModalProps={{
								keepMounted: true, // Better open performance on mobile.
							}}
						>
						</DrawerMui>
					</Hidden>
					<Hidden smDown>
						<DrawerMui
							variant="permanent"
							open
							classes={{
								paper: classes.drawerPaper,
							}}
						>
						</DrawerMui>
					</Hidden>
					<Routes />
				</ThemeProvider>
			</CssBaseline>
		</Router>
	);
}

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: "100%",
		height: "100%",
		zIndex: 1,
		overflow: "hidden",
	},
	appFrame: {
		position: "relative",
		display: "flex",
		width: "100%",
		height: "100%",
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		position: "absolute",
	},
	navIconHide: {
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
	drawerHeader: { ...theme.mixins.toolbar },
	drawerPaper: {
		width: 250,
		backgroundColor: theme.palette.background.default,
		[theme.breakpoints.up("md")]: {
			width: drawerWidth,
			position: "relative",
			height: "100%",
		},
	},
	content: {
		backgroundColor: theme.palette.background.default,
		width: "100%",
		height: "calc(100% - 56px)",
		marginTop: 56,
		[theme.breakpoints.up("sm")]: {
			height: "calc(100% - 64px)",
			marginTop: 64,
		},
	},
}));

export default withRoot(App);

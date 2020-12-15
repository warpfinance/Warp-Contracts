import { makeStyles } from "@material-ui/core";
import { Dashboard } from "@material-ui/icons";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { ConnectedWeb3 } from "./hooks/connectedWeb3";
import { MigrationStatusContext } from "./hooks/useMigrations";
import {
	Borrower,
	Connect,
	Home,
	IntraTeamLeaderboard,
	Lender,
	Markets,
	TeamLeaderboard,
} from "./pages";
import { Migrate } from "./pages/App/Migrate";
import { CalculateMetrics } from "./pages/CalculateMetrics";
import { Web3AccountRequired } from "./pages/Web3AccountRequired";

const useStyles = makeStyles((theme) => ({
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

export const AppRouter: React.FC = (props) => {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Router>
				<div className={classes.root}>
					<Switch>
						<Route exact={true} path="/" component={Home} />
						<Route
							exact={true}
							path="/connect"
							component={Connect}
						/>
						<Route
							exact={true}
							path="/dashboard"
							render={() => (
								<Web3AccountRequired>
									<Dashboard />
								</Web3AccountRequired>
							)}
						/>
						<Route
							exact={true}
							path="/migrate"
							render={() => (
								<Web3AccountRequired>
									<Migrate />
								</Web3AccountRequired>
							)}
						/>
						<Route
							exact={true}
							path="/markets"
							render={() => (
								<ConnectedWeb3>
									<Markets />
								</ConnectedWeb3>
							)}
						/>
						<Route
							exact={true}
							path="/generate"
							render={() => (
								<ConnectedWeb3>
									<CalculateMetrics />
								</ConnectedWeb3>
							)}
						/>
						<MigrationStatusContext.Consumer>
							{(value) =>
								value.needsMigration === false ? (
									<React.Fragment>
										<Route
											exact={true}
											path="/borrower"
											render={() => (
												<Web3AccountRequired>
													<Borrower />
												</Web3AccountRequired>
											)}
										/>
										<Route
											exact={true}
											path="/lender"
											render={() => (
												<Web3AccountRequired>
													<Lender />
												</Web3AccountRequired>
											)}
										/>
										<Route
											exact={true}
											path="/teams"
											render={() => (
												<Web3AccountRequired>
													<TeamLeaderboard />
												</Web3AccountRequired>
											)}
										/>
										<Route
											exact={true}
											path="/team/:code"
											render={() => (
												<Web3AccountRequired>
													<IntraTeamLeaderboard />
												</Web3AccountRequired>
											)}
										/>
									</React.Fragment>
								) : null
							}
						</MigrationStatusContext.Consumer>
					</Switch>
				</div>
			</Router>
		</React.Fragment>
	);
};

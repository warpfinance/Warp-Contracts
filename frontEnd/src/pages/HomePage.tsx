import * as React from "react";

import { Borrower, Connect, Dashboard, Lender } from "./App";
import {
	Link,
	Route,
	Switch,
	useRouteMatch
} from "react-router-dom";

export function HomePage() {
	let { path, url } = useRouteMatch();

	return (
		<div>
			<h2>App</h2>
			<ul>
				<li>
					<Link to={`${url}`}>Dashboard</Link>
				</li>
				<li>
					<Link to={`${url}borrower`}>Borrower</Link>
				</li>
				<li>
					<Link to={`${url}connect`}>Connect</Link>
				</li>
				<li>
					<Link to={`${url}dashboard`}>Dashboard</Link>
				</li>
				<li>
					<Link to={`${url}lender`}>Lender</Link>
				</li>
			</ul>

			<Switch>
				<Route exact path={path}>
					<Dashboard />
				</Route>
				<Route path={`${path}borrower`}>
					<Borrower />
				</Route>
				<Route path={`${path}connect`}>
					<Connect />
				</Route>
				<Route path={`${path}dashboard`}>
					<Dashboard />
				</Route>
				<Route path={`${path}lender`}>
					<Lender />
				</Route>
			</Switch>
		</div>
	);
}
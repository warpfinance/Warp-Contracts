import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class DashboardClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Dashboard = connect(null, null)(DashboardClass)

export { Dashboard };
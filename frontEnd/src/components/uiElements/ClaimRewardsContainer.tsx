import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class ClaimRewardsContainerClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const ClaimRewardsContainer = connect(null, null)(ClaimRewardsContainerClass)

export { ClaimRewardsContainer };
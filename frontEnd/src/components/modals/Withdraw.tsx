import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class WithdrawClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Withdraw = connect(null, null)(WithdrawClass)

export { Withdraw };
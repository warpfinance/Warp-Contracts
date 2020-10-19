import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class LenderClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Lender = connect(null, null)(LenderClass)

export { Lender };
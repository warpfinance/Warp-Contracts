import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class BorrowerClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Borrower = connect(null, null)(BorrowerClass)

export { Borrower };
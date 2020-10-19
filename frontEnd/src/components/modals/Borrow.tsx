import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class BorrowClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Borrow = connect(null, null)(BorrowClass)

export { Borrow };
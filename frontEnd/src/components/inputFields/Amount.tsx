import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class AmountClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Amount = connect(null, null)(AmountClass)

export { Amount };
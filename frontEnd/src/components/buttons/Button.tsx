import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class ButtonClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Button = connect(null, null)(ButtonClass)

export { Button };
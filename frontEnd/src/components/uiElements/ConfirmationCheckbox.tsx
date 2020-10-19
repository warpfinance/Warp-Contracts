import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class ConfirmationCheckboxClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const ConfirmationCheckbox = connect(null, null)(ConfirmationCheckboxClass)

export { ConfirmationCheckbox };
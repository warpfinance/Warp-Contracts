import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class DropdownClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Dropdown = connect(null, null)(DropdownClass)

export { Dropdown };
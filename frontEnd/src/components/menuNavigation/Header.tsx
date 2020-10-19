import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class HeaderClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Header = connect(null, null)(HeaderClass)

export { Header };
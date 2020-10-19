import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class ConnectClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Connect = connect(null, null)(ConnectClass)

export { Connect };
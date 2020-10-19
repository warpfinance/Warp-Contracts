import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class InformationContainerClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const InformationContainer = connect(null, null)(InformationContainerClass)

export { InformationContainer };
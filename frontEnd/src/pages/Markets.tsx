import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class MarketsClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Markets = connect(null, null)(MarketsClass)

export { Markets };
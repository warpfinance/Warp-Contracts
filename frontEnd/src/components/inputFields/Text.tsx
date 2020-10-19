import * as React from "react";

import { connect } from "react-redux";

interface Props {

}

class TextClass extends React.Component<Props, {}> {
    render() {
        return null;
    }
}

const Text = connect(null, null)(TextClass)

export { Text };
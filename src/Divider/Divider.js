import React, {PropTypes} from 'react';
import classNames from 'classnames';

const Divider = (props, context) => {
    const {
        style,
        ...ohter
    } = props;

    const defaultStyles = {
        margin: 0
    };

    return (
        <hr {...ohter} style={Object.assign({}, defaultStyles, style)}/>
    );
}

Divider.isDivider = true;

export default Divider;
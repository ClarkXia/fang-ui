import React, {PropTypes} from 'react';

function getStyles(props) {
    return {
        left: props.left,
        width: props.width,
        bottom: 0,
        display: 'block',
        backgroundColor: props.color || 'none',
        height: 2,
        marginTop: -2,
        position: 'relative'
    }
}

export default class InkBar extends React.Component {
    static propTypes = {
        color: PropTypes.string,
        left: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired,
        style: PropTypes.object
    };

    render() {
        const {style} = this.props;
        return (
            <div style={Object.assign({}, getStyles(this.props), style)}></div>
        );
    }
}
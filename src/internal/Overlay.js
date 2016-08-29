import React, { PropTypes } from 'react';
import ScrollLock from '../internal/ScrollLock';

function getStyles(props){
    const style = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: '-100%',
        opacity: 0
        //TODO add transition
    };

    if (props.show) {
        Object.assign(style, {
            left: 0,
            opacity: 1
            //TODO add transition
        });
    }

    return style;
}

class Overlay extends React.Component {
    static propTypes = {
        scrollLock: PropTypes.bool,
        style: PropTypes.object,
        show: PropTypes.bool.isRequired
    };

    static defaultProps = {
        scrollLock: true,
        style: {}
    };

    render() {
        const { scrollLock, style, show, ...other } = this.props;
        const defaultStyles = getStyles(this.props);

        return (
            <div {...other} ref="overlay" style={Object.assign(defaultStyles, style)}>
                {scrollLock && <ScrollLock lock={show} />}
            </div>
        );
    }
}

export default Overlay;
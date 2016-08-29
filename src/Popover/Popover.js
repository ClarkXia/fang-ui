import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import RenderToLayer from '../internal/RenderToLayer';

const rootStyle = {
    position: 'fixed'
};

export default class Propover extends React.Component {
    static propTypes = {
        basedEl: PropTypes.object,
        basedOrigin: PropTypes.shape({
            vertical: PropTypes.oneOf(['top', 'middle', 'bottom']),
            horizontal: PropTypes.oneOf(['left', 'center', 'right'])
        }),
        targetOrigin: PropTypes.shape({
            vertical: PropTypes.oneOf(['top', 'middle', 'bottom']),
            horizontal: PropTypes.oneOf(['left', 'center', 'right'])
        }),
        onRequestClose: PropTypes.func,
        open: PropTypes.bool,
        useLayerForClickAway: PropTypes.bool,
        autoCloseWhenOffScreen: PropTypes.bool,
        chidren: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        canAutoPosition: PropTypes.bool
    };

    static defaultProps = {
        basedOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
        },
        autoCloseWhenOffScreen: true,
        canAutoPosition: true,
        onRequestClose: () => {},
        open: false,
        targetOrigin: {
            vertical: 'top',
            horizontal: 'left'
        },
        useLayerForClickAway: true
    };

    constructor(props) {
        super(props);

        this.state = {
            open: props.open
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.open !== this.state.open) {
            if (nextProps.open) {
                this.basedEl = nextProps.basedEl || this.props.basedEl;
                this.setState({open: true});
            } else {
                this.setState({open: false});
            }
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.setPlacement);
        window.addEventListener('scroll', this.setPlacement);
    }

    componentDidUpdate() {
        this.setPlacement();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setPlacement);
        window.removeEventListener('scroll', this.setPlacement);
    }

    renderLayer = () => {
        if (!this.state.open) return null;

        const {children, style, className = ''} = this.props;

        return (
            <div style={Object.assign({}, rootStyle, style)} className={className}>
                {children}
            </div>
        );

    };

    requestClose(reason) {
        if (this.props.onRequestClose) {
            this.props.onRequestClose(reason);
        }
    }

    componentClickAway = () => {
        this.requestClose('clickAway');
    };

    _resizeAutoPosition() {

    }

    getBasedPosition(el) {
        if (!el) {
            el = ReactDOM.findDOMNode(this);
        }

        const rect = el.getBoundingClientRect();
        const pos = {
            top: rect.top,
            left: rect.left,
            width: el.offsetWidth,
            height: el.offsetHeight
        };

        pos.right = rect.right || pos.left + pos.width;
        pos.bottom = rect.bottom || pos.top + pos.height;

        return pos;
    }

    setPlacement = (scrolling) => {
        if (!this.state.open) {
            return;
        }

        const basedEl = this.props.basedEl || this.basedEl;
        if (!this.refs.layer.getLayer()) {
            return;
        }
        const targetEl = this.refs.layer.getLayer().children[0];

        if (!targetEl) {
            return;
        }

        const {targetOrigin, basedOrigin} = this.props;
        const basePos = this.getBasedPosition(basedEl);
        const initPos = {
            top: 0,
            center: targetEl.offsetHeight / 2,
            bottom: targetEl.offsetHeight,
            left: 0,
            middle: targetEl.offsetWidth / 2,
            right: targetEl.offsetWidth
        };
        let targetPos = {
            top: basePos[basedOrigin.vertical] - initPos[targetOrigin.vertical],
            left: basePos[basedOrigin.horizontal] - initPos[targetOrigin.horizontal]
        };

        if (scrolling && this.props.autoCloseWhenOffScreen) {
            this.autoCloseWhenOffScreen(basePos);
        }

        if (this.props.canAutoPosition) {

        }

        targetEl.style.top = `${Math.max(0, targetPos.top)}px`;
        targetEl.style.left = `${Math.max(0, targetPos.left)}px`;
        //targetEl.style.maxHeight = `${window.innerHeight}px`;

    };

    autoCloseWhenOffScreen(pos) {
        if (pos.top < 0 ||
            pos.top > window.innerHeight ||
            pos.left < 0 ||
            pos.left > window.innerWidth) {
            this.requestClose('offScreen');
        }
    }

    autoPosition() {
        //TODO
    }

    /*getOverlapMode(based, target, median) {

    }

    getPositions(basedOrigin, targetOrigin) {

    }*/

    render() {
        return (
            <RenderToLayer
                ref="layer"
                open={this.state.open}
                componentClickAway={this.componentClickAway}
                useLayerForClickAway={this.props.useLayerForClickAway}
                render={this.renderLayer}
            />
        );
    }
}
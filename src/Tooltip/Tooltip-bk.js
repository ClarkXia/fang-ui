import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {createChildFragment} from '../utils/childUtils';
import RenderToLayer from '../internal/RenderToLayer';

const defaultStyle = {
    position: 'absolute',
    fontSize: '12px',
    lineHeight: '22px',
    padding: '0 8px',
    overflow: 'hidden',
    borderRadius: 2,
    userSelect: 'none',
    opacity: 0,
    top: -10000
}

class TooltipInline extends React.Component {
    static propTypes = {
        className: PropTypes.node,
        prefixCls: PropTypes.string,
        placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
        style: PropTypes.object,
        show: PropTypes.bool,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
    };

    static defaultProps = {
        prefixCls: 'tooltip'
    };

    render() {
        const {
            show,
            touch,
            placement,
            prefixCls,
            className = '',
            trigger,
            content,
            style,
            ...other
        } = this.props;

        return (
            <div {...other} className={className} ref="tooltip" style={Object.assign({}, defaultStyle, style)}>
                <div className={`${prefixCls}-arrow ${prefixCls}-arrow-${placement}`}></div>
                <div className={`${prefixCls}-content`}>
                {typeof content === 'string' ? <span>{content}</span> : React.cloneElement(content)}
                </div>
            </div>
        );
    }
}

export default class Tooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: 'show' in props ? !!props.show : false,
            offsetWidth: null,
            offsetHeight: null
        };
    }

    static propTypes = {
        trigger: PropTypes.oneOf(['hover', 'focus', 'click'])
    };

    static defaultProps = {
        trigger: 'hover'
    };

    renderLayer = () => {
        const {style, onTrigger, ...other} = this.props;
        return <TooltipInline {...other} show={this.state.show} style={Object.assign({}, style, this.setTooltipStyle())}/>
    };

    componentDidMount() {
        this.setTooltipPosition();
    }

    componentWillReceiveProps(nextProps) {
        if ('show' in nextProps){
            this.setState({
                show: !!nextProps.show
            });
        }
        this.setTooltipPosition();
    }

    setTooltipPosition() {
        const tooltip = findDOMNode(this.refs.layer.layerElement);
        this.setState({
            offsetWidth: tooltip.offsetWidth,
            offsetHeight: tooltip.offsetHeight
        })
    }

    setTooltipStyle(){
        const {offsetHeight, offsetWidth, show} = this.state;
        const baseElement = findDOMNode(this);
        const {placement} = this.props;
        const basePosition = baseElement.getBoundingClientRect();
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollLeft =  document.body.scrollLeft || document.documentElement.scrollLeft;
        const style = {};
        if (!show) {
            return style;
        }

        if (placement === 'left' || placement === 'right'){
            style.left = placement === 'left' ?
                            (basePosition.left - offsetWidth + scrollLeft + 'px') : (basePosition.left + basePosition.width + scrollLeft + 'px');
            style.top = basePosition.top + scrollTop + (basePosition.height - offsetHeight) / 2 + 'px';
        } else if (placement === 'top' || placement === 'bottom') {
            style.top = placement === 'top' ?
                            (basePosition.top - offsetHeight + scrollTop + 'px') : (basePosition.top + basePosition.height + scrollTop + 'px');
            style.left = basePosition.left + scrollLeft + (basePosition.width - offsetWidth) /2 + 'px';
        }

        style.opacity = '1';

        return style;
    }

    toggleDisplay = (flag) => {
        return (e) => {
            if (!flag) {
                flag = !this.state.show;
            }
            if ('show' in this.props){
                if (this.props.onTrigger) {
                    this.props.onTrigger(flag);
                }
            } else {
                this.setState({
                    show: flag
                })
            }

        }
    };

    createTowChains(event, fn) {
        const childProps = this.props.children.props;
        const props = this.props;

        if (childProps[event]) {
            return (e) => {
                childProps[event](e);
                fn(e);
            }
        }
        return fn;
    }

    render() {
        const {trigger} = this.props;
        const child = React.Children.only(this.props.children);
        const newChildProps = {};
        if (trigger === 'hover') {
            newChildProps.onMouseEnter = this.createTowChains('onMouseEnter', this.toggleDisplay(true));
            newChildProps.onMouseLeave = this.createTowChains('onMouseLeave', this.toggleDisplay(false));
        }else if (trigger === 'focus') {
            newChildProps.onFocus = this.createTowChains('onFocus', this.toggleDisplay(true));
            newChildProps.onBlur = this.createTowChains('onBlur', this.toggleDisplay(false));
        }else if (trigger === 'click') {
            newChildProps.onClick = this.createTowChains('onClick', this.toggleDisplay());
        }

        return React.cloneElement(child, newChildProps, createChildFragment({
            children: child.props.children,
            layer: <RenderToLayer render={this.renderLayer} open={true} useLayerForClickAway={false} ref="layer"/>
        }));
    }
}

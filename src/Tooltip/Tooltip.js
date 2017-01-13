import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import {createChildFragment} from '../utils/childUtils';
import RenderToLayer from '../internal/RenderToLayer';
import getPlacements from './placements';
import Popover from '../Popover';

class TooltipInline extends React.Component {
    render() {
        const {
            show,
            touch,
            placement,
            prefixCls,
            className = '',
            trigger,
            content,
            ...other
        } = this.props;

        const cls = classNames({
            [`${prefixCls}-container`]: true,
            [className]: !!className
        })

        return (
            <div {...other} className={cls} ref="tooltip">
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
            show: 'show' in props ? !!props.show : false
        };
    }

    static propTypes = {
        trigger: PropTypes.oneOf(['hover', 'focus', 'click']),
        className: PropTypes.node,
        prefixCls: PropTypes.string,
        placement: PropTypes.oneOf(
            ['left', 'left-top', 'left-bottom',
             'right', 'right-top', 'right-bottom',
             'top', 'top-left', 'top-right',
             'bottom', 'bottom-left', 'bottom-right']),
        style: PropTypes.object,
        show: PropTypes.bool,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
        onRequestClose: PropTypes.func,
        offset: PropTypes.arrayOf(PropTypes.number),
        destroyPopupOnHide: PropTypes.bool,
        mouseLeaveDelay: PropTypes.number,
        mouseEnterDelay: PropTypes.number,
        borderLimit: PropTypes.bool,
        inline: PropTypes.bool
    };

    static defaultProps = {
        trigger: 'hover',
        prefixCls: 'tooltip',
        destroyPopupOnHide: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 200,
        borderLimit: false,
        inline: false,
        placement: 'bottom'
    };

    componentDidMount() {
        //this.setTooltipPosition();
        this.setState({
            baseElement: findDOMNode(this.refs.baseElement)
        })
    }

    componentDidUpdate() {
        /*if (this.renderAgain) {
            //the component in Popover did update will later than Popover ?
            this.forceUpdate();
            this.renderAgain = false;
        }*/
    }

    componentWillReceiveProps(nextProps) {
        if ('show' in nextProps && this.props.show !== nextProps.show){
            this.setState({
                show: !!nextProps.show
            });
        }
        //basedEl is parentNode of popover
        //this.renderAgain = true;

        //this.setTooltipPosition();
    }

    componentWillUnmount() {
        clearTimeout(this.mouseTimer);
    }

    toggleDisplay = (flag) => {
        return (e) => {
            if (typeof flag !== 'boolean') {
                flag = !this.state.show;
            }

            if ('show' in this.props){
                if (this.props.onTrigger) {
                    this.mouseDelay(() => this.props.onTrigger(flag, e), flag);
                }
            } else {
                this.mouseDelay(() => this.setShowState(flag), flag);
            }
        }
    };

    setShowState = (flag) => {
        if (flag !== this.state.show) {
            this.setState({show: flag});
        }
    };

    mouseDelay = (func, flag) => {
        const {trigger, mouseLeaveDelay, mouseEnterDelay} = this.props;
        if (trigger === 'hover') {
            const time = flag ? mouseEnterDelay : mouseLeaveDelay;
            clearTimeout(this.mouseTimer);
            this.mouseTimer = setTimeout(() => func(), time);
        } else {
            func();
        }
    };

    handleRequestClose = (reason) => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose(reason);
        }

        if (!('show' in this.props)) {
            this.setState({
                show: false
            });
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
        const {trigger, onTrigger, onRequestClose, destroyPopupOnHide, className,
               mouseLeaveDelay, mouseEnterDelay, borderLimit, inline, ...other} = this.props;

        const child = React.Children.only(this.props.children);
        const newChildProps = {ref: 'baseElement'};
        const tooltipEvent = {};

        if (trigger === 'hover') {
            newChildProps.onMouseEnter = this.createTowChains('onMouseEnter', this.toggleDisplay(true));
            newChildProps.onMouseMove = this.createTowChains('onMouseMove', this.toggleDisplay(true));
            newChildProps.onMouseLeave = this.createTowChains('onMouseLeave', this.toggleDisplay(false));

            tooltipEvent.onMouseEnter = this.toggleDisplay(true);
            tooltipEvent.onMouseMove = this.toggleDisplay(true);
            tooltipEvent.onMouseLeave = this.toggleDisplay(false);
        }else if (trigger === 'focus') {
            newChildProps.onFocus = this.createTowChains('onFocus', this.toggleDisplay(true));
            newChildProps.onBlur = this.createTowChains('onBlur', this.toggleDisplay(false));
        }else if (trigger === 'click') {
            newChildProps.onClick = this.createTowChains('onClick', this.toggleDisplay());
        }

        const {basedOrigin, targetOrigin, offset} = getPlacements(this.props.placement);
        const popoverOffset = this.props.offset ? this.props.offset : offset;

        const cls = classNames({
            [`${this.props.prefixCls}-popover`]: true,
            [className]: !!className
        });

        return React.cloneElement(child, newChildProps, createChildFragment({
            children: child.props.children,
            layer:
            <Popover
                canAutoPosition={false}
                basedOrigin={basedOrigin}
                targetOrigin={targetOrigin}
                useLayerForClickAway={false}
                onRequestClose={this.handleRequestClose}
                basedEl={this.state.baseElement}
                className={cls}
                open={this.state.baseElement && this.state.show ? true : false}
                offset={popoverOffset}
                destroyPopupOnHide={destroyPopupOnHide}
                borderLimit={borderLimit}
                inline={inline}
            >
                <TooltipInline {...other} {...tooltipEvent} />
            </Popover>
        }))

    }
}

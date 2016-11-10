import React, {PropTypes} from 'react';
import Popover from '../Popover';
import Menu from './Menu';
import MenuItem from './MenuItem';
import classNames from 'classnames';

const defaultBasedOrigin = {
    vertical: 'top',
    horizontal: 'left'
};

const noop = () => {};
export default class DropDownMenu extends React.Component {
    static propTypes = {
        disabled: PropTypes.bool,
        onRequestClose: PropTypes.func,
        onItemSelect: PropTypes.func,
        onRequestChange: PropTypes.func,
        defaultOpen: PropTypes.bool,
        value: PropTypes.any,
        prefixCls: PropTypes.string,
        valueComponent: PropTypes.func,
        basedOrigin: PropTypes.object,
        popoverStyle: PropTypes.object,
        useLayerForClickAway: PropTypes.bool,
        canAutoPosition: PropTypes.bool
    };

    static defaultProps = {
        disabled: false,
        defaultOpen: false,
        prefixCls: 'dropdown',
        //onSelect: noop,
        basedOrigin: defaultBasedOrigin,
        popoverStyle: {},
        useLayerForClickAway: false,
        canAutoPosition: true
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    componentDidMount() {
        if (this.props.defaultOpen) {
            setTimeout(() => {
                this.setState({
                    open: true,
                    basedEl: this.refs.based
                });
            });
        }
    }

    handleOnChange = (event, itemValue) => {
        //event.persist();
        //setTimeout to fix "React DOM tree root should always have a node reference" issue
        /*setTimeout(() => {
            this.setState({
                open: false
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange(event, itemValue);
                }
            });
        });*/
        if (this.props.onRequestChange) {
            this.props.onRequestChange(event, itemValue);
        }
    };

    handleOnSelect = (event, item, index) => {
        setTimeout(() => {
            this.setState({
                open: false
            }, () => {
                if (this.props.onItemSelect) {
                    this.props.onItemSelect(event, item, index);
                }
            })
        })
    }

    handleRequestClose = (reason) => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose(reason);
        }
        this.setState({
            open: false,
            basedEl: null
        })

    };

    handleValueClick = (event) => {
        //event.preventDefault();
        if (!this.props.disabled) {
            this.setState({
                open: !this.state.open,
                basedEl: this.refs.based
            });
        }
    };

    render() {
        const {children, className, defaultOpen, value, onRequestChange, onItemSelect, onRequestClose, prefixCls, valueComponent, basedOrigin, popoverStyle, useLayerForClickAway, disableKeyEvent, canAutoPosition, ...other} = this.props;
        const ValueComponent = valueComponent;

        let selectedChild, i = 0;
        React.Children.forEach(children, (child) => {
            if (i === 0 || value === child.props.value) {
                selectedChild = child;
            }
            i++;
        });

        const displayValue = valueComponent ? <ValueComponent {...selectedChild.props} /> : (selectedChild.props.label || selectedChild.props.primaryText);

        const rootCls = classNames({
            [className]: !!className,
            [`${prefixCls}-root`]: true,
            [`${prefixCls}-open`]: this.state.open
        });
        const valueCls = classNames({
            [`${prefixCls}-value`]: true,
            [`${prefixCls}-disabled`]: this.props.disabled
        });

        return (
            <div
                {...other}
                className={rootCls}
            >
                <div className={valueCls} ref="based" onClick={this.handleValueClick}>{displayValue}</div>
                <Popover
                    basedOrigin={basedOrigin}
                    basedEl={this.state.basedEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                    useLayerForClickAway={useLayerForClickAway}
                    className={`${prefixCls}-popover`}
                    style={popoverStyle}
                    canAutoPosition={canAutoPosition}
                >
                    <Menu
                        value={value}
                        onItemSelect={this.handleOnSelect}
                        onChange={this.handleOnChange}
                        prefixCls={prefixCls}
                        disableKeyEvent={disableKeyEvent}
                    >
                        {children}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

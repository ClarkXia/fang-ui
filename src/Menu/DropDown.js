import React, {PropTypes} from 'react';
import Popover from '../Popover';
import Menu from './Menu';
import MenuItem from './MenuItem';
import classNames from 'classnames';

const basedOrigin = {
    vertical: 'top',
    horizontal: 'left'
};

const noop = () => {};
export default class DropDown extends React.Component {
    static propTypes = {
        disabled: PropTypes.bool,
        onClose: PropTypes.func,
        onSelect: PropTypes.func,
        onChange: PropTypes.func,
        defaultOpen: PropTypes.bool,
        value: PropTypes.any,
        prefixCls: PropTypes.string,
        valueComponent: PropTypes.func
    };

    static defaultProps = {
        disabled: false,
        defaultOpen: false,
        prefixCls: 'dropdown',
        onSelect: noop
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    componentDidMount() {
        if (this.props.defaultOpen) {
            setTimeout(() => {
                this.setState({
                    open: true,
                    basedEl: this.refs.root
                });
            });
        }
    }

    handleOnChange = (event, itemValue) => {
        event.persist();
        //setTimeout to fix "React DOM tree root should always have a node reference" issue
        setTimeout(() => {
            this.setState({
                open: false
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange(event, itemValue);
                }
            });
        });
    };

    handleRequestClose = () => {

        this.setState({
            open: false,
            basedEl: null
        })
    };

    handleValueClick = (event) => {
        event.preventDefault();
        if (!this.props.disabled) {
            this.setState({
                open: !this.state.open,
                basedEl: this.refs.root
            });
        }
    };

    render() {
        const {children, className, defaultOpen, value, onChange, onSelect, onClose, prefixCls, valueComponent, ...other} = this.props;
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
            [`${prefixCls}-root`]: true
        });
        const valueCls = classNames({
            [`${prefixCls}-value`]: true,
            [`${prefixCls}-disabled`]: this.props.disabled
        });

        return (
            <div
                {...other}
                className={rootCls}
                ref="root"
            >
                <div className={valueCls} onClick={this.handleValueClick}>{displayValue}</div>
                <Popover
                    basedOrigin={basedOrigin}
                    basedEl={this.state.basedEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                    useLayerForClickAway={false}
                >
                    <Menu
                        value={value}
                        onItemClick={this.props.onSelect}
                        onChange={this.handleOnChange}
                    >
                        {children}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

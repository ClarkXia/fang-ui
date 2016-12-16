import React, {PropTypes} from 'react';
import Popover from '../Popover';
import Menu from './Menu';
import MenuItem from './MenuItem';
import classNames from 'classnames';

const noop = () => {};
export default class ItemDropDown extends React.Component {
    static propTypes = {
        onItemSelect: PropTypes.func,
        onRequestChange: PropTypes.func,
        prefixCls: PropTypes.string,
        itemElement: PropTypes.element.isRequired,
        basedOrigin: PropTypes.object,
        targetOrigin: PropTypes.object,
        closeDelay: PropTypes.number,
        open: PropTypes.bool,
        useLayerForClickAway: PropTypes.bool
    };

    static defaultProps = {
        prefixCls: 'item-dropdown',
        //onSelect: noop,
        basedOrigin: {
            vertical: 'top',
            horizontal: 'left'
        },
        targetOrigin: {
            vertical: 'top',
            horizontal: 'left'
        },
        onItemSelect: noop,
        onRequestChange: noop,
        open: null,
        closeDelay: 200,
        useLayerForClickAway: false
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.open != null) {
            this.setState({
                open: nextProps.open,
                basedEl: this.refs.root
            })
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

    componentWillUnmount() {
        clearTimeout(this.timerClose);
    }

    close(reason) {
        if (!this.state.open) return;

        if (this.props.open !== null) {
            this.props.onRequestChange(false, reason);
        }
        this.requestClose = false;
        this.setState({open: false});
    }

    open(reason, event) {
        if (this.props.open !== null) {
            this.props.onRequestChange(true, reason);

            this.setState({
                basedEl: event.currentTarget
            });
        } else {
            this.setState({
                open: true,
                basedEl: event.currentTarget
            });
        }

        event.preventDefault();
    }

    handleOnSelect = (event, item, index) => {
        if (this.requestClose) return;
        this.requestClose = true;
        if (this.props.closeDelay !== 0) {
            this.timerClose = setTimeout(() => {
                this.close('itemSelect');
            }, this.props.closeDelay);
        }

        this.props.onItemSelect(event, item, index);
    };

    handleRequestClose = (reason) => {
        this.close(reason);
    };

    handleEscKeyDown = (event) => {
        this.close('escape');
    }

    render() {
        const {children, className, onItemSelect, prefixCls, itemElement, basedOrigin, targetOrigin, style, closeDelay, onRequestChange, useLayerForClickAway, ...other} = this.props;

        const item = React.cloneElement(itemElement, {
            onClick: (event) => {
                this.open('itemClick', event);
                if (itemElement.props.onClick) {
                    itemElement.props.onClick(event);
                }
            },
            ref: 'item'
        });

        const rootCls = classNames({
            [className]: !!className,
            [`${prefixCls}-root`]: true
        });

        return (
            <div
                className={rootCls}
                ref="root"
                style={Object.assign({}, style)}
            >
                {item}
                <Popover
                    basedOrigin={basedOrigin}
                    targetOrigin={targetOrigin}
                    basedEl={this.state.basedEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                    useLayerForClickAway={useLayerForClickAway}
                    className={`${prefixCls}-popover`}
                >
                    <Menu
                        {...other}
                        onItemSelect={this.handleOnSelect}
                        prefixCls={prefixCls}
                        onEscKeyDown={this.handleEscKeyDown}
                    >
                        {children}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

import React, {PropTypes} from 'react';
import classNames from 'classnames';

export default class TreeNode extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        disabled: PropTypes.bool,
        disableCheckbox: PropTypes.bool,
        expanded: PropTypes.bool,
        isLeaf: PropTypes.bool,
        root: PropTypes.object,
        label: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.string
        ]),
        dataLoading: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            dataLoading: !!this.props.dataLoading,
            loaded: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if ('dataLoading' in nextProps) {
            if (!!nextProps.dataLoading !== this.state.dataLoading) {
                this.setState({
                    dataLoading: nextProps.dataLoading
                });
            }
        } else {
            if (this.props.dataLoading) {
                this.setState({
                    dataLoading: false
                });
            }
        }
    }

    componentDidMount() {
        //TODO store instance in tree root
    }

    onExpand = (e) => {
        e.stopPropagation();
        if (this.state.dataLoading || this.props.disabled) return

        const callbackPromise = this.props.root.onExpand(this, this.state.loaded);
        if (callbackPromise && typeof callbackPromise === 'object') {
            const setLoading = (dataLoading) => {
                if (!('dataLoading' in this.props)) {
                    if (!dataLoading) {
                        this.setState({
                            loaded: true,
                            dataLoading
                        });
                    } else {
                        this.setState({
                            dataLoading
                        });
                    }
                }

            };
            setLoading(true);
            callbackPromise.then(() => {
                setLoading(false);
            }, () => {
                setLoading(false);
            });
        }
    };

    onCheck = (e) => {
        e.stopPropagation();
        if (!this.props.disabled && !this.props.disableCheckbox) {
            this.props.root.onCheck(this);
        }
    };

    onSelect = (e) => {
        //e.stopPropagation();
        if (this.props.selectable && !this.props.disabled) {
            this.props.root.onSelect(this);
        }
    }

    renderLevel() {
        let posArray = this.props.pos.split('-');
        if (posArray.length <= 2) return null;
        posArray.splice(0, 2)
        return posArray.map((v, i) => {
            return <b key={i}></b>
        });
    }

    renderSwitcher(canRenderSwitcher, expandedState) {
        const {prefixCls, disabled} = this.props;
        if (!canRenderSwitcher) {
            return <span className={`${prefixCls}-switcher-noop`}></span>;
        } else {
            const cls = classNames({
                [`${prefixCls}-switcher`]: true,
                [`${prefixCls}-switcher-${expandedState}`]: true,
                [`${prefixCls}-switcher-disabled`]: disabled
            })

            return <span className={cls} onClick={this.onExpand}></span>;
        }
    }

    renderCheckbox() {
        const {prefixCls, checked, halfChecked, disabled, disableCheckbox} = this.props;
        const cls = classNames({
            [`${prefixCls}-checkbox`]: true,
            [`${prefixCls}-checkbox-checked`]: checked && !halfChecked,
            [`${prefixCls}-checkbox-halfChecked`]: !checked && halfChecked,
            [`${prefixCls}-checkbox-disabled`]: disabled || disableCheckbox
        });

        return (
            //TODO repalce with Checkbox component & add click event
            <span ref="checkbox" className={cls} onClick={this.onCheck}></span>
        )
    }

    renderContent(expandedState) {
        const {prefixCls, iconSkin, loadData, label} = this.props;
        const cls = classNames({
            [`${prefixCls}-icon`]: true,
            [`${prefixCls}-icon-loading`]: this.state.dataLoading,
            [`${prefixCls}-icon-${iconSkin}`]: !!iconSkin && !this.state.dataLoading,
            [`${prefixCls}-icon-${expandedState}`]: !this.state.dataLoading
        })

        const icon = (iconSkin || loadData && this.state.dataLoading) ?
                        <span className={cls}></span> : null;
        const labelProps = {}
        if (typeof label === 'string' && label != '') {
            labelProps.title = label;
        }

        return (
            <a {...labelProps}>
                {icon}
                <span className={`${prefixCls}-title`}>{typeof label === 'function' ? label(this.props) : label}</span>
            </a>
        )
    }

    renderChildren() {
        const {children, prefixCls} = this.props;
        let newChildren = children;
        if (children &&
            (children.type === TreeNode ||
                Array.isArray(children) && children.every((item) => item.type === TreeNode))) {
            newChildren = (
                <ul className={prefixCls}>
                    {React.Children.map(children, (item, index) => {
                        return this.props.root.renderTreeNode(item, index, this.props.pos);
                    }, this.props.root)}
                </ul>
            );
        }
        return newChildren;
    }

    render() {
        const { expanded, disabled, selected, checkable, children, loadData, isLeaf, prefixCls, className } = this.props;
        const expandedState = expanded ? 'open' : 'close';
        const cls = classNames({
            [className]: !!className,
            [`${prefixCls}-node-disable`]: disabled,
            [`${prefixCls}-${expandedState}`]: true
        });
        const nodeCls = classNames({
            [`${prefixCls}-node-item`]: true,
            [`${prefixCls}-node-select`]: selected
        });
        let newChildren = this.renderChildren();
        let canRenderSwitcher = true;
        if (!newChildren  || newChildren === children) {
            newChildren = null;
            if (!loadData || isLeaf) {
                canRenderSwitcher = false;
            }
        }

        return (
            <li className={cls}>
                <div className={nodeCls} onClick={this.onSelect}>
                    {this.renderLevel()}
                    {this.renderSwitcher(canRenderSwitcher, expandedState)}
                    {checkable ? this.renderCheckbox() : null}
                    {this.renderContent(expandedState)}
                </div>
                {newChildren}
            </li>
        );
    }
}

TreeNode.isTreeNode = true;
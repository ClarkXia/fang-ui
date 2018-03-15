import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TreeNode extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        disabled: PropTypes.bool,
        disableCheckbox: PropTypes.bool,
        disableExpand: PropTypes.bool,
        checkGhost: PropTypes.bool,
        disableSelect: PropTypes.bool,
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
            loaded: props.loaded || false
        }
    }

    componentWillReceiveProps(nextProps) {
        const newSt = {};
        if ('dataLoading' in nextProps) {
            if (!!nextProps.dataLoading !== this.state.dataLoading) {
                newSt.dataLoading = nextProps.dataLoading;
            }
        } else {
            if (this.props.dataLoading) {
                newSt.dataLoading = false;
            }
        }

        if ('loaded' in nextProps) {
            newSt.loaded = nextProps.loaded;
        }

        if ('dataLoading' in newSt || 'loaded' in newSt) {
            this.setState(newSt);
        }
    }

    componentDidMount() {
        //TODO store instance in tree root
    }

    onExpand = (e) => {
        if (this.state.dataLoading || this.props.disabled || this.props.disableExpand) {
            return;
        } else {
            e.stopPropagation();
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
        if (this.props.selectable && !this.props.disabled && !this.props.disableSelect) {
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
        const {prefixCls, disabled, disableExpand, hideSwitcher} = this.props;
        if (!canRenderSwitcher) {
            return <span className={`${prefixCls}-switcher-noop`}></span>;
        } else {
            const cls = classNames({
                [`${prefixCls}-switcher`]: true,
                [`${prefixCls}-switcher-${expandedState}`]: true,
                [`${prefixCls}-switcher-disabled`]: disabled || disableExpand,
                [`${prefixCls}-switcher-hidden`]: hideSwitcher
            });

            return <span className={cls} onClick={this.onExpand}></span>;
        }
    }

    renderCheckbox() {
        const {prefixCls, checked, halfChecked, disabled, disableCheckbox, checkGhost} = this.props;
        const cls = classNames({
            [`${prefixCls}-checkbox`]: true,
            [`${prefixCls}-checkbox-checked`]: checked && !halfChecked,
            [`${prefixCls}-checkbox-halfchecked`]: !checked && halfChecked,
            [`${prefixCls}-checkbox-disabled`]: disabled || disableCheckbox,
            [`${prefixCls}-checkbox-ghost`]: !!checkGhost
        });

        return (
            <span className={cls} onClick={this.onCheck}></span>
        )
    }

    renderContent(expandedState) {
        const {prefixCls, iconSkin, loadData, label} = this.props;
        const cls = classNames({
            [`${prefixCls}-icon`]: true,
            [`${prefixCls}-icon-${iconSkin}`]: !!iconSkin,
            [`${prefixCls}-icon-${expandedState}`]: !this.state.dataLoading
        });

        const icon = iconSkin ? <span className={cls}></span> : null;
        const labelProps = {}
        if (typeof label === 'string' && label != '') {
            labelProps.title = label;
        }

        return (
            <span className={`${prefixCls}-title`} {...labelProps}>{icon}{typeof label === 'function' ? label(this.props) : label}</span>
        );
    }

    renderLoading() {
        const {prefixCls, loadData} = this.props;

        if (loadData && this.state.dataLoading) {
            return <span className={`${prefixCls}-icon-loading`}></span>;
        }
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
        const { expanded, disabled, selected, disableSelect, checked, halfChecked, checkable, children, loadData, isLeaf, prefixCls, className } = this.props;
        const expandedState = expanded ? 'open' : 'close';
        const cls = classNames({
            [className]: !!className,
            [`${prefixCls}-node-disable`]: disabled,
            [`${prefixCls}-${expandedState}`]: true
        });
        const nodeCls = classNames({
            [`${prefixCls}-node-item`]: true,
            [`${prefixCls}-node-select`]: selected,
            [`${prefixCls}-node-disable-select`]: disableSelect,
            [`${prefixCls}-node-loading`]: this.state.dataLoading,
            [`${prefixCls}-node-halfchecked`]: !checked && halfChecked,
            [`${prefixCls}-node-checked`]: checked && !halfChecked
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
                    {this.renderLoading()}
                    {checkable ? this.renderCheckbox() : null}
                    {this.renderContent(expandedState)}
                </div>
                {newChildren}
            </li>
        );
    }
}

TreeNode.isTreeNode = true;
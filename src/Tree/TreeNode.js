import React, {PropTypes} from 'react';
import classNames from 'classnames';

export default class TreeNode extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        disabled: PropTypes.bool,
        disableCheckbox: PropTypes.bool,
        expanded: PropTypes.bool,
        isLeaf: PropTypes.bool,
        root: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.loaded = false;
        this.state = {
            dataLoading: false
        }
    }

    componentDidMount() {
        //TODO store instance in tree root
    }

    onExpand = () => {
        if (this.state.dataLoading || this.props.disabled) return
        const callbackPromise = this.props.root.onExpand(this, this.loaded);
        if (callbackPromise && typeof callbackPromise === 'object') {
            const setLoading = (dataLoading) => {
                this.setState({
                    dataLoading
                })
                if (!dataLoading) this.loaded = true;
            };
            this.setState({dataLoading: true})
            callbackPromise.then(() => {
                setLoading(false);
            }, () => {
                setLoading(false);
            });
        }
    };

    onCheck = () => {
        if (!this.props.disabled && !this.props.disableCheckbox) {
            this.props.root.onCheck(this);
        }
    };

    onSelect = () => {
        if (this.props.selectable && !this.props.disabled) {
            this.props.root.onSelect(this);
        }
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
        const {prefixCls, iconSkin, loadData, name} = this.props;
        const cls = classNames({
            [`${prefixCls}-icon`]: true,
            [`${prefixCls}-icon-loading`]: this.state.dataLoading,
            [`${prefixCls}-icon-${iconSkin}`]: !!iconSkin && !this.state.dataLoading,
            [`${prefixCls}-icon-${expandedState}`]: !this.state.dataLoading
        })

        const icon = (iconSkin || loadData && this.state.dataLoading) ?
                        <span className={cls}></span> : null;

        return (
            <a title={typeof name === 'string' ? name : ''} onClick={this.onSelect}>
                {icon}
                <span className={`${prefixCls}-title`}>{name}</span>
            </a>
        )
    }

    renderChildren() {
        const {children} = this.props;
        let newChildren = children;
        if (children &&
            (children.type === TreeNode ||
                Array.isArray(children) && children.every((item) => item.type === TreeNode))) {
            newChildren = (
                <ul>
                    {React.Children.map(children, (item, index) => {
                        return this.props.root.renderTreeNode(item, index, this.props.pos);
                    }, this.props.root)}
                </ul>
            );
        }
        return newChildren;
    }

    render() {
        const { NodeLabel, expanded, disabled, selected, checkable, children, loadData, isLeaf, prefixCls, className } = this.props;
        const expandedState = expanded ? 'open' : 'close';
        const cls = classNames({
            [className]: !!className,
            [`${prefixCls}-node-disable`]: disabled,
            [`${prefixCls}-node-select`]: selected,
            [`${prefixCls}-${expandedState}`]: true
        })
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
                {this.renderSwitcher(canRenderSwitcher, expandedState)}
                {checkable ? this.renderCheckbox() : null}
                {this.renderContent(expandedState)}
                {newChildren}
            </li>
        );
    }
}

TreeNode.isTreeNode = true;
import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {loopChildren, filterParentPosition, handleCheck, getCheck, isInclude, arrayEqual} from '../utils/treeUtils'
import TreeNode from './TreeNode';

const getCheckedValue = (checkedKeys, halfChecked) => halfChecked ? {
    checked: checkedKeys,
    halfChecked
} : checkedKeys;

const noop = () => {};

export default class Tree extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        selectable: PropTypes.bool,
        checkable: PropTypes.bool,
        checkStrictly: PropTypes.bool,
        autoExpandParent: PropTypes.bool,
        defaultExpandAll: PropTypes.bool,
        defaultExpandKeys: PropTypes.arrayOf(PropTypes.string),
        expandKeys: PropTypes.arrayOf(PropTypes.string),
        defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
        checkedKeys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.object]),
        defaultSelectedKey: PropTypes.string,
        selectedKey: PropTypes.string,
        onExpand: PropTypes.func,
        onSelect: PropTypes.func,
        onCheck: PropTypes.func,
        loadData: PropTypes.func,
        forceLoad: PropTypes.bool
    };

    static defaultProps = {
        prefixCls: 'treenode',
        defaultExpandKeys: [],
        defaultCheckedKeys: [],
        getDefaultSelectedKey: false,
        selectable: true,
        checkable: false,
        checkStrictly: false,
        forceLoad: false,
        onCheck: noop,
        onExpand: noop,
        onSelect: noop
    };

    constructor(props) {
        super(props);

        this.checkedKeysChange = true;
        this.state = {
            expandKeys: this.getDefaultExpandKeys(props),
            checkedKeys: this.getDefaultCheckedKeys(props),
            selectedKey: this.getDefaultSelectedKey(props)
        }
    }

    componentWillReceiveProps(nextProps) {
        const expandKeys = this.getDefaultExpandKeys(nextProps, true);
        const checkedKeys = this.getDefaultCheckedKeys(nextProps, true);
        const selectedKey = this.getDefaultSelectedKey(nextProps, true);

        const st = {};
        if (expandKeys) st.expandKeys = expandKeys;
        if (checkedKeys) {
            if (nextProps.checkedKeys === this.props.checkedKeys) {
                this.checkedKeysChange = false;
            } else {
                this.checkedKeysChange = true;
            }

            st.checkedKeys = checkedKeys;
        }
        if (selectedKey) {
            st.selectedKey = selectedKey;
        }

        this.setState(st);
    }

    getDefaultSelectedKey(props, willReceiveProps) {
        let selectedKey = willReceiveProps ? undefined : props.getDefaultSelectedKey;
        if ('selectedKey' in props) {
            selectedKey = props.selectedKey;
        }
        return selectedKey;
    }

    getDefaultCheckedKeys(props, willReceiveProps) {
        let checkedKeys = willReceiveProps ? undefined : props.defaultCheckedKeys;
        if ('checkedKeys' in props) {
            checkedKeys = props.checkedKeys || [];
            if (props.checkStrictly) {
                if (props.checkedKeys.checked) {
                    checkedKeys = props.checkedKeys.checked;
                } else if (!Array.isArray(props.checkedKeys)) {
                    checkedKeys = [];
                }
            }
        }

        return checkedKeys;
    }

    getDefaultExpandKeys(props, willReceiveProps) {
        let expandKeys = willReceiveProps ? undefined :
            this.getFilterExpandedKeys(props, 'defaultExpandKeys',
                props.defaultExpandKeys.length ? false : props.defaultExpandAll);
        if ('expandKeys' in props) {
            expandKeys = (props.autoExpandParent ? this.getFilterExpandedKeys(props, 'expandKeys', false) : props.expandKeys) || [];
        }

        return expandKeys;
    }

    getFilterExpandedKeys(props, expandKeyProp, expandAll) {
        const keys = props[expandKeyProp];
        if (!expandAll && !props.autoExpandParent) {
            return keys || [];
        }
        const expandedPositionArr = [];
        if (props.autoExpandParent) {
            loopChildren(props.children, (item, index, pos, newKey) => {
                if (keys.indexOf(newKey) > -1) {
                    expandedPositionArr.push(pos);
                }
            })
        }

        const filterExpandedKeys = [];
        loopChildren(props.children, (item, index, pos, newKey) => {
            if (expandAll) {
                filterExpandedKeys.push(newKey);
            } else if (props.autoExpandParent) {
                expandedPositionArr.forEach(p => {
                    if ((p.split('-').length > pos.split('-').length &&
                        isInclude(pos.split('-'), p.split('-')) || pos === p) &&
                        filterExpandedKeys.indexOf(newKey) === -1) {
                        filterExpandedKeys.push(newKey);
                    }
                })
            }
        });

        return filterExpandedKeys.length ? filterExpandedKeys : keys;
    }

    onExpand = (treeNode, loaded) => {
        const expanded = !treeNode.props.expanded;
        const controlled = 'expandKeys' in this.props;
        const expandKeys = [...this.state.expandKeys];
        const index = expandKeys.indexOf(treeNode.props.eventKey);
        if (expanded && index === -1) {
            expandKeys.push(treeNode.props.eventKey);
        } else if (!expanded && index > -1) {
            expandKeys.splice(index, 1);
        }

        if (expanded && this.props.loadData && (this.props.forceLoad || !loaded)) {
            const callback = this.props.loadData(treeNode);
            if (typeof callback === 'object' && callback.then) {
                return callback.then(() => {
                    if (!controlled) {
                        this.setState({expandKeys});
                    } else {
                        this.props.onExpand(expandKeys, {node: treeNode, expanded});
                    }
                })
            } else {
                return true;
            }
        } else {
            if (!controlled) {
                this.setState({expandKeys});
            }
        }
        this.props.onExpand(expandKeys, {node: treeNode, expanded});

    };

    onCheck = (treeNode) => {
        let checked = !treeNode.props.checked;
        if (treeNode.props.halfChecked) {
            checked = true;
        }

        const key = treeNode.props.eventKey;
        let checkedKeys = [...this.state.checkedKeys];
        const index = checkedKeys.indexOf(key);
        const checkedArr = {
            node: treeNode,
            checked
        };

        if (this.props.checkStrictly && ('checkedKeys' in this.props)) {
            if (!checked && index > -1) {
                checkedKeys.splice(index, 1);
            }
            if (checked && index === -1){
                checkedKeys.push(key);
            }
            checkedArr.checkedNodes = [];
            loopChildren(this.props.children, (item, index, pos, keyOrPos) => {
                if (checkedKeys.indexOf(keyOrPos) != -1) {
                    checkedArr.checkedNodes.push(item);
                }
            });

            this.props.onCheck(getCheckedValue(checkedKeys, this.props.checkedKeys.halfChecked), checkedArr);
        } else {
            if (checked && index === -1) {
                this.treeNodesStates[treeNode.props.pos].checked = true;
                /*const checkedPositions = [];
                Object.keys(this.treeNodesStates).forEach(i => {
                    if (this.treeNodesStates[i].checked) {
                        checkedPositions.push(i);
                    }
                });
                handleCheck(this.treeNodesStates, filterParentPosition(checkedPositions), true);*/
                handleCheck(this.treeNodesStates, [treeNode.props.pos], true);
            }
            if (!checked) {
                this.treeNodesStates[treeNode.props.pos].checked = false;
                this.treeNodesStates[treeNode.props.pos].halfChecked = false;
                handleCheck(this.treeNodesStates, [treeNode.props.pos], false);
            }

            const checkKeys = getCheck(this.treeNodesStates);
            checkedArr.checkedNodes = checkKeys.checkedNodes;
            checkedArr.checkedNodesPositions = checkKeys.checkedNodesPositions;
            checkedArr.halfCheckedKeys = checkKeys.halfCheckedKeys;
            this.checkKeys = checkKeys;
            this._checkKeys = checkedKeys = checkKeys.checkedKeys;
            //uncontrolled
            if (!('checkedKeys' in this.props)) {
                this.setState({
                    checkedKeys
                });
            }

            this.props.onCheck(checkKeys, checkedArr);

        }
    };

    onSelect = (treeNode) => {
        const selectedKey = treeNode.props.eventKey;
        if (!('selectedKey' in this.props)) {
            this.setState({
                selectedKey
            })
        }

        this.props.onSelect(selectedKey, {node: treeNode});
    };

    renderTreeNode(child, index, level = 0) {
        const pos = `${level}-${index}`;
        const key = child.key || pos;
        const state = this.state;
        const props = this.props;

        let selectable = props.selectable;
        if (child.props.hasOwnProperty('selectable')) {
            selectable = child.props.selectable;
        }

        const cloneProps = {
            //ref: `treeNode-${key}`,
            root: this,
            key,
            eventKey: key,
            pos,
            selectable,
            loadData: props.loadData,
            expanded: state.expandKeys.indexOf(key) !== -1,
            selected: state.selectedKey === key,
            prefixCls: props.prefixCls
        };

        if (props.checkable) {
            cloneProps.checkable = props.checkable;
            if (props.checkStrictly) {
                if (state.checkedKeys) {
                    cloneProps.checked = state.checkedKeys.indexOf(key) !== -1;
                }
                if (props.checkedKeys.halfChecked) {
                    cloneProps.halfChecked = props.checkedKeys.halfChecked.indexOf(key) !== -1;
                } else {
                    cloneProps.halfChecked = false;
                }
            } else {
                if (this.checkedKeys) {
                    cloneProps.checked = this.checkedKeys.indexOf(key) !== -1;
                }
                if (this.halfCheckedKeys){
                    cloneProps.halfChecked = this.halfCheckedKeys.indexOf(key) !== -1;
                }
            }

            if (this.treeNodesStates[pos]) {
                Object.assign(cloneProps, this.treeNodesStates[pos].siblingPosition);
            }
        }

        return React.cloneElement(child, cloneProps);
    }

    render() {
        const {children, checkable, loadData, checkStrictly, className, prefixCls} = this.props;
        const cls = classNames({
            [`${prefixCls}`]: true,
            [className]: !!className
        });
        if (checkable && (this.checkedKeysChange || loadData)) {
            if (checkStrictly) {
                this.treeNodesStates = {};
                loopChildren(children, (item, index, pos, keyOrPos, siblingPosition) => {
                    this.treeNodesStates[pos] = {
                        siblingPosition
                    };
                });
            } else {
                const checkedKeys = this.state.checkedKeys;
                let checkKeys;
                if (!loadData && this.checkKeys && this._checkKeys && arrayEqual(this._checkKeys, checkedKeys)) {
                    checkKeys = this.checkKeys;
                } else {
                    const checkedPositions = [];
                    this.treeNodesStates = {};
                    //init check state
                    loopChildren(children, (item, index, pos, keyOrPos, siblingPosition) => {
                        this.treeNodesStates[pos] = {
                            node: item,
                            key: keyOrPos,
                            checked: false,
                            halfChecked: false,
                            siblingPosition
                        };
                        if (checkedKeys.indexOf(keyOrPos) !== -1) {
                            this.treeNodesStates[pos].checked = true;
                            checkedPositions.push(pos);
                        }
                    });
                    handleCheck(this.treeNodesStates, filterParentPosition(checkedPositions), true);
                    checkKeys = getCheck(this.treeNodesStates);
                }
                this.halfCheckedKeys = checkKeys.halfCheckedKeys;
                this.checkedKeys = checkKeys.checkedKeys;
            }
        }
        return (
            <ul className={cls}>
                {React.Children.map(children, this.renderTreeNode, this)}
            </ul>
        )
    }

}

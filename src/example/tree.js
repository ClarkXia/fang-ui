import React from 'react';
import Tree, {TreeNode} from '../Tree';
import css from './tree.css';

const treeData = [
    {typed_id: 'a-1', name: 'xxxx', count: '12', children: [
        {typed_id: 'a-1-1', name: 'aaa11', count: '13', children: [
            {typed_id: 'a-1-1-1', name: 'xa111', count: '1'},
            {typed_id: 'a-1-1-2', name: 'xa112', count: '111'}
        ]},
        {typed_id: 'a-1-2-1', name: 'xa121', count: '31'}
    ]},
    {typed_id: 'a-2', name: 'a2', count: '1'}
];

const TreeLabel = (props) => {
    return (
        <div className="node-label">
            <b>{props.name}</b>
            <em>({props.count})</em>
        </div>
    );
}

const onLoadData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}

export default class TreeSample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData,
            checkedKeys: [],
            expandKeys: [],
            selectedKey: null,
            checked: []
        }
    }

    renderTreeNode(data) {
        return data.map((value) =>
            <TreeNode key={value.typed_id} label={TreeLabel} name={value.name} count={value.count}>
                {value.children ? this.renderTreeNode(value.children) : null}
            </TreeNode>
        );
    }

    renderTree(data, treeProps) {
        return (
            <Tree {...treeProps}>
                {this.renderTreeNode(data)}
            </Tree>
        );
    }

    handleOnSelect = (...args) => {
        console.log(args)

    };

    handleOnCheck = (checked, treeNode) => {
        this.setState({
            checkedKeys: [...checked.checkedKeys]
        });
    };

    handleStrictlyCheck = (checked, treeNode) => {
        console.log(treeNode);
        this.setState({
            checked: [...checked.checked]
        })
    };

    handleOnExpand = (expandKeys, expandNode) => {
        this.setState({
            expandKeys: [...expandKeys]
        })
    };

    handleLoadData = (treeNode) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                //简单处理，直接修改数据
                if (treeNode.props.eventKey === 'a-1-1-2') {
                    treeData[0]['children'][0]['children'][1]['children'] = [
                        {typed_id: 'a-1-1-2-1', name: 'add1', count: '1'},
                        {typed_id: 'a-1-1-2-2', name: 'add2', count: '2'},
                        {typed_id: 'a-1-1-2-3', name: 'add3', count: '3'}
                    ];
                    this.setState({
                        treeData
                    })
                }
                resolve();
            }, 1000);
        });
    };

    render() {
        return (
            <div>
                <span>uncontrolled</span>
                {
                    this.renderTree(treeData,{
                        checkable: true
                    })
                }
                <span>controlled</span>
                {
                    this.renderTree(this.state.treeData, {
                        checkable: true,
                        checkedKeys: this.state.checkedKeys,
                        expandKeys: this.state.expandKeys,
                        selectedKey: this.state.selectedKey,
                        onSelect: this.handleOnSelect,
                        onCheck: this.handleOnCheck,
                        onExpand: this.handleOnExpand,
                        loadData: this.handleLoadData
                    })
                }
                <span>tree select</span>
                {
                    this.renderTree(treeData,{
                        checkable: true,
                        checkStrictly: true,
                        checkedKeys: {checked:this.state.checked,halfChecked:[]},
                        onCheck: this.handleStrictlyCheck,
                        defaultExpandAll: true
                    })
                }
            </div>
        )
    }
}
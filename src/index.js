import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'
import Button from './Button/Button'
import Dialog from './Dialog/Dialog'
import Tooltip from './Tooltip/Tooltip'
import Avatar from './Avatar/Avatar'
import Badge from './Badge/Badge'
import Tag from './Tag/Tag'
import Tabs from './Tabs/Tabs'
import Tab from './Tabs/Tab'
import Pagination from './Pagination/Pagination'
import Notification from './Notification/Notification'
import Checkbox from './Checkbox/Checkbox'
import Tree from './Tree/Tree'
import TreeNode from './Tree/TreeNode'
import Modal from './Modal/Modal'
import layer from './Modal/layer'
import ContextMenu from './Menu/ContextMenu'
import MenuItem from './Menu/MenuItem'
import SubMenu from './Menu/SubMenu'
import Menu from './Menu/Menu'
import EnableContextMenu from './Menu/EnableContextMenu'
import Popover from './Popover/Popover';
import Select from './Select/Select';
import Input from './Input/Input';


import SampleAvatar from './example/avatar';
import SampleBadge from './example/badge';
import SampleButton from './example/button';
import SampleCheckbox from './example/checkbox';
import SampleDialog from './example/dialog';
import SampleIcon from './example/icon';
import SampleInput from './example/input';
import SampleContextMenu from './example/contextmenu';
import SampleMenu from './example/menu';
import SampleSearch from './example/search';
import SampleMultiSelect from './example/select';
import SampleTab from './example/tabs';
import SampleTooltip from './example/tooltip';
import SampleTree from './example/tree';
import SamplePagination from './example/pagination';
import SampleMessage from './example/notification';
import SampleModal from './example/modal';
import SampleMention from './example/mention';

import * as A from './utils/treeUtils'

const style = {
    marginLeft: 12
}

const notification = Notification.newInstance({
    prefixCls: 'notification',
    style: {
        top: 30,
        right: 0
    }
})

class AutoCompleteExampleSimple extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            open: false,
            checked: []
        };
    }

    handleUpdateInput = (e) => {
        const value = e.currentTarget.value;
        if (value == '') return;
        this.setState({
            dataSource: [
                value,
                value + value,
                value + value + value
            ],
            basedEl: e.currentTarget,
            open: true
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false
        });
    };

    hanldCheck = (check) => {
        this.setState({
            checked: [...check.checked]
        })
    }

  render() {
    return (
      <div>
            <input onChange={this.handleUpdateInput} style={{margin: 20}}/>
            <Popover
                open={this.state.open}
                basedEl={this.state.basedEl}
                onRequestClose={this.handleRequestClose}
                useLayerForClickAway={false}
            >
                <Tabs initIndex={0} onChange={()=> {console.log('onChange')}} className="auto-complete">
                    <Tab label="人员" onActive={()=> {console.log('active1')}}>
                        <Menu
                            disableAutoFocus
                            onChange={this.handleOnChange}
                            show={this.state.open}
                        >
                            {this.state.dataSource.map((v, i) => {
                                return <MenuItem key={i} value={i}>{v}</MenuItem>
                            })}
                        </Menu>
                    </Tab>
                    <Tab label="部门">
                        <Tree checkable selectable={false} defaultExpandAll checkStrictly onCheck={this.hanldCheck} checkedKeys={{checked:this.state.checked,halfChecked:[]}}>
                            <TreeNode label="部门1" key={1} >
                                <TreeNode label="部门-1" isLeaf key={2}></TreeNode>
                                <TreeNode label="部门-2" isLeaf key={7}>
                                    <TreeNode label="部门-2-1" isLeaf key={8}></TreeNode>
                                    <TreeNode label="部门-2-2" isLeaf key={9}>
                                        <TreeNode label="部门-2-2-1" isLeaf key={10}></TreeNode>
                                        <TreeNode label="部门-2-2-2" isLeaf key={11}></TreeNode>
                                    </TreeNode>
                                </TreeNode>
                            </TreeNode>
                            <TreeNode label="部门2" key={3}>
                                <TreeNode label="部门2-1" key={4}></TreeNode>
                            </TreeNode>
                            <TreeNode label="部门c" key={5}>

                            </TreeNode>
                        </Tree>
                    </Tab>
                </Tabs>
            </Popover>
      </div>
    );
  }
}

class TestComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('did mount');
    }

    componentWillUnmount() {
        console.log('did unmount');
    }

    handleClick = (e) => {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
    };

    render() {

        return (
            <div>
                <SampleAvatar />
                <SampleBadge />
                <SampleButton />
                <SampleCheckbox />
                <SampleIcon />
                <SampleInput />
                <SampleMention />
                <SampleContextMenu />
                <SampleMenu />
                <SampleSearch />
                <SampleTab />
                <SampleTree />
                <SampleTooltip />
                <SamplePagination />
                <SampleMultiSelect />
                <SampleMessage />
                <SampleModal />
                <SampleDialog />
                <AutoCompleteExampleSimple />



                <Tag onClick={this.handleClick}>
                    标签1
                </Tag>
                <Tag onClose={() => alert('do something to delete tag')}>
                    标签2
                </Tag>
            </div>
        )
    }
}


render(
    <TestComponent />,
    document.getElementById('app')
)
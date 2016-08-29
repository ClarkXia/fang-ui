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
import EableContextMenu from './Menu/EableContextMenu'
import Popover from './Popover/Popover';

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

const onLoadData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}


const CMenu = (props) => {
    return (<ContextMenu>
                <MenuItem onClick={()=>{}}>menuitem{props.text}</MenuItem>
                <MenuItem onClick={()=>{}}>menuitem1</MenuItem>
                {props.text == 'abc' ?
                <SubMenu label="sp">
                    <MenuItem onClick={()=>{}}>menuitem2</MenuItem>
                    <MenuItem onClick={()=>{}}>menuitem3</MenuItem>
                </SubMenu> : null}
            </ContextMenu>)
}

const Item = (props) => {
    return props.connectContextMenu(<div style={{width:100, height:100, background:'#aaa', margin:'10px 10px 0 0', float:'left'}}>{props.text}</div>)
}

const Target = EableContextMenu(CMenu)(Item)
/*notification.notice({
    content: (
        <div className="some-content">
            content content content content content content content content content
        </div>
    ),
    //duration: 3.5,
    closable: true,
    onClose: function(){console.log('close')},
    key: 'abc',
    style: {
        color: '#abc'
    }
})
notification.notice({
    content: (
        <div className="some-content">
            content2 content content content content content content content content
        </div>
    ),
    duration: 3.5,
    closable: false,
    onClose: function(){console.log('close')},
    key: 'abcd',
    style: {}
})*/

/**/

const message = Notification.newInstance({
    prefixCls: 'message'
})
message.notice({
    content: 'message message message',
    duration: 5.5
})

class TestMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 8,
            open: false
        }
    }

    handleOnChange = (e, value) => {
        console.log(value)
        this.setState({
            value,
            open: false
        })
    };

    handleClick = (e) => {
        e.preventDefault();
        this.setState({
            basedEl: e.currentTarget,
            open: true
        });
        console.log('open');
    };

    handleRequestClose = () => {
        this.setState({
            open: false
        });
    };

    render() {
        const data = ['选项－','选项二','选项三','选项四','选项五','选项六','选项七','选项八','选项九','选项十'];
        return (
            <div>
                <span onClick={this.handleClick}>{data[this.state.value]}</span>
                <Popover
                    open={this.state.open}
                    basedEl={this.state.basedEl}
                    onRequestClose={this.handleRequestClose}
                    useLayerForClickAway={false}
                >
                    <Menu
                        value={this.state.value}
                        onChange={this.handleOnChange}
                        show={this.state.open}
                    >
                        {data.map((v, i) => {
                            return <MenuItem key={i} value={i}>{v}</MenuItem>
                        })}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

class TestComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            x: 0,
            y: 0,
            menuVisible: false
        };
    }

    switchDialogShow = () => {
        this.setState({
            dialogOpen: !this.state.dialogOpen
        });
    };

    handleContextMenu = (event) => {
        event.preventDefault();
        this.setState({
            x: event.clientX,
            y: event.clientY,
            menuVisible: true
        })
    };

    hideMenu = () => {
        console.log('window click')
        this.setState({
            menuVisible: false
        })
    };

    handleClick = (e) => {
        e.preventDefault();
        this.setState({
            basedEl: e.currentTarget,
            open: true
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false
        });
    };

    componentDidMount() {
        window.addEventListener('click', this.hideMenu);
    }

    render() {
        const actions = [
            <Button style={style} onClick={this.switchDialogShow}>cancel</Button>,
            <Button onClick={this.switchDialogShow}>confirm</Button>
        ];
        return (
            <div>
                <Button
                onClick={()=>{
                    layer.alert({
                        content: 'confirm some message'
                    })
                }}
                >
                    Alert
                </Button>
                <Button
                onClick={()=>{
                    layer.confirm({
                        content: 'confirm some message',
                        onOk: function(){
                            console.log('ok');
                        }
                    })
                }}
                >
                    Confirm
                </Button>
                <Button
                    onClick={this.switchDialogShow}
                >
                    Dialog
                </Button>
                <Button
                    onClick={this.handleClick}
                >
                    Popover
                </Button>
                <Popover
                    open={this.state.open}
                    basedEl={this.state.basedEl}
                    onRequestClose={this.handleRequestClose}
                    useLayerForClickAway={false}
                >
                    <MenuItem onClick={()=>{}}>menuitem1</MenuItem>
                    <MenuItem onClick={()=>{}}>menuitem2</MenuItem>
                    <MenuItem onClick={()=>{}}>menuitem3</MenuItem>
                    <MenuItem onClick={()=>{}}>menuitem4</MenuItem>
                </Popover>
                <TestMenu />
                <Dialog
                    open={this.state.dialogOpen}
                    title="this is a dialog"
                    actions={actions}
                    autoDetectWindowHeight={true}
                    repositionOnUpdate={true}
                >
                    content
                </Dialog>

                <Tooltip placement="right" title="提示文字" trigger="hover">
                    <div style={{
                        width: '100px',
                        height: '30px',
                        position: 'relative',
                        margin: 20,
                        background:'#abc'
                        }}
                        onClick={()=>{console.log('div click')}}
                    >
                    title
                    </div>
                </Tooltip>

                <Avatar>A</Avatar>
                <Avatar src="http://tva3.sinaimg.cn/crop.0.0.180.180.180/89d11e0ejw1e8qgp5bmzyj2050050aa8.jpg" size={50}/>
                <Badge badgeContent={3} >
                    <div style={{width:50,height:50,backgroundColor:'#aaa',position:'relative'}}>
                    </div>
                </Badge>
                <Badge badgeContent={101}>
                    <div style={{width:50,height:50,backgroundColor:'#aaa',position:'relative'}}>
                    </div>
                </Badge>
                <Badge badgeContent={101} dot={true}>
                    <div style={{width:50,height:50,backgroundColor:'#aaa',position:'relative'}}>
                    </div>
                </Badge>
                <Badge dot={true}>
                    text
                </Badge>

                <Tag>
                    标签1
                </Tag>
                <Tag onClose={() => alert('do something to delete tag')}>
                    标签2
                </Tag>
                <Tabs initIndex={0} onChange={()=> {console.log('onChange')}}>
                    <Tab label="tab1" onActive={()=> {console.log('active1')}}>
                        <div>tab1里面的内容</div>
                    </Tab>
                    <Tab label="tab2">
                        <div>tab2的内容！！！！</div>
                    </Tab>
                    <Tab label="tab3">
                        <div>tab3的内容！！！！</div>
                    </Tab>
                </Tabs>
                <Tabs value="tab2" onChange={(...args)=> {console.log('onChange', args)}}>
                    <Tab label="tab1" onActive={()=> {console.log('active1')}} value="tab1">
                        <div>tab1里面的内容</div>
                    </Tab>
                    <Tab label="tab2" value="tab2">
                        <div>tab2的内容！！！！</div>
                    </Tab>
                </Tabs>
                <Pagination total={100} pageSize={5}/>
                <Pagination total={50} pageSize={5} current={10} onChange={(page) => console.log('onChange', page)}/>
                <Checkbox onChange={()=>{console.log('uncontrolled')}}/>
                <Checkbox onChange={(...args)=>{console.log('Checkbox onChange',args)}} checked={true}/>

                <Tree checkable>
                    <TreeNode name="a" key={1} >
                        <TreeNode name="a-1" isLeaf key={2}></TreeNode>
                        <TreeNode name="a-2" isLeaf key={7}>
                            <TreeNode name="a-2-1" isLeaf key={8} disableCheckbox></TreeNode>
                            <TreeNode name="a-2-2" isLeaf key={9}>
                                <TreeNode name="a-2-2-1" isLeaf key={10}></TreeNode>
                                <TreeNode name="a-2-2-2" isLeaf key={11}></TreeNode>
                                <TreeNode name="a-2-2-3" isLeaf key={12} disabled></TreeNode>
                            </TreeNode>
                        </TreeNode>
                    </TreeNode>
                    <TreeNode name="b" key={3}>
                        <TreeNode name="b-1" key={4}></TreeNode>
                    </TreeNode>
                    <TreeNode name="c" key={5}>

                    </TreeNode>
                </Tree>


                <Tree
                    checkable
                    checkedKeys={['10']}
                    expandKeys={['1', '7', '3']}
                    selectedKey="7"
                    onSelect={(...args) => {console.log(args)}}
                    onCheck={(...args) => {console.log(args)}}
                    onExpand={(...args) => {console.log(args)}}
                    loadData={onLoadData}
                >
                    <TreeNode name="a" key={1} >
                        <TreeNode name="a-1" isLeaf key={2}></TreeNode>
                        <TreeNode name="a-2" key={7}>
                            <TreeNode name="a-2-1" isLeaf key={8} disableCheckbox></TreeNode>
                            <TreeNode name="a-2-2" isLeaf key={9} disabled>
                                <TreeNode name="a-2-2-1" isLeaf key={10}></TreeNode>
                                <TreeNode name="a-2-2-2" isLeaf key={11}></TreeNode>
                                <TreeNode name="a-2-2-3" isLeaf key={12}></TreeNode>
                            </TreeNode>
                        </TreeNode>
                    </TreeNode>
                    <TreeNode name="b" key={3}>
                        <TreeNode name="b-1" key={4}></TreeNode>
                    </TreeNode>
                    <TreeNode name="c" key={5} iconSkin="default">

                    </TreeNode>
                </Tree>
                <div style={{width: '100%', height: 60, background: '#aaa', fontSize: 16, textAlign: 'center', lineHeight: '60px'}} onContextMenu={this.handleContextMenu}>ContextMenu</div>
                <ContextMenu x={this.state.x} y={this.state.y} visible={this.state.menuVisible}>
                    <MenuItem onClick={()=>{}}>menuitem1</MenuItem>
                    <MenuItem onClick={()=>{}}>menuitem2</MenuItem>
                    <SubMenu label="SubMenu">
                        <MenuItem onClick={()=>{}}>menuitem3</MenuItem>
                        <SubMenu label="SubMenu2">
                            <MenuItem onClick={()=>{}}>menuitem6</MenuItem>
                            <MenuItem onClick={()=>{}}>menuitem7</MenuItem>
                        </SubMenu>
                        <MenuItem onClick={()=>{}}>menuitem4</MenuItem>
                        <MenuItem onClick={()=>{}}>menuitem5</MenuItem>
                    </SubMenu>
                </ContextMenu>

                <Target text="abc" />
                <Target text="efg" />

            </div>
        )
    }
}


render(
    <TestComponent />,
    document.getElementById('app')
)
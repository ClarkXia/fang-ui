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

const Target = EnableContextMenu(CMenu)(Item)
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
    duration: 1.5
})

class TestMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 7,
            open: false
        }
    }

    handleOnChange = (e, item, index) => {
        e.stopPropagation();
        //fix Uncaught Invariant Violation: React DOM tree root should always have a node reference.
        setTimeout(() => {
            this.setState({
                open: false,
                value: item.props.value
            })
        })
    };

    handleClick = (e) => {
        //e.preventDefault();
        e.stopPropagation();
        this.setState({
            basedEl: e.currentTarget,
            open: true
        });
        console.log('open');
    };

    handleRequestClose = (...args) => {
        console.log(args);
        this.setState({
            open: false
        });
    };

    render() {
        const data = ['选项－','选项二','选项三','选项四','选项五','选项六','选项七','选项八','选项九','选项十'];
        return (
            <div style={{display:'inline-block', marginLeft: 20, position:'relative', 'top':200}}>
                <span onClick={this.handleClick} >{data[this.state.value - 1]}</span>
                <Popover
                    open={this.state.open}
                    //basedEl={this.state.basedEl}
                    onRequestClose={this.handleRequestClose}
                    useLayerForClickAway={false}
                    canAutoPosition={false}
                    //basedOrigin={{vertical: 'middle', horizontal: 'center'}}
                    //targetOrigin={{vertical: 'middle', horizontal: 'center'}}
                    //basedOrigin={{vertical: 'bottom', horizontal: 'left'}}
                    position={{left:700,top:100,collision:'fit'}}
                    container={this}
                >
                    <Menu
                        value={this.state.value}
                        onItemClick={this.handleOnChange}
                        show={this.state.open}
                    >
                        {data.map((v, i) => {
                            return <MenuItem key={i} value={i + 1}>{v}</MenuItem>
                        })}
                    </Menu>
                </Popover>
            </div>
        );
    }
}


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
                            <TreeNode name="部门1" key={1} >
                                <TreeNode name="部门-1" isLeaf key={2}></TreeNode>
                                <TreeNode name="部门-2" isLeaf key={7}>
                                    <TreeNode name="部门-2-1" isLeaf key={8}></TreeNode>
                                    <TreeNode name="部门-2-2" isLeaf key={9}>
                                        <TreeNode name="部门-2-2-1" isLeaf key={10}></TreeNode>
                                        <TreeNode name="部门-2-2-2" isLeaf key={11}></TreeNode>
                                    </TreeNode>
                                </TreeNode>
                            </TreeNode>
                            <TreeNode name="部门2" key={3}>
                                <TreeNode name="部门2-1" key={4}></TreeNode>
                            </TreeNode>
                            <TreeNode name="部门c" key={5}>

                            </TreeNode>
                        </Tree>
                    </Tab>
                </Tabs>
            </Popover>
      </div>
    );
  }
}

const list = [
    { label: 'option1', value: '1',disabled: true},
    { label: 'option2', value: '2'},
    { label: 'option3', value: '3' },
    { label: 'option4', value: '4' },
    { label: 'option5', value: '5' },
    { label: 'option6', value: '6' }
];

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }
    handleUpdateInput = (e) => {
        const value = e.currentTarget.value;
        if (value == '') return;
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

    handleOnChange = (...args) => {
        console.log(args)
        setTimeout(() => {
            this.setState({
                open: false
            });
        });
    }
    render() {
        return (<div>
        <input onChange={this.handleUpdateInput} style={{margin: 20}}/>
            <Popover
                open={this.state.open}
                basedEl={this.state.basedEl}
                onRequestClose={this.handleRequestClose}
                useLayerForClickAway={false}
            >
                <Menu
                    disableAutoFocus
                    onChange={this.handleOnChange}
                    show={this.state.open}
                    className="search-menu"
                >
                    {list.map((v, i) => {
                        return <MenuItem key={i} value={i}><Avatar>{v.value}</Avatar>{v.label}</MenuItem>
                    })}
                </Menu>
            </Popover>
        </div>);
    }
}


const MultiSelectField = React.createClass({
    displayName: 'MultiSelectField',
    propTypes: {
        label: React.PropTypes.string
    },
    getInitialState () {
        return {
            disabled: false,
            options: list,
            value: []
        };
    },
    handleSelectChange (value) {
        console.log('You\'ve selected:', value);
        this.setState({ value });
    },
    toggleDisabled (e) {
        this.setState({ disabled: e.target.checked });
    },

    render () {
        return (
            <div className="section">
                <Select multi simpleValue disabled={this.state.disabled} value={this.state.value} filterOptions={false} placeholder="Multiselect" options={this.state.options} onChange={this.handleSelectChange} />
            </div>
        );
    }
});

class AutoSizeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value : ''
        };
    }

    handleOnChange = (e) => {
        this.setState({
            value: e.currentTarget.value
        })
    }

    render() {
        return <Input type="text" placeholder="请输入内容auto size" value={this.state.value} maxWidth={150} onChange={this.handleOnChange} autoSize={true}/>
    }
}

class AutoSizeTextarea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Input type="textarea" placeholder="auto size placeholder auto size placeholder" defaultValue="" minRows="2" maxRows="4" autoSize={true}/>
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
        //console.log('window click')
        this.setState({
            menuVisible: false
        })
    };

    handleClick = (e) => {
        //e.preventDefault();
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

    handleDialogClose = () => {
        this.setState({
            dialogOpen: false
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
                <SampleAvatar />
                <SampleBadge />
                <SampleButton />
                <SampleCheckbox />
                <SampleDialog />
                <SampleIcon />
                <SampleInput />
                <SampleContextMenu />
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
                <Search />
                <MultiSelectField/>
                <AutoCompleteExampleSimple />


                <Dialog
                    open={this.state.dialogOpen}
                    title="this is a dialog"
                    actions={actions}
                    autoDetectWindowHeight={true}
                    repositionOnUpdate={true}
                    onClose={this.handleDialogClose}
                >
                    content
                </Dialog>

                <Tooltip placement="top" title="提示文字" trigger="hover">
                    <div style={{
                        width: '100px',
                        height: '30px',
                        position: 'relative',
                        margin: 20,
                        background:'#abc'
                        }}
                        onClick={()=>{console.log('div click')}}
                    >
                    Tooltip
                    </div>
                </Tooltip>



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
import React from 'react';
import {MenuItem, ContextMenu, EnableContextMenu, SubMenu} from '../Menu';
import css from './contextmenu.css';

const ItemClick = (e) => {
    console.log('item click');
}

const SampleContextMenu = (props) => {
    return (
        <ContextMenu>
            <MenuItem onClick={ItemClick}>MenuItem{props.text}</MenuItem>
            <MenuItem onClick={ItemClick}>MenuItem</MenuItem>
            {props.menu == 'sub' ?
                <SubMenu label="sp">
                    <MenuItem onClick={ItemClick}>MenuItem2</MenuItem>
                    <MenuItem onClick={ItemClick}>MenuItem3</MenuItem>
                </SubMenu> : null}
        </ContextMenu>
    );
};

const divStyle = {
    width: 500,
    height: 50,
    background: '#aaa',
    margin: '10px 10px 0 0',
    textAlign: 'center',
    lineHeight: '50px',
    color: '#fff',
    fontSize: 20
};

const MenuList = (props) => {
    return props.connectContextMenu(<div style={divStyle}>{props.text}</div>);
};

const Target = EnableContextMenu(SampleContextMenu)(MenuList);

const permissionList = [['MenuItem1', 'MenuItem2', 'MenuItem3', 'MenuItem4', 'MenuItem5'],
                        ['MenuItem1', 'MenuItem2', 'MenuItem4', 'MenuItem5']];

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            visible: false,
            menuList: null
        }
    }

    handleContextMenu = (e) => {
        e.preventDefault();
        this.setState({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            menuList: permissionList[e.target.getAttribute('data-typed-id')]
        })
    };

    hideMenu = (e) => {
        this.setState({
            visible: false
        })
    };

    componentDidMount() {
        window.addEventListener('click', this.hideMenu);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.hideMenu);
    }

    render() {
        const listData = [{text: 'A', menu: 'sub'},{text: 'B'},{text: 'C', menu: 'sub'}];
        return (
            <div style={{position:'relative'}}>
                {listData.map((v, i) => {
                   return <Target {...v} key={i}/>
                })}
                <div style={divStyle} onContextMenu={this.handleContextMenu} data-typed-id="0">ContextMenu1</div>
                <div style={divStyle} onContextMenu={this.handleContextMenu} data-typed-id="1">ContextMenu2</div>
                {/*can container to render inline*/}
                 <ContextMenu
                    x={this.state.x} y={this.state.y} visible={this.state.visible}
                    //container={this}
                >
                    {
                        this.state.menuList ? this.state.menuList.map((v, i) => {
                            return <MenuItem
                                        key={i}
                                        onClick={()=>{}}
                                        onContextMenu={(e) => {e.preventDefault();}}
                                    >
                                        {v}
                                    </MenuItem>
                        }) : null
                    }
                </ContextMenu>
            </div>
        );
    }
}
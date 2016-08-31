import React from 'react';
import {MenuItem, ContextMenu, EnableContextMenu, SubMenu} from '../Menu';
import css from './contextmenu.css';

const ItemClick = (e, data) => {
    console.log(data);
}

const SampleContextMenu = (props) => {
    return (
        <ContextMenu>
            <MenuItem onClick={ItemClick}>MenuItem{props.text}</MenuItem>
            <MenuItem onClick={ItemClick}>MenuItem</MenuItem>
            {props.menu == 'sub' ?
                <SubMenu label="sp">
                    <MenuItem onClick={()=>{}}>MenuItem2</MenuItem>
                    <MenuItem onClick={()=>{}}>MenuItem3</MenuItem>
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

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            visible: false
        }
    }

    handleContextMenu = (e) => {
        e.preventDefault();
        this.setState({
            x: e.clientX,
            y: e.clientY,
            visible: true
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
            <div>
                {listData.map((v, i) => {
                   return <Target {...v} key={i}/>
                })}

                <div style={divStyle} onContextMenu={this.handleContextMenu}>ContextMenu</div>
                {/*can use Popover instead of ContextMenu*/}
                <ContextMenu x={this.state.x} y={this.state.y} visible={this.state.visible}>
                    <MenuItem onClick={()=>{}}>MenuItem1</MenuItem>
                    <MenuItem onClick={()=>{}}>MenuItem2</MenuItem>
                    <MenuItem onClick={()=>{}}>MenuItem3</MenuItem>
                </ContextMenu>
            </div>
        )
    }
}
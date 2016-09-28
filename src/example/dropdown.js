import React from 'react';
import {DropDownMenu, ItemDropDown, MenuItem} from '../Menu';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1
        };
    }

    handleOnChange = (e, value) => {
        this.setState({
            value
        });
    }

    render() {
        return (
            <div>
            <DropDownMenu onRequestChange={this.handleOnChange} value={this.state.value} defaultOpen={false}>
                <MenuItem value={1} label="xxx1">xxx</MenuItem>
                <MenuItem value={2} label="yyy2">yyy</MenuItem>
            </DropDownMenu>

            <ItemDropDown
                onItemSelect={() => {console.log('item select')}}
                itemElement={<div><i>icon</i><em>text</em></div>}
            >
                <MenuItem onClick={() => {console.log('action1')}}>action1</MenuItem>
                <MenuItem onClick={() => {console.log('action2')}}>action2</MenuItem>
            </ItemDropDown>
            </div>
        );
    }
}
import React from 'react';
import {DropDown, MenuItem} from '../Menu';

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
            <DropDown onChange={this.handleOnChange} value={this.state.value} defaultOpen={false}>
                <MenuItem value={1} label="xxx1">xxx</MenuItem>
                <MenuItem value={2} label="yyy2">yyy</MenuItem>
            </DropDown>
        );
    }
}
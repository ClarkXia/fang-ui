import React from 'react';
import Checkbox from '../Checkbox';
import css from './checkbox.css';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    handleOnChange = (e, checked) => {
        this.setState({
            checked
        });
    }

    render() {
        return (
            <div>
                <Checkbox onChange={()=>{console.log('uncontrolled')}} defaultChecked={true}/>uncontrolled
                <Checkbox onChange={this.handleOnChange} checked={this.state.checked}/>controlled
                <Checkbox onChange={()=>{console.log('uncontrolled')}} disabled defaultChecked={true}/>disabled
            </div>
        );
    }
}
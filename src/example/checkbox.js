import React from 'react';
import Checkbox from '../Checkbox';
import Radio from '../Radio';
import Switch from '../Switch';
import {LabelEnhance} from '../internal/LabelEnhance';
import css from './checkbox.css';

const CheckboxLabel = LabelEnhance(Checkbox);
const RadioLable = LabelEnhance(Radio);

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
                <CheckboxLabel defaultChecked={true}>label text</CheckboxLabel>
                <Radio defaultChecked={false} />
                <RadioLable defaultChecked={false} onChange={(event, value) => console.log(value)}>label text</RadioLable>
                <Switch />
                <Switch checkedChildren="on" unCheckedChildren="off"/>
            </div>
        );
    }



}
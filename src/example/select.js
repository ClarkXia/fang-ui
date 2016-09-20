import React from 'react';
import Select from '../Select';
import css from './select.css';

const list = [
    { label: 'option1', value: '1',disabled: true},
    { label: 'option2', value: '2'},
    { label: 'option3', value: '3' },
    { label: 'option4', value: '4' },
    { label: 'option5', value: '5' },
    { label: 'option6', value: '6' }
];

export default class MultiSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: list,
            value: [{ label: 'optioxxx', value: '2'}]
        };
    }

    handleSelectChange = (value) => {
        this.setState({
            value
        });
    };

    handleInputEnter = (value) => {
        this.setState({
            value: [
                ...this.state.value,
                {label: value, value}
            ]
        });
    }

    render() {
        return (
            <div>
                <Select
                    multi={true}
                    value={this.state.value}
                    filterOptions={false}
                    //options={this.state.options}
                    inputMaxWidth={100}
                    onChange={this.handleSelectChange}
                    placeholder="multi-select"
                    autosize={true}
                    onInputEnter={this.handleInputEnter}
                />

                <Select
                    multi={true}
                    value={this.state.value}
                    filterOptions={false}
                    options={this.state.options}
                    onChange={this.handleSelectChange}
                    clearable={true}
                />
            </div>
        )
    }
}
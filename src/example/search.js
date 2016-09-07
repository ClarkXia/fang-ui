import React from 'react';
import Menu, {MenuItem} from '../Menu';
import Avatar from '../Avatar';
import Popover from '../Popover';

const list = [
    { label: 'option1', value: '1',disabled: true},
    { label: 'option2', value: '2'},
    { label: 'option3', value: '3' },
    { label: 'option4', value: '4' },
    { label: 'option5', value: '5' },
    { label: 'option6', value: '6' }
];

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: ''
        };
    }
    handleUpdateInput = (e) => {
        const value = e.currentTarget.value;
        let open = true
        if (value == '') open = false;
        this.setState({
            basedEl: e.currentTarget,
            open,
            value
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false
        });
    };

    handleOnChange = (e, dataIndex) => {
        setTimeout(() => {
            this.setState({
                open: false,
                value: list[dataIndex].label
            });
        });
    }
    render() {
        return (<div>
        <input onChange={this.handleUpdateInput} style={{margin: 20}} value={this.state.value}/>
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
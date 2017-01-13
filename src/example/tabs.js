import React from 'react';
import Tabs, {Tab} from '../Tabs';
import css from './tabs.css';

const TabTpl = (props) => {
    let style = {};
    if (!props.selected) {
        style.display = 'none';
    }
    return (<div style={style}>
                <span>addition content</span>
                <div className="tab-cnt">
                    {props.children}
                </div>
            </div>);
}

class TestTab extends React.Component{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('..tab..mount')
    }

    render() {
        return <div>test</div>;
    }
}

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'tab1'
        };
    }

    handleOnChange = (value, event, ReactElement) => {
        this.setState({
            value
        })
    };

    handleChangeUncontrolled = (...args) => {
        console.log('change', args);
    };

    handleOnActive = (...args) => {
        console.log('active', args);
    };

    render() {
        return (
            <div>
                <span>uncontrolled</span>
                <Tabs initIndex={0} onChange={this.handleChangeUncontrolled} useInkBar={false}>
                    <Tab label="tab1" onActive={this.handleOnActive}>
                        <div>tab1里面的内容</div>
                    </Tab>
                    <Tab label="tab2">
                        <div>tab2的内容！！！！</div>
                    </Tab>
                    <Tab label="tab3">
                        <div>tab3的内容！！！！</div>
                    </Tab>
                </Tabs>

                <span>controlled & useInkBar</span>
                <Tabs value={this.state.value} onChange={this.handleOnChange}>
                    <Tab label="tab1" onActive={this.handleOnActive} value="tab1" key="v1">
                        <div>tab1里面的内容</div>
                    </Tab>
                    <Tab label="tab2" value="tab2" key="v2">
                        <div>tab2的内容！！！！</div>
                        <TestTab />
                    </Tab>
                </Tabs>

                <span>tab template</span>
                <Tabs initIndex={0} onChange={this.handleChangeUncontrolled} useInkBar={false} tabTemplate={TabTpl}>
                    <Tab label="tab1" onActive={this.handleOnActive}>
                        <div>tab1里面的内容</div>
                    </Tab>
                    <Tab label="tab2">
                        <div>tab2的内容！！！！</div>
                    </Tab>
                    <Tab label="tab3">
                        <div>tab3的内容！！！！</div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
import React, {PropType} from 'react';
import Menu, {MenuItem} from '../Menu';
import Mention from '../Mention';
import Tabs, {Tab} from '../Tabs';
import css from './mention.css';

const syncData = {
    contacts: [
        {id: 11231, name: 'fengzeyu', mail: 'fengzeyu@yifangyun.com'},
        {id: 298, name: 'huangwenping', mail: 'huangwenping@yifangyun.com'},
        {id:42340, name: 'liaohui', mail: 'liaohui@yifangyun.com'},
        {id: 298, name: 'huangwenping', mail: 'huangwenping@yifangyun.com'},
        {id:42340, name: 'liaohui', mail: 'liaohui@yifangyun.com'},
        {id: 298, name: 'huangwenping', mail: 'huangwenping@yifangyun.com'},
        {id:42340, name: 'liaohui', mail: 'liaohui@yifangyun.com'},
        {id: 298, name: 'huangwenping', mail: 'huangwenping@yifangyun.com'},
        {id:42340, name: 'liaohui', mail: 'liaohui@yifangyun.com'},
        {id: 298, name: 'huangwenping', mail: 'huangwenping@yifangyun.com'},
        {id:42340, name: 'liaohui', mail: 'liaohui@yifangyun.com'},
        {id: 361, name: 'luoshuai', mail: 'luoshuai@yifangyun.com'}
    ],
    contacts_count: 4,
    departments: [],
    groups: [
        {id:14110, name:'qianduan'}
    ],
    success: true
};

const groupsKey = ['contacts', 'departments', 'groups'];

class Suggestion extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabValue: 0
        }
    }

    handleMenuChange = (e, item) => {
        e.stopPropagation();
        if (item.props.value === 'all' && item.key === 'all' && this.dataStore){
            this.props.addMention(this.dataStore);
        } else {
            this.props.addMention(item.props.value);
        }
    };

    handleTabChange = (value) => {
        this.setState({
            tabValue: value
        });
    };

    renderMenuItem(list) {
        return list.map((listItem, index) => {
            return (
                <MenuItem key={index} value={listItem.name}>
                    {listItem.name}
                    {listItem.mail ? <em>({listItem.mail})</em> : ''}
                </MenuItem>
            );
        });
    }

    render() {
        const {suggestions, addMention, query} = this.props;
        const data = suggestions.results;
        if (data && data.success) {
            const groups = [];
            let all = {group: 'all', list: []}
            groupsKey.forEach((v) => {
                if (data[v] && data[v].length > 0) {
                    groups.push({group: v, list: data[v]});
                }
                all.list = all.list.concat(data[v]);
            })

            if (all.list.length > 0){
                this.dataStore = all.list;
                if (suggestions.query === '') {
                    groups.unshift(all);

                    return (
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            useInkBar={false}
                            className="mention-container"
                        >
                            {groups.map((v, i) => {
                                return (
                                    <Tab label={v.group} key={i} value={i}>
                                        <Menu
                                            onItemSelect={this.handleMenuChange}
                                            disableAutoFocus={false}
                                            disableKeyEvent={this.state.tabValue != i}
                                            //value={v.list[0].name}
                                        >
                                            {this.renderMenuItem(v.list)}
                                        </Menu>
                                    </Tab>
                                );

                            })}
                        </Tabs>
                    );
                } else {
                    //no tab
                    return (
                        <Menu
                            onItemSelect={this.handleMenuChange}
                            disableAutoFocus={false}
                            className="mention-menu"
                        >
                            <MenuItem key="all" value="all" data-action="all">select all</MenuItem>
                            {this.renderMenuItem(all.list)}
                        </Menu>
                    )
                }

            }

            return null;
        } else {
            return null;
        }

    }
}

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    hanleChange = (e, value) => {
        this.setState({
            value
        });
    };

    requestData(query) {
        return new Promise((resolve) => {
            console.log('wait for resolve')
            setTimeout(() => {
                resolve(syncData);
            }, 1000);
        })
    }

    displayTransform(suggestions, trigger) {
        console.log(suggestions instanceof Array);
        if (typeof suggestions === 'string') {
            return trigger + suggestions + ' ';
        } else if (suggestions instanceof Array) {
            let str = '';
            suggestions.forEach((v) => {
                str += '@' + v.name + ' ';
            })
            console.log(str);
            return str;
        }
    }

    render() {
        return (
            <Mention
                data={this.requestData}
                suggestionComponent={Suggestion}
                value={this.state.value}
                onChange={this.hanleChange}
                displayTransform={this.displayTransform}
            />
        )

    }
}
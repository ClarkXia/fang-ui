import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'
import Button from './Button/Button'
import Dialog from './Dialog/Dialog'
import Tooltip from './Tooltip/Tooltip'
import Avatar from './Avatar/Avatar'
import Badge from './Badge/Badge'
import Tabs from './Tabs/Tabs'
import Tab from './Tabs/Tab'
import Pagination from './Pagination/Pagination'
import Notification from './Notification/Notification'
import Checkbox from './Checkbox/Checkbox'
import Tree from './Tree/Tree'
import TreeNode from './Tree/TreeNode'
import Modal from './Modal/Modal'
import layer from './Modal/layer'
import ContextMenu from './Menu/ContextMenu'
import MenuItem from './Menu/MenuItem'
import SubMenu from './Menu/SubMenu'
import Menu from './Menu/Menu'
import EnableContextMenu from './Menu/EnableContextMenu'
import Popover from './Popover/Popover';
import Select from './Select/Select';
import Input from './Input/Input';


import SampleAvatar from './example/avatar';
import SampleBadge from './example/badge';
import SampleButton from './example/button';
import SampleCheckbox from './example/checkbox';
import SampleDialog from './example/dialog';
import SampleIcon from './example/icon';
import SampleInput from './example/input';
import SampleContextMenu from './example/contextmenu';
import SampleMenu from './example/menu';
import SampleSearch from './example/search';
import SampleMultiSelect from './example/select';
import SampleTab from './example/tabs';
import SampleTooltip from './example/tooltip';
import SampleTree from './example/tree';
import SamplePagination from './example/pagination';
import SampleMessage from './example/notification';
import SampleModal from './example/modal';
import SampleMention from './example/mention';
import SampleDropDown from './example/dropdown';
import SyncMention from './example/mention-sync';
import SampleTextField from './example/text-field';
import SampleBreadcrumb from './example/breadcrumb';
import SampleEllipsis from './example/ellipsis';
import SampleTags from './example/tags';

import * as A from './utils/treeUtils'

const style = {
    marginLeft: 12
}

const notification = Notification.newInstance({
    prefixCls: 'notification',
    style: {
        top: 30,
        right: 0
    }
})

let renderArr = [];
for (let i=0; i < 500; i++) {
    renderArr.push(i + '');
}

class List extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selected: []
        };
    }

    handleSelect = (e) => {
        const value = e.currentTarget.getAttribute('data-index') + '';
        const index = this.state.selected.indexOf(value);
        console.log(value);
        const copyList = [...this.state.selected];
        if (index > -1) {

            copyList.splice(index, 1);

        } else {
            copyList.push(value);
        }

        console.log(copyList);

        this.setState({
            selected: copyList
        });
    }

    render() {
        return (
            <ul>
                {renderArr.map((v) => {
                    const checked = this.state.selected.indexOf(v) > -1;
                    return <li key={v} onClick={this.handleSelect} data-index={v}><Checkbox checked={checked} />{v}</li>
                })}
            </ul>
        )
    }
}

class TestComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('did mount');
    }

    componentWillUnmount() {
        console.log('did unmount');
    }

    handleClick = (e) => {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
    };

    render() {

        return (
            <div>
                <SampleAvatar />
                <SampleBadge />
                <SampleButton />
                <SampleCheckbox />
                <SampleIcon />
                <SampleInput />
                <SampleMention />
                <SyncMention />
                <SampleTextField />
                <SampleBreadcrumb />
                <SampleEllipsis />
                <SampleContextMenu />
                <SampleMenu />
                <SampleDropDown />
                <SampleSearch />
                <SampleTab />
                <SampleTree />
                <SampleTooltip />
                <SamplePagination />
                <SampleMultiSelect />
                <SampleMessage />
                <SampleModal />
                <SampleDialog />

                <SampleTags />
            </div>
        )
    }
}


render(
    <TestComponent />,
    document.getElementById('app')
)
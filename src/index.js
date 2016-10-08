import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'
import Button from './Button/Button'
import Dialog from './Dialog/Dialog'
import Tooltip from './Tooltip/Tooltip'
import Avatar from './Avatar/Avatar'
import Badge from './Badge/Badge'
import Tag from './Tag/Tag'
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


                <Tag onClick={this.handleClick}>
                    标签1
                </Tag>
                <Tag onClose={() => alert('do something to delete tag')}>
                    标签2
                </Tag>
            </div>
        )
    }
}


render(
    <TestComponent />,
    document.getElementById('app')
)
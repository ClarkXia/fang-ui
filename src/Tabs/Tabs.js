import React, {PropTypes} from 'react';
import InkBar from './InkBar';
import tabs from './tabs.css';

class TabTemplate extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        selected: PropTypes.bool
    };

    render() {
        const styles = {
            width: '100%',
            position: 'relative'
        }

        if (!this.props.selected) {
            styles.height = 0;
            styles.overflow = 'hidden';
        }

        return (
            <div style={styles}>
                {this.props.children}
            </div>
        );
    }
}

export default class Tabs extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedIndex: 0
        }
    }

    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        prefixCls: PropTypes.string,
        contentClassName: PropTypes.string,
        contentStyle: PropTypes.object,
        initIndex: PropTypes.number,
        inkBarStyle: PropTypes.object,
        onChange: PropTypes.func,
        style: PropTypes.object,
        tabContainerStyle: PropTypes.object,
        tabTemplate: PropTypes.func,
        value: PropTypes.any
    };

    static defaultProps = {
        prefixCls: 'tabs',
        initIndex: 0,
        onChange: () => {}
    };

    componentWillMount() {
        this.setState({
            selectedIndex: this.props.value !== undefined ?
                this.getSelectedIndex(this.props) :
                this.props.initIndex < this.getTabCount() ?
                this.props.initIndex : 0
        })
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        if (nextProps.value !== undefined) {
            newState.selectedIndex = this.getSelectedIndex(nextProps);
        }

        this.setState(newState);
    }

    getTabs() {
        const tabs = [];
        React.Children.forEach(this.props.children, (tab) => {
            if (React.isValidElement(tab)) {
                tabs.push(tab);
            }
        });

        return tabs;
    }

    getTabCount() {
        return this.getTabs().length;
    }

    getSelectedIndex(props) {
        let selectedIndex = -1;
        this.getTabs().forEach((tab, index) => {
            if (props.value === tab.props.value) {
                selectedIndex = index;
            }
        });

        return selectedIndex;
    }

    checkSelected(tab, index) {
        return this.props.value ? this.props.value === tab.props.value : this.state.selectedIndex === index;
    }

    handleClick = (value, event, tab) => {
        const index = tab.props.index;

        if ((this.props.value && this.props.value !== value) ||
            this.state.selectedIndex !== index) {
            this.props.onChange(value, event, tab);
        }

        this.setState({selectedIndex: index});

        if (tab.props.onActive) {
            tab.props.onActive(tab);
        }
    };

    render() {
        const {
            children,
            className = '',
            prefixCls,
            contentClassName = '',
            contentStyle,
            initIndex,
            inkBarStyle,
            style,
            tabContainerStyle,
            tabTemplate,
            ...other
        } = this.props;

        const tabContent = [];
        const width = 100 / this.getTabCount();
        let selectedIndex = this.state.selectedIndex;
        const tabs = this.getTabs().map((tab, index) => {
            const selected = this.checkSelected(tab, index);
            tabContent.push(tab.props.children ?
                React.createElement(tabTemplate || TabTemplate, {
                    key: index,
                    selected: selected
                }, tab.props.children) : undefined
            );
            if (selected) selectedIndex = index;
            return React.cloneElement(tab, {
                key: index,
                index: index,
                selected: selected,
                width: `${width}%`,
                onClick: this.handleClick,
                prefixCls
            });
        })

        const inkBar = selectedIndex !== -1 ? (
            <InkBar
                left={`${width * selectedIndex}%`}
                width={`${width}%`}
                style={inkBarStyle}
            />
        ) : null;

        const inkBarContainerWidth = tabContainerStyle ? tabContainerStyle.width : '100%';

        return (
            <div {...other} className={`${className} ${prefixCls}-wrapper`} style={Object.assign({}, style)}>
                <div className={`${prefixCls}-tab-container`} style={Object.assign({}, tabContainerStyle)}>
                    {tabs}
                </div>
                <div className={`${prefixCls}-inkbar-container`} style={{width: inkBarContainerWidth}}>
                    {inkBar}
                </div>
                <div style={Object.assign({}, contentStyle)} className={`${contentClassName} ${prefixCls}-content`}>
                    {tabContent}
                </div>
            </div>
        );
    }
}
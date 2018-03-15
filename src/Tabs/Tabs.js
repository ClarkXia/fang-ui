import React from 'react';
import PropTypes from 'prop-types';
import InkBar from './InkBar';
import classNames from 'classnames';

const TabTemplate = (props) => {
    const {selected, prefixCls, children} = props;
    const cls = classNames({
        [`${prefixCls}-content-item`]: true,
        [`${prefixCls}-content-item-active`]: selected
    });
    return (
        <div className={cls}>
            {children}
        </div>
    );
};

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
        useInkBar: PropTypes.bool,
        value: PropTypes.any
    };

    static defaultProps = {
        prefixCls: 'tabs',
        initIndex: 0,
        useInkBar: false,
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
            const changeValue = value === undefined ? index : value;
            this.props.onChange(changeValue, event, tab);
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
            useInkBar,
            style,
            tabContainerStyle,
            tabTemplate,
            onChange,
            ...other
        } = this.props;

        const tabContent = [];
        const width = 100 / this.getTabCount();
        let selectedIndex = this.state.selectedIndex;
        const tabs = this.getTabs().map((tab, index) => {

            const selected = this.checkSelected(tab, index);
            tabContent.push(tab.props.children ?
                React.createElement(tabTemplate || TabTemplate, {
                    key: tab.key || index,
                    selected: selected,
                    prefixCls
                }, tab.props.children) : undefined
            );
            if (selected) selectedIndex = index;

            let tabProps = {
                key: tab.key || index,
                index: index,
                selected: selected,
                onClick: this.handleClick,
                prefixCls
            };

            if (useInkBar) {
                tabProps.width = `${width}%`;
            }
            return React.cloneElement(tab, tabProps);
        });

        let inkBar;
        let inkBarContainerWidth;
        if (useInkBar) {
            inkBar = selectedIndex !== -1 ? (
                <InkBar
                    left={`${width * selectedIndex}%`}
                    width={`${width}%`}
                    style={inkBarStyle}
                />
            ) : null;

            inkBarContainerWidth = tabContainerStyle ? tabContainerStyle.width : '100%';
        }

        const cls = classNames({
            [className]: !!className,
            [`${prefixCls}-wrapper`]: true
        });

        const contentCls = classNames({
            [contentClassName]: !!contentClassName,
            [`${prefixCls}-content`]: true
        });

        return (
            <div {...other} className={cls} style={Object.assign({}, style)}>
                <div className={`${prefixCls}-tab-container`} style={Object.assign({}, tabContainerStyle)}>
                    {tabs}
                </div>
                {useInkBar ?
                    <div className={`${prefixCls}-inkbar-container`} style={{width: inkBarContainerWidth}}>
                        {inkBar}
                    </div> : null}
                <div style={Object.assign({}, contentStyle)} className={contentCls}>
                    {tabContent}
                </div>
            </div>
        );
    }
}
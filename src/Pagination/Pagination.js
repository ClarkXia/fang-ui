import React, {PropTypes} from 'react';

const noop = () => {};

const Pager = (props) => {
    const prefixCls = `${props.rootPrefixCls}-item`;
    let cls = `${prefixCls} ${prefixCls}-${props.page}`;

    if (props.active) {
        cls = `${cls} ${prefixCls}-active`;
    }

    return (
        <li title={props.page} className={cls} onClick={props.onClick}>
            <a>{props.page}</a>
        </li>
    );
}

const Ellipsis = (props) => {
    return (
        <li className={`${props.rootPrefixCls}-ellipsis`}>
            <span>...</span>
        </li>
    );
}

export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: props.current ? props.current : props.defaultCurrent,
            pageSize: props.pageSize ? props.pageSize : props.defaultPageSize
        }
    }

    static propTypes = {
        current: PropTypes.number,
        defaultCurrent: PropTypes.number,
        total: PropTypes.number,
        pageSize: PropTypes.number,
        defaultPageSize: PropTypes.number,
        onChange: PropTypes.func,
        showTotal: PropTypes.func,
        prefixCls: PropTypes.string,
        nextBtn: PropTypes.any,
        ellipsisComponent: PropTypes.func,
        prevBtn: PropTypes.any
    };

    static defaultProps = {
        defaultCurrent: 1,
        total: 0,
        defaultPageSize: 10,
        onChange: noop,
        prefixCls: 'pagination',
        ellipsisComponent: Ellipsis,
        btnNext: 'next',
        btnPrev: 'prev'
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.current) this.setState({current: nextProps.current});

        if (nextProps.pageSize) {
            const newState = {};

            if (!nextProps.current) {
                let current = this.state.current;
                const newCurrent = this.calcPage(nextProps.pageSize);
                current = current > newCurrent ? newCurrent : current;
                newState.current = current;
            }

            newState.pageSize = nextProps.pageSize;
            this.setState(newState);
        }
    }

    calcPage(p) {
        let pageSize = p;
        if (typeof pageSize === 'undefined') {
            pageSize = this.state.pageSize;
        }

        return Math.floor((this.props.total - 1) / pageSize) + 1;
    }

    isValid(page) {
        return typeof page === 'number' && page >= 1 && page !== this.state.current;
    }

    //TODO support key event

    /*changePageSize(size) {
        let current = this.state.current;
        const newCurrent = this.calcPage(size);
        current = current > newCurrent ? newCurrent : current;

        if (typeof size === 'number') {
            if (!this.props.pageSize) this.setState({pageSize: size});
            if (!this.props.current) this.setState({current: current});
        }

        this.props.onShowSizeChange(current, size);
    }*/

    handleChange(p) {
        let page = p;
        if (this.isValid(page)) {
            if (page > this.calcPage()) {
                page = this.calcPage();
            }

            if (!this.props.current) {
                this.setState({current: page});
            }

            this.props.onChange(page);
            return page;
        }
        return this.state.current;
    }

    prev = () => {
        if (this.hasPrev()) {
            this.handleChange(this.state.current - 1);
        }
    }

    next = () => {
        if (this.hasNext()) {
            this.handleChange(this.state.current + 1);
        }
    }

    hasPrev = () => {
        return this.state.current > 1;
    }

    hasNext = () => {
        return this.state.current < this.calcPage();
    }

    render() {
        const {prefixCls, showTotal, total, className='', btnNext, btnPrev, ellipsisComponent} = this.props;
        const allPages = this.calcPage();
        const pagerList = [];
        const EllipsisItem = ellipsisComponent;
        let omission =null;

        if (allPages <= 9) {
            for (let i = 1; i <= allPages; i++) {
                pagerList.push(
                    <Pager
                        rootPrefixCls={prefixCls}
                        onClick={() => {this.handleChange(i)}}
                        key={i}
                        page={i}
                        active={this.state.current === i}
                    />
                );
            }
        } else {
            const current = this.state.current;
            let left = Math.max(1, current - 2);
            let right = Math.min(current + 2, allPages);

            if (current - 1 <= 2) {
                right = 1 + 4;
            }

            if (allPages - current <= 2) {
                left = allPages - 4;
            }

            for (let i = left; i <= right; i++) {
                pagerList.push(
                    <Pager
                        rootPrefixCls={prefixCls}
                        onClick={() => {this.handleChange(i)}}
                        key={i}
                        page={i}
                        active={this.state.current === i}
                    />
                );
            }

            if (current - 1 >= 4) {
                pagerList.unshift(<EllipsisItem rootPrefixCls={prefixCls} key="before"/>);
            }

            if (allPages - current >=4) {
                pagerList.push(<EllipsisItem rootPrefixCls={prefixCls} key="after"/>);
            }

            if (left !== 1) {
                pagerList.unshift(
                    <Pager
                        rootPrefixCls={prefixCls}
                        onClick={() => {this.handleChange(1)}}
                        key={1}
                        page={1}
                        active={false}
                    />
                )
            }

            if (right !== allPages) {
                pagerList.push(
                    <Pager
                        rootPrefixCls={prefixCls}
                        onClick={() => {this.handleChange(allPages)}}
                        key={allPages}
                        page={allPages}
                        active={false}
                    />
                );
            }
        }

        let totalText = null;
        if (showTotal) {
            totalText = <span className={`${prefixCls}-total-text`}>{showTotal(total)}</span>;
        }
        return (
            <ul className={`${prefixCls} ${className}`}>
                {totalText}
                <li onClick={this.prev} className={(this.hasPrev() ? '' : `${prefixCls}-disabled `) + `${prefixCls}-prev`}>
                    <a>{btnPrev}</a>
                </li>
                {pagerList}
                <li onClick={this.next} className={(this.hasNext() ? '' : `${prefixCls}-disabled `) + `${prefixCls}-next`}>
                    <a>{btnNext}</a>
                </li>
            </ul>
        );
    }
}
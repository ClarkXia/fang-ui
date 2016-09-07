import React from 'react';
import Pagination from '../Pagination';
import css from './pagination.css';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage : 1
        };
    }

    handleOnChange = (page) => {
        console.log(page);
        this.setState({
            currentPage: page
        });
    };

    render() {
        const btnNext = <span>下一页</span>;
        const btnPrev = <span>上一页</span>;

        return (
            <div>
                <div><span>uncontrolled</span></div>
                <div>
                    <Pagination total={100} pageSize={5} onChange={(...args) => {console.log(args)}}/>
                </div>

                <div>
                    <div><span>controlled</span></div>
                    <Pagination
                        total={50}
                        pageSize={5}
                        current={this.state.currentPage}
                        onChange={this.handleOnChange}
                        btnNext={btnNext}
                        btnPrev={btnPrev}
                    />
                </div>
            </div>
        );
    }
}
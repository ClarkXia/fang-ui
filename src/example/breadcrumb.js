import React from 'react';
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb';
import css from './breadcrumb.css';
let index = 1;
export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: [
                'Home','route A', 'route B', 'route C', 'route D', 'route E'
            ]
        }
    }

    handleChangeRoute = (flag) => {
        const arr = [...this.state.route];
        if (flag) {
            arr.push('route ' + index);
            index++;
        } else {
            arr.pop();
        }
        this.setState({
            route: [...arr]
        });
    }


    render() {
        return (
            <div>
                <a onClick={() => {this.handleChangeRoute(true)}}>add</a><br/>
                <a onClick={() => {this.handleChangeRoute()}}>decrease</a>
                <Breadcrumb separator=">" maxWidth={550} itemMinWidth={50}>
                    {this.state.route.map((item, i) => {
                        return <BreadcrumbItem key={i}>{item}</BreadcrumbItem>;
                    })}
                </Breadcrumb>
            </div>
        );
    }
}
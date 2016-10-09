import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import TagEditor from '../TagEditor';
import Dialog from '../Dialog';
import Select from '../Select';
import Button from '../Button';
import css from './tags.css';

class TagManage extends React.Component {
    static defaultProps = {
        defaultClose: true,
        title: 'manage tags',
        maxNum: 10,
        labelKey: 'name',
        tags: [],
        myTags: [],
        onClose: () => {}
    };

    constructor(props) {
        super(props);
        this.state = {
            //dialogOpen: true,
            currentTags: [...this.props.tags]
        };

        this.addList = [];
        this.removeList = [];
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.open !== nextProps.open && nextProps.open) {
            //reset
            this.setState({
                currentTags: [...nextProps.tags]
            });
            this.addList = [];
            this.removeList = [];
        }
    }

    handleDialogClose = (e) => {
        if (this.props.onClose) {
            this.props.onClose(e);
        }

        this.props.onClose();
        /*this.setState({
            dialogOpen: false
        });*/
    };

    handleSaveTags = (e) => {

        const {tags} = this.props;
        console.log(this.addList);
        console.log(this.removeList);

        if (this.props.onAdd) {
            this.props.onAdd(this.addList);
        }
        if (this.props.onRemove) {
            this.props.onRemove(this.removeList);
        }
        if (this.props.defaultClose) {
            setTimeout(() => {
                /*this.setState({
                    dialogOpen: false
                });*/

                this.props.onClose();
            });
        }
    };

    renderActions() {
        return [
            <Button onClick={this.handleDialogClose}>cancel</Button>,
            <Button onClick={this.handleSaveTags}>save</Button>
        ]
    }

    getValue(value) {
        return typeof value === 'string' ? value : value[this.props.labelKey];
    }

    handleSelectChange = (value) => {
        const tagLength = value.length;
        if (tagLength > 10) return;

        if (tagLength > this.state.currentTags.length) {
            const addValue = value[tagLength - 1];

            addValue.isNew = true;
            const valueStr =  this.getValue(addValue);
            for (let i = 0, l = this.state.currentTags.length; i < l; i++) {
                if (valueStr === this.getValue(this.state.currentTags[i])) {
                    return;
                }
            }
            this.addList.push(valueStr);
        }

        this.setState({
            currentTags: value
        });
    };

    handleRemoveTag = (value) => {
        if (!value.isNew) {
            this.removeList.push(value);
        } else {
            const valueStr = this.getValue(value);
            this.addList = this.addList.filter((v) => {
                return valueStr !== this.getValue(v);
            });
        }
    };

    addTag = (value) => {
        const newValue = [...this.state.currentTags, value];
        this.handleSelectChange(newValue);
    };

    render() {
        return (
            <Dialog
                open={this.props.open}
                modal={true}
                title={this.props.title}
                actions={this.renderActions()}
                autoDetectWindowHeight={false}
                repositionOnUpdate={true}
                onClose={this.handleDialogClose}
                className="tag-dialog"
            >
                <div className="label"><b>标签</b><span>最多添加10个标签，多标签时用ENTER分隔</span></div>
                <TagEditor
                    value={this.state.currentTags}
                    filterOptions={false}
                    onChange={this.handleSelectChange}
                    autosize={true}
                    labelKey="name"
                    onRemove={this.handleRemoveTag}
                    backspaceRemove={false}
                />
                <div className="recent-tags">
                    <dl>
                        <dt>我最近用过的标签：</dt>
                        <dd className="my-tags">
                            {this.props.myTags.map((value, i) => {
                                return <span className="tag" key={i} onClick={(event) => {this.addTag(value, event)}}>{this.getValue(value)}</span>;
                            })}
                        </dd>
                    </dl>
                </div>
            </Dialog>
        );
    }
}


//usage
export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleClick = () => {
        this.setState({
            open: true
        });
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    render() {
        const tags = [{id: 1, name: 'abc'},
                {id: 2, name: 'abce'},
                {id: 3, name: 'abcd'},
                {id: 4, name: 'abcf'}];
        const myTags = [{id: 5, name: 'adfa'},
                {id: 6, name: 'czcz'},
                {id: 7, name: 'qerqwe'},
                {id: 8, name: 'vxxzz'},
                {id: 9, name: 'vczxz'},
                {id: 10, name: 'ad'}];

        return (
            <div>
                <Button onClick={this.handleClick}>show tags</Button>
                <TagManage
                    open={this.state.open}
                    tags={tags}
                    myTags={myTags}
                    onClose={this.handleClose}
                />
            </div>

        );
    }
}


import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Popover from '../Popover';

export default class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            left: 0,
            top: 0
        };
        this._display = true;
    }

    static propTypes = {
        prefixCls: PropTypes.string,
        visible: PropTypes.bool,
        inline: PropTypes.bool
    };

    static defaultProps = {
        prefixCls: 'context-menu',
        onContextMenu: (e) => {
            e.preventDefault();
        }
    };

    componentWillReceiveProps(nextProps) {
        //if (this.props.visible !== nextProps.visible) {
            if (nextProps.visible) {
                if (this.props.x != nextProps.x || this.props.y != nextProps.y) {
                    this._display = false;
                    this.timer = setTimeout(() => {
                        this.showMenu(nextProps);
                    })
                } else {
                    this._display = true;
                }
            } else {
                this._display = false;
            }
        //}
    }

    componentDidMount() {
        if (this.props.visible) {
            this.showMenu(this.props);
        }
    }

    componentWillUnmount() {
        if (this.timer) clearTimeout(this.timer);

        /*if (this.menu && this.menu.parentNode) {
            this.menu.parentNode.removeEventListener('contextmenu', this.hideMenu);
        }*/
    }

    /*hideMenu = (e) => {
        e.preventDefault();
        if (this.menu && this.menu.parentNode) {
            this.menu.parentNode.removeEventListener('contextmenu', this.hideMenu);
        }
    };*/

    showMenu = (props) => {
        this._display = true;
        this.setState(this.getMenuPosition(props.x, props.y));
        /*if (this.menu && this.menu.parentNode) {
            this.menu.parentNode.addEventListener('contextmenu', this.hideMenu);
        }*/
    };

    handleContextMenu = (e) => {
        this.props.onContextMenu(e);
    };

    getMenuPosition = (x, y) => {
        let docST = document.body.scrollTop || document.documentElement.scrollTop,
            docSL = document.body.scrollLeft || document.documentElement.scrollLeft;
        return {left: x + docSL, top: y + docST};
    };

    render() {
        const {visible, children, prefixCls, style} = this.props;
        const displayStyle = {
            display: visible ? 'block' : 'none',
            opacity: this._display ? 1 : 0
        }

        let popProps = {
            open: this.props.visible,
            useLayerForClickAway: false,
            canAutoPosition: false,
            position : {
                ...this.state,
                collision: 'flip'
            },
            style: Object.assign({}, displayStyle)
        };
        if (this.props.inline) {
            popProps.inline = true;
        }
        return (
            <Popover {...popProps}>
                <ul ref={(c) => (this.menu = c)} style={Object.assign({}, style)} className={prefixCls} onContextMenu={this.handleContextMenu}>
                    {children}
                </ul>
            </Popover>
        );
    }
}

ContextMenu.isContextMenu = true;
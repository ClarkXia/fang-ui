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
    }

    static propTypes = {
        prefixCls: PropTypes.string,
        visible: PropTypes.bool,
        inline: PropTypes.bool,
        useLayerForClickAway: PropTypes.bool
    };

    static defaultProps = {
        prefixCls: 'context-menu',
        useLayerForClickAway: false,
        onContextMenu: (e) => {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    componentWillReceiveProps(nextProps) {
        //if (this.props.visible !== nextProps.visible) {
            if (nextProps.visible) {
                if (this.props.x != nextProps.x || this.props.y != nextProps.y) {
                    this.showMenu(nextProps);
                }
            }
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
        const {visible, children, prefixCls, style, useLayerForClickAway} = this.props;
        let popProps = {
            open: this.props.visible,
            useLayerForClickAway,
            canAutoPosition: false,
            position : {
                ...this.state,
                collision: 'flip'
            }
        };

        if (this.props.inline) {
            popProps.inline = true;
        }
        //TODO use createElement
        return (
            <Popover {...popProps}>
                <div ref={(c) => (this.menu = c)} style={Object.assign({}, style)} className={prefixCls} onContextMenu={this.handleContextMenu}>
                    {children}
                </div>
            </Popover>
        );
    }
}

ContextMenu.isContextMenu = true;
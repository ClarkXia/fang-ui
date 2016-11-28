import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import Overlay from '../internal/Overlay';
import RenderToLayer from '../internal/RenderToLayer';

const noop = () => {};

const rootStyle = (open) => {
    return {
        position: 'fixed',
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        zIndex: 100,
        width: '100%',
        height: '100%',
        left: open? 0 : -10000,
        top: 0
    }
};
export class DialogInline extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        actions: PropTypes.node,
        actionsContainerClassName: PropTypes.string,
        actionsContainerStyle: PropTypes.object,
        repositionOnUpdate: PropTypes.bool,
        autoDetectWindowHeight: PropTypes.bool,
        autoScrollBodyContent: PropTypes.bool,
        contentClassName: PropTypes.string,
        contentStyle: PropTypes.object,
        open: PropTypes.bool.isRequired,
        overlayStyle: PropTypes.object,
        overlayClassName: PropTypes.string,
        onClose: PropTypes.func,
        modal: PropTypes.bool,
        title: PropTypes.node,
        titleClassName: PropTypes.string,
        titleStyle: PropTypes.object,
        closable: PropTypes.bool,
        scrollLock: PropTypes.bool
    };

    static defaultProps = {
        prefixCls: 'dialog',
        titleStyle: {},
        closable: true
    };

    componentDidMount() {
        this.positionDialog();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        this.positionDialog();
    }

    requestClose(clicked) {
        if (!clicked && this.props.modal) {
            return;
        }
        if (this.props.onClose) {
            this.props.onClose(!!clicked);
        }
    }

    positionDialog() {
        const {
            autoScrollBodyContent,
            autoDetectWindowHeight,
            repositionOnUpdate,
            open,
            actions,
            title
        } = this.props;

        if (!open) return;

        const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const container = findDOMNode(this);
        const dialogWrap = findDOMNode(this.refs.dialogWrap);
        const dialogBody = findDOMNode(this.refs.dialogBody);
        const dialogWrapHeight = dialogWrap.offsetHeight;

        const minPaddingTop = 16;

        //rest style
        dialogBody.style.height = '';
        let paddingTop = ((clientHeight - dialogWrapHeight) / 2) - 64;
        if (paddingTop < minPaddingTop) paddingTop = minPaddingTop;

        if (repositionOnUpdate || !container.style.paddingTop) {
            container.style.paddingTop = `${paddingTop}px`;
        }

        // Force a height if the dialog is taller than clientHeight
        if (autoDetectWindowHeight || autoScrollBodyContent) {
            let maxDialogContentHeight = clientHeight - 2 * 64;

            if (title) maxDialogContentHeight -= dialogBody.previousSibling.offsetHeight;

            if (React.Children.count(actions)) {
                maxDialogContentHeight -= dialogBody.nextSibling.offsetHeight;
            }

            dialogBody.style.maxHeight = `${maxDialogContentHeight}px`;
        }

    }

    handleKeyUp = (event) => {
        //press esc
    };

    handleResize = () => {
        this.positionDialog();
    };

    handleClickOverlay = () => {
        this.requestClose(false);
    };

    handleClose = () => {
        this.requestClose(true);
    }

    render() {
        const {
            prefixCls,
            actions,
            className,
            open,
            title,
            titleClassName,
            titleStyle,
            overlayStyle,
            closable,
            closeTitle,
            style,
            overlayClassName} = this.props;

        const actionsContainer = React.Children.count(actions) > 0 && (
            <div className={`${prefixCls}-actions`}>
                {React.Children.toArray(actions)}
            </div>
        );
        let titleElement = title;
        if (React.isValidElement(title)) {
            titleElement = React.cloneElement(title, {
                className: title.props.className || titleClassName,
                style: Object.assign(titleStyle, title.props.style)
            });
        } else if (typeof title === 'string') {
            titleElement = <div className={`${prefixCls}-header`}>
                                <div className={`${prefixCls}-title`}>
                                    {title}
                                </div>
                            </div>;
        }
        let closer = null;
        if (closable) {
            const titleProp = {};
            if (closeTitle) {
                titleProp.title = closeTitle;
            }

            closer = (
                <div
                    onClick={this.handleClose}
                    className={`${prefixCls}-close`}
                    {...titleProp}
                >
                    <span className={`${prefixCls}-close-x`} dangerouslySetInnerHTML={{ __html: '&times;' }} />
                </div>
            )
        }

        const cls = classNames({
            [prefixCls]: true,
            [className]: !!className
        });

        return (
            <div className={cls} style={Object.assign({}, rootStyle(open), style)}>
                <Overlay
                    show={open}
                    className={overlayClassName}
                    style={overlayStyle}
                    onClick={this.handleClickOverlay}
                    scrollLock={!!this.props.scrollLock}
                />
                {open &&
                    <div className={`${prefixCls}-wrap`} ref="dialogWrap">
                        <div className={`${prefixCls}-content`} ref="dialogContent">
                            {closer}
                            {titleElement}
                            <div className={`${prefixCls}-body`} ref="dialogBody">
                                {this.props.children}
                            </div>
                            {actionsContainer}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default class Dialog extends React.Component {
    renderLayer = () => {
        return <DialogInline {...this.props} />
    }
    render(){
        return <RenderToLayer render={this.renderLayer} open={true} useLayerForClickAway={false} />
    }
}
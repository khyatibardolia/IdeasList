import React from "react";
import EditableItem from "./EditableItem";

const TreeNode = (props: any) => {
    const {children, addNew, ...otherProps} = props;
    const hasChildren = children !== undefined;

    const renderChildren = (children: any) => {
        return (
            <ul>
                {children && Object.keys(children).map((key: any) => {
                    const {...others} = children[key];
                    return (
                        <TreeNode
                            key={key}
                            {...others}
                        />
                    );

                })}
            </ul>
        );
    };

    return (
        <>
            {props.title || addNew ? (
                <li className={'mx-3'}>
                    <div className="TreeNode">
                        <EditableItem {...otherProps} />
                    </div>
                </li>
            ) : null}
            {hasChildren && renderChildren(children)}
        </>
    );
};

export default (TreeNode);
import React from "react";
import EditableItem from "./EditableItem";

const TreeNode = (props: any) => {
    const {children, ...otherProps} = props;
    const hasChildren = children !== undefined;

    const renderChildren = (children: any) => {
        return (
            <>
                {children && Object.keys(children).map((key: any, index: any) => {
                    const {id, ...others} = children[key];
                    return (
                        <TreeNode
                            key={`${id}of${index}`}
                            id={id}
                            {...others}
                            addNew={true}
                        />
                    );

                })}
            </>
        );
    };

    return (
        <ul>
            <li className={'mx-3'}>
                <EditableItem {...otherProps} />
            </li>
            {hasChildren && renderChildren(children)}
        </ul>
    );
};

export default (TreeNode);

import React from "react";
import EditableItem from "./EditableItem";

const TreeNode = (props: any) => {
    const {children, addNew, ...otherProps} = props;
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
            {props.title || addNew ? (
                <li className={'mx-3'}>
                    <div className="TreeNode">
                        <EditableItem {...otherProps} />
                    </div>
                </li>
            ) : null}
            {hasChildren && renderChildren(children)}
        </ul>
    );
};

export default (TreeNode);

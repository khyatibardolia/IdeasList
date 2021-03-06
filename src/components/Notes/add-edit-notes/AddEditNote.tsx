import {Navigation} from '../../common/hoc/Navigation';
import React, {useEffect, useState} from "react";
import TreeNode from "./TreeNode";
import {addNoteDocument} from "../../../service/firebase/firebase";
import {useDispatch} from "react-redux";

const AddEditNote = () => {
    const [nodes, setNodes] = useState([]);
    useEffect(() => {
        addRootElement()
    }, []);

    const initializedNodes = (nodes: any, location?: any): any => {
        const nodesCopy = [];
        console.log('initializedNodes', nodes)
        for (let i = 0; i < nodes.length; i++) {
            const {children, title} = nodes[i];
            const hasChildren = children !== undefined;
            const id = location ? `${location}.${i + 1}` : `${i + 1}`;
            nodesCopy[i] = {
                children: hasChildren ? initializedNodes(children, id) : undefined,
                changeTitle: changeTitle(id),
                removeNode: removeNode(id),
                addChild: addChild(id),
                id,
                title,
            };
        }
        console.log('nodesCopy', nodesCopy)
        return nodesCopy;
    }
    const changeTitle = (id: any) => {
        return (newTitle: any) => {
            id = id.split(".").map((str: any) => parseInt(str));
            const allNodes = initializedNodes(nodes);
            let changingNode = allNodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            changingNode.title = newTitle;
            setNodes(allNodes)
        };
    }

    const addRootElement = () => {
        const id = nodes.length ? `${nodes.length + 1}` : "1";
        const newNode = {
            children: undefined,
            changeTitle: changeTitle(id),
            removeNode: removeNode(id),
            addChild: addChild(id),
            id,
            title: "",
        };
        setNodes((prev: any): any => {
            return [...prev, newNode];
        })
    };

    const addChild = (id: any) => {
        return () => {
            console.log('add child called', id);
            console.log('addChild nodes initial state', nodes);
            id = id.split(".").map((str: any) => parseInt(str));
            const allNodes = initializedNodes(nodes);
            let changingNode = allNodes && allNodes[id[0] - 1];

            console.log('changingNode', changingNode)
            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode && changingNode.children[id[i] - 1];
                }
            }

            if (changingNode && changingNode.children === undefined) {
                changingNode.children = [];
            }

            id = `${id.join(".")}.${changingNode?.children?.length + 1}`;

            if (changingNode) {
                changingNode.children = [
                    ...changingNode.children,
                    {
                        children: undefined,
                        changeTitle: changeTitle(id),
                        removeNode: removeNode(id),
                        addChild: addChild(id),
                        id,
                        title: "",
                    }];
                setNodes(allNodes)
            }
        }
    };

    const removeNode = (id: any) => {
        return () => {
            id = id.split(".").map((str: any) => parseInt(str));
            const allNodes = initializedNodes(nodes);

            if (id.length === 1) {
                const newNodes = [
                    ...nodes.slice(0, id[0] - 1), // ...nodes.slice(0, [id[0] - 1]),
                    ...nodes.slice(id[0])
                ];

                setNodes(() => initializedNodes(newNodes));

            } else {
                let changingNode: any = nodes[id[0] - 1];

                for (let i = 2; i < id.length; i++) {
                    changingNode = changingNode.children[id[i - 1] - 1];
                }

                const index = id[id.length - 1] - 1;

                const newChildren = [
                    ...changingNode.children.slice(0, index),
                    ...changingNode.children.slice(index + 1),
                ];
                changingNode.children = newChildren;
                setNodes(() => initializedNodes(allNodes));
            }
        }
    };
    const simplify = (nodes: any): any => {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const {children, title} = nodes[i];
            const hasChildren = children !== undefined && children.length > 0;
            nodesCopy[i] = {
                title,
                children: hasChildren ? simplify(children) : undefined,
            };
        }
        console.log('nodesCopynodesCopy', nodesCopy)
        return nodesCopy;
    }

    const dispatch = useDispatch();

     const DEFAULT_NODES = [
        {
            "title": "Tea",
            "children": [
                {
                    "title": "Black",
                    "children": [
                        {
                            "title": "Assam"
                        },
                        {
                            "title": "Earl Grey"
                        },
                        {
                            "title": "Lapsang Souchong"
                        }
                    ]
                },
                {
                    "title": "Green",
                    "children": [
                        {
                            "title": "Japanese Sencha"
                        },
                        {
                            "title": "Jasmine Pearls"
                        }
                    ]
                }
            ]
        }
    ];

    /*useEffect(() => {
        const fetchData = async () => {
            const data = await (addNoteDocument(DEFAULT_NODES));
            console.log('data', data)
            dispatch(addNoteAction(data))
        }
        fetchData()
    }, [])*/
    console.log('nodes--->>>>>', nodes)
    return (<div className={'container h-100 d-flex justify-content-center'}>
        <ul className="Nodes d-flex justify-content-center align-items-center flex-column">
            {nodes?.map((nodeProps: any) => {
                const {id, ...others} = nodeProps;
                return (
                    <TreeNode
                        addNew={true}
                        key={id}
                        {...others}
                    />
                );
            })}
        </ul>
    </div>)
};
export default Navigation(AddEditNote)

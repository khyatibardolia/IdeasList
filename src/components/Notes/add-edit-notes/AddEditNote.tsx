import {Navigation} from '../../common/hoc/Navigation';
import React, {useEffect, useState} from "react";
import TreeNode from "./TreeNode";
import {addNoteDocument} from "../../../service/firebase/firebase";
import {useDispatch} from "react-redux";
import {addNoteAction} from "../../../redux/actions/notes";
import {useHistory} from "react-router";

const AddEditNote = () => {

    const [nodes, setNodes] = useState([]);
    const history = useHistory();

    const initializedNodes = (nodes: any, location?: any):any => {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const { children, title } = nodes[i];
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
        setNodes((prevState) => ({
            ...prevState, newNode
        }));
    };

    const addChild = (id: any) => {
        return () => {
            id = id.split(".").map((str: any) => parseInt(str));
            const allNodes = initializedNodes(nodes);
            let changingNode = allNodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            if (changingNode.children === undefined) {
                changingNode.children = [];
            }

            id = `${id.join(".")}.${changingNode.children.length + 1}`;

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
                let changingNode:any = nodes[id[0] - 1];

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
    const simplify = (nodes: any):any => {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const { children, title } = nodes[i];
            const hasChildren = children !== undefined && children.length > 0;
            nodesCopy[i] = {
                title,
                children: hasChildren ? simplify(children) : undefined,
            };
        }
        console.log('nodesCopynodesCopy', nodesCopy)
        return nodesCopy;
    }

    const {location: {state}} = history;
    const addRootNode = state;
    console.log('state', state);
    const fetchData = async () => {
        const data = await(addNoteDocument([{title: ''}]));
        dispatch(addNoteAction(data))
        //addRootElement()
    }
    if(addRootNode !== '') {
        //fetchData()
    }
    const dispatch = useDispatch();
    useEffect(() => {
        console.log('add page useeffect called')

    }, []);

    /*const addChild = (id: any) => {
        console.log('add new called');
      //return(<TreeNode addNew={true}/>)
    };
*/
    return (<div className={'container h-100 d-flex justify-content-center'}>
        <ul className="Nodes d-flex justify-content-center align-items-center">
            <TreeNode addNew={true}
                      changeTitle={changeTitle}
                      addChild={addChild}
            />
        </ul>
    </div>)
};
export default Navigation(AddEditNote)

import React, {Component} from 'react';
import {Navigation} from '../../common/hoc/Navigation';
import TreeNode from './TreeNode';
import {Button, Box} from "@material-ui/core";
import {connect} from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {addNoteDocument, deleteNoteDocument, getAllNotesDocument} from "../../../service/firebase/firebase";
import {addNoteAction, deleteNoteAction, getNotesAction} from "../../../redux/actions/notes";

interface IMapStateToProps {
    singleNote?: any,
    title?: '',
    history?: any,
}

interface IMapDispatchToProps {
    addNoteAction?: (data: any) => [];
    getNotesAction?: (data: any) => [];
    deleteNoteAction?: (id: any) => [];
}
interface IState {
    nodes: any,
    singleNote: any,
    addRootNode: boolean
}

type AppProps = IMapStateToProps & RouteComponentProps & IMapDispatchToProps;


class AddEditNote extends Component<AppProps | any, IState | any> {
    constructor(props: any) {

        super(props);
        console.log('constructor proprr', props);
        this.state = {
            nodes: [],
            singleNote: [],
            addRootNode: false
        };
    }

    componentDidMount() {
        //console.log('singleNote', this.props?.singleNote)
        this.addRootElement();
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) : any {
        debugger;
        if(nextProps.singleNote !== prevState.singleNote) {
            return { singleNote: nextProps.singleNote, nodes: [] };
        }
        console.log('nextProps', nextProps);
        console.log('prevState', prevState);
       /* if(nextProps?.location.state.addRootNode !== prevState.addRootNode){
            return { addRootNode: nextProps?.location.state.addRootNode };
        }*/
        return null;
    }

   /* componentDidUpdate() {
        debugger;
        const {addRootNode} = this.state;
        if(addRootNode) {
            this.setState({addRootNode: false}, () => this.addRootElement);
        }
    }*/
    initializedNodes = (nodes: any, location?: any): any => {
        const nodesCopy = [];
        console.log('initializedNodes', nodes);
        for (let i = 0; i < nodes.length; i++) {
            const {children, title} = nodes[i];
            const hasChildren = children !== undefined;
            const id = location ? `${location}.${i + 1}` : `${i + 1}`;
            nodesCopy[i] = {
                children: hasChildren ? this.initializedNodes(children, id) : [],
                changeTitle: this.changeTitle(id),
                removeNode: this.removeNode(id),
                addChild: this.addChild(id),
                id,
                title,
            };
        }
        console.log('nodesCopy', nodesCopy);
        return nodesCopy;
    }
    changeTitle = (id: any) => {
        return (newTitle: any) => {
            const {nodes}: any = this.state;
            id = id.split('.').map((str: any) => parseInt(str));
            const allNodes = this.initializedNodes(nodes);
            let changingNode = allNodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            changingNode.title = newTitle;

            this.setState({nodes: allNodes});
        };
    }

    addRootElement = () => {
        const {nodes}: any = this.state;
        const id = nodes.length ? `${nodes.length + 1}` : '1';
        const newNode = {
            children: [],
            changeTitle: this.changeTitle(id),
            removeNode: this.removeNode(id),
            addChild: this.addChild(id),
            id,
            title: '',
        };

        this.setState({nodes: [newNode]});
    }

    addChild = (id: any) => {
        return () => {
            const {nodes}: any = this.state;
            console.log('add child called', id);
            console.log('addChild nodes initial state', nodes);
            id = id.split('.').map((str: any) => parseInt(str));
            const allNodes = this.initializedNodes(nodes);
            let changingNode = allNodes && allNodes[id[0] - 1];

            console.log('changingNode', changingNode);
            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode && changingNode.children[id[i] - 1];
                }
            }

            if (changingNode && changingNode.children === undefined) {
                changingNode.children = [];
            }

            id = `${id.join('.')}.${changingNode?.children?.length + 1}`;

            if (changingNode) {
                changingNode.children = [
                    ...changingNode.children,
                    {
                        children: [],
                        changeTitle: this.changeTitle(id),
                        removeNode: this.removeNode(id),
                        addChild: this.addChild(id),
                        id,
                        title: '',
                    },
                ];
                this.setState({nodes: allNodes});
            }
        };
    }

    removeNode = (id: any) => {
        return () => {
            const {nodes}: any = this.state;
            console.log(id);
            id = id.split('.').map((str: any) => parseInt(str));
            console.log(id);

            const allNodes = this.initializedNodes(nodes);

            console.log(nodes);

            if (id.length === 1) {
                const newNodes = [
                    ...nodes.slice(0, id[0] - 1), // ...nodes.slice(0, [id[0] - 1]),
                    ...nodes.slice(id[0]),
                ];

                this.setState({nodes: this.initializedNodes(newNodes)});
            } else {
                let changingNode: any = nodes[id[0] - 1];

                console.log('changingNode');
                console.log(changingNode);
                for (let i = 2; i < id.length; i++) {
                    changingNode = changingNode.children[id[i - 1] - 1];
                    console.log('changingNode loop');
                    console.log(changingNode);
                }

                const index = id[id.length - 1] - 1;

                const newChildren = [
                    ...changingNode.children.slice(0, index),
                    ...changingNode.children.slice(index + 1),
                ];
                console.log('newChildren');
                console.log(newChildren);
                changingNode.children = newChildren;
                this.setState({nodes: this.initializedNodes(nodes)});
            }
        };
    }

    simplify = async (nodes: any): Promise<any> => {
        debugger;
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const {children, title} = nodes[i];
            const hasChildren = children !== undefined && children.length > 0;
            console.log(hasChildren)
            console.log('children', children);

            nodesCopy[i] = {
                id: `id${i}` + (new Date()).getTime(),
                level: i,
                title,
                children: hasChildren ? this.simplify(children) : [],
            };
        }
        const data = await addNoteDocument(nodesCopy);
        this.props.addNoteAction(data);
        const data1 = await getAllNotesDocument();
        this.props.getNotesAction(data1);
        console.log('nodesCopynodesCopy', nodesCopy);
        //console.log('dataasasasas', data);
        return nodesCopy;
    }

    deleteNode = async (id: any) => {
        if(id) {
            const data = await deleteNoteDocument(id);
            this.props.deleteNoteAction(data);
            const data1 = await getAllNotesDocument();
            this.props.getNotesAction(data1);
        } else {
            this.setState({nodes: []})
        }
    };

    render() {
        const {nodes, singleNote, addRootNode}: any = this.state;
        console.log('render-->>>', addRootNode)
        const data = singleNote && Object.keys(singleNote).length ? singleNote[0]?.note : nodes
        console.log('data', data);
        console.log('nodes', nodes);
        console.log('singleNote', this.props?.singleNote)
        return (
            <>{data?.length ? <Box m={3} display={'flex'} justifyContent={'flex-end'}>
                <Button className={'mr-2'} variant="outlined" color="primary"
                        onClick={() => this.simplify(nodes)}>
                    Save
                </Button>
                <Button variant="outlined" color="primary"
                        onClick={() => this.deleteNode(singleNote && singleNote[0]?.id)}>
                    Delete
                </Button>
            </Box> : <div
                className={'w-100 vh-100 d-flex justify-content-center align-items-center'}>
                <Button variant="outlined" color="primary"
                             onClick={() => this.addRootElement}>
                Add Note
            </Button></div>}
                <div className={'container h-100 d-flex justify-content-center'}>
                    <ul className="Nodes d-flex justify-content-center align-items-center flex-column">
                        {data?.map((nodeProps: any, index: any) => {
                            const {id, ...others} = nodeProps;
                            return <TreeNode addNew={true} key={`${id}of${index}`} id={id} {...others} />;
                        })}
                    </ul>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state: any): any => ({
    singleNote: state?.notes?.singleNote,
});

const mapDispatchToProps = (dispatch: any): any => ({
    addNoteAction: (values: any) => dispatch(addNoteAction(values)),
    deleteNoteAction: (id: any) => dispatch(deleteNoteAction(id)),
    getNotesAction: (values: any) => dispatch(getNotesAction(values)),
});
//export default withRouter<IMapStateToProps>(connect(mapStateToProps, mapDispatchToProps)(Navigation(AddEditNote)));
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Navigation(AddEditNote)));

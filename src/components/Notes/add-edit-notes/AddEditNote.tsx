import React, {Component} from 'react';
import {Navigation} from '../../common/hoc/Navigation';
import TreeNode from './TreeNode';
import {Button, Box} from "@material-ui/core";
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import * as routes from '../../../constants/routes';
import {
    addNoteDocument,
    deleteNoteDocument,
    getAllNotesDocument, updateNoteDocument
} from "../../../service/firebase/firebase";
import {addNoteAction, deleteNoteAction, getNotesAction, updateNoteAction} from "../../../redux/actions/notes";
import {toast} from 'react-toastify';
import Spinner from '../../common/spinner/Spinner';
import {setLoader} from "../../../redux/actions/global";

interface IMapStateToProps {
    singleNote?: any,
    user?: any,
    title?: '',
    history?: any,
}

interface IMapDispatchToProps {
    addNoteAction?: (data: any) => [];
    getNotesAction?: (data: any) => [];
    deleteNoteAction?: (id: any) => [];
    updateNoteAction?: (data: any) => [];
    setLoader?: (data: any) => [];
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
        this.state = {
            nodes: [],
            singleNote: {id: '', note: []},
            addRootNode: false,
            isEditMode: false
        };
    }


    componentDidMount() {
        if (this.props.history?.location?.pathname.includes('/add')) {
            this.setState({addRootNode: true}, () => this.addRootElement());
        }
    }

    componentDidUpdate() {
        if (this.props.history?.location?.pathname.includes('/edit') &&
            (this.state?.singleNote?.note) !== (this.props?.singleNote?.note) &&
            this.state?.singleNote?.id !== this.props?.singleNote?.id) {
            const allNodes = this.initializedNodes(this.props.singleNote?.note);
            this.setState({nodes: allNodes, singleNote: {...this.props.singleNote, note: allNodes}})
        }
    }

    initializedNodes = (nodes: any, location?: any): any => {
        const nodesCopy = [];
        if(nodes && nodes.length) {
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
                    level: i,
                    title,
                };
            }
            return nodesCopy;
        }
    };

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
    };

    addRootElement = () => {
        const {nodes}: any = this.state;
        const {history}: any = this.props;
        const id = nodes.length ? `${nodes.length + 1}` : '1';
        const newNode = {
            children: [],
            changeTitle: this.changeTitle(id),
            removeNode: this.removeNode(id),
            addChild: this.addChild(id),
            id,
            title: '',
        };
        history.push(routes.ADDNOTE);
        this.setState({nodes: [newNode], singleNote: []});
    };

    addChild = (id: any) => {
        return () => {
            const {nodes}: any = this.state;
            id = id.split('.').map((str: any) => parseInt(str));
            const allNodes = this.initializedNodes(nodes);
            let changingNode = allNodes && allNodes[id[0] - 1];

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
    };

    removeNode = (id: any) => {
        return () => {
            const {nodes}: any = this.state;
            id = id.split('.').map((str: any) => parseInt(str));

            if (id.length === 1) {
                const newNodes = [
                    ...nodes.slice(0, id[0] - 1), // ...nodes.slice(0, [id[0] - 1]),
                    ...nodes.slice(id[0]),
                ];

                this.setState({nodes: this.initializedNodes(newNodes)});
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
                this.setState({nodes: this.initializedNodes(nodes)});
            }
        };
    };

    simplify = (nodes: any): any => {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const {id, title, children} = nodes[i];
            const hasChildren = children !== undefined && children.length > 0;
            nodesCopy[i] = {
                id,
                level: i,
                title,
                children: hasChildren ? this.simplify(children) : [],
            };
        }
        return [...nodesCopy];
    };

    saveNodes = async (isEditMode: boolean) => {
        const {nodes, singleNote} = this.state;
        const {user, addNoteAction, updateNoteAction, history, setLoader} = this.props;
        const nodesCopy = this.simplify(nodes);
        setLoader(true);
        if (!isEditMode) {
            if(nodes && nodes[0]?.title !== "") {
                const data = await addNoteDocument(nodesCopy, user?.id);
                addNoteAction(data);
                this.setState({nodes: singleNote?.note});
                setLoader(false);
                history.push(routes.EDITNOTE);
                toast.success(`Note saved successfully!`)
                this.getAllNotes();
            } else {
                setLoader(false);
                toast.error('Please enter a title to save your note.')
            }
        } else {
            const data = await updateNoteDocument(nodesCopy, singleNote?.id)
            updateNoteAction(data);
            setLoader(false);
            toast.success(`Note updated successfully!`)
            this.getAllNotes();
        }
    };

    getAllNotes = async () => {
        const {user, getNotesAction} = this.props;
        const allNotes = await getAllNotesDocument(user?.id);
        getNotesAction(allNotes);
    };

    deleteNode = async (id: any) => {
        const {deleteNoteAction} = this.props;
        if (id) {
            const data = await deleteNoteDocument(id);
            deleteNoteAction(data);
            this.setState({nodes: []});
            this.getAllNotes();
            toast.success('Note deleted successfully!')
        }
    };

    render() {
        const {nodes, singleNote }: any = this.state;
        const {loader, history }: any = this.props;
        const isEditMode = history?.location?.pathname.includes('/edit');
        console.log('nodes', nodes)
        return (
            <div className={'mt-6'}>{nodes?.length ? <Box m={3} display={'flex'} justifyContent={'flex-end'}>
                <Button className={'mr-2'} variant="outlined" color="primary"
                        onClick={() => this.saveNodes(isEditMode)}>
                    {`${isEditMode ? 'Update' : 'Save'}`}
                </Button>
                {singleNote && singleNote?.id ? <Button variant="outlined" color="secondary"
                        onClick={() => this.deleteNode(singleNote && singleNote?.id)}>
                    Delete
                </Button> : null}
            </Box> : <div
                className={'w-100 d-flex justify-content-center align-items-center'}>
                <Button variant="outlined" color="primary"
                        onClick={() => this.addRootElement()}>
                    Add Note
                </Button></div>}
                <div className={'container h-100 d-flex justify-content-center'}>
                    <ul className="Nodes d-flex justify-content-center align-items-center flex-column">
                        {nodes?.map((nodeProps: any, index: any) => {
                            const {id, ...others} = nodeProps;
                            return <TreeNode addNew={true}
                                             key={`${id}of${index}`}
                                             id={id}
                                             {...others} />;
                        })}
                    </ul>
                </div>
                {loader ? <Spinner /> : null}
            </div>
        );
    }
}

const mapStateToProps = (state: any): any => ({
    singleNote: state?.notes?.singleNote,
    user: state?.auth?.user?.data,
    loader: state.globals.loader,
});

const mapDispatchToProps = (dispatch: any): any => ({
    addNoteAction: (values: any) => dispatch(addNoteAction(values)),
    deleteNoteAction: (id: any) => dispatch(deleteNoteAction(id)),
    getNotesAction: (values: any) => dispatch(getNotesAction(values)),
    updateNoteAction: (values: any) => dispatch(updateNoteAction(values)),
    setLoader: (loading: any) => dispatch(setLoader(loading)),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Navigation(AddEditNote)));

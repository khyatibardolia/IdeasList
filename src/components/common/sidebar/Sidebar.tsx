import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    makeStyles,
    Theme,
    createStyles
} from '@material-ui/core';
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import {getNoteByIdDocument} from "../../../service/firebase/firebase";
import {getNoteByIdAction} from "../../../redux/actions/notes";
import './Sidebar.scss';
import {useHistory} from "react-router-dom";
import * as routes from '../../../constants/routes';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        addButton: {
            margin: theme.spacing(2),
        },
    }));

const Sidebar = (props: any) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [selectedNoteId, setNoteId] = useState('');
    const notes: any = useSelector((state: any) => {
        return state?.notes?.data
    });
    console.log('notes', notes);
    const classes = useStyles();
    const getNote = useCallback(async (id: any) => {
        if(id) {
            setNoteId(id);
            history.push(routes.DISPLAYNOTE);
            const note = await getNoteByIdDocument(id);
            dispatch(getNoteByIdAction([note]));
        }
    }, [dispatch]);

    useEffect(() => {
        console.log('useEffectttttttttttt')
        const fetchApi = async () => {
            await getNote(notes && notes[0]?.id)
        }
        fetchApi();
    }, [notes, getNote]);

    const addNote = (e:any) => {
        console.log('add note called')
        e.preventDefault();
        e.stopPropagation();
        history.push({pathname: routes.ADDEDITNOTE, state: {addRootNode: true}})
    };

    return (<>
        {notes && Object.keys(notes).length ? Object.keys(notes).map((keyName) => {
            const id = notes[keyName]?.id;
            const isNoteSelected = selectedNoteId === id;
            const parentNodeTitle = notes[keyName]?.note[0]?.title;
            return (
                <List key={keyName} className={'note-list'}>
                    <ListItem button key={keyName} onClick={() => getNote(id)}>
                        <ListItemIcon>
                            <AccountTreeIcon style={{fill: '#3f51b5 !important'}}/>
                        </ListItemIcon>
                        <ListItemText className={`${isNoteSelected ? 'active-note' : ''}`}
                                      primary={parentNodeTitle}/>
                    </ListItem>
                </List>
            );
        }) : null}
        <Button variant="outlined" color="primary"
                className={classes.addButton}
                onClick={(e) => addNote(e)}>
            Add Note
        </Button>
    </>)
};
export default Sidebar;

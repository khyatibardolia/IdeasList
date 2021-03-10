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
import {getAllNotesDocument, getNoteByIdDocument} from "../../../service/firebase/firebase";
import {getNoteByIdAction, getNotesAction} from "../../../redux/actions/notes";
import './Sidebar.scss';
import {useHistory} from "react-router-dom";
import * as routes from '../../../constants/routes';
import { setLoader } from '../../../redux/actions/global';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        addButton: {
            margin: theme.spacing(2),
        },
    }));

const Sidebar = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [selectedNoteId, setNoteId] = useState('');    
    const notes: any = useSelector((state: any) => {
        return state?.notes?.data
    });
    const user: any = useSelector((state: any) => {
        return state?.auth?.user?.data
    });

    const classes = useStyles();
    useEffect(() => {
        const fetchData = async () => {            
            dispatch(setLoader(true));
            const data = await getAllNotesDocument(user?.id);
            dispatch(getNotesAction(data));
            dispatch(setLoader(false));
            if (data && data.length) {
                dispatch(setLoader(true));
                const note = await getNoteByIdDocument(data && data[0]?.id);
                dispatch(getNoteByIdAction([note]));
                dispatch(setLoader(false));
            }
        };
        fetchData()
    }, [dispatch, user?.id]);
    const getNote = useCallback(async (id: any) => {
        if(id) {
            dispatch(setLoader(true));
            setNoteId(id);
            const note = await getNoteByIdDocument(id);
            if(note) {
                dispatch(getNoteByIdAction([note]));
                history.push({pathname: `${routes.EDITNOTE}`})
            }
            dispatch(setLoader(false));
        }
    }, [dispatch, history]);

    const addNote = () => {
        history.push({pathname: `${routes.ADDNOTE}`})
    };

    return (<>
        {notes && Object.keys(notes).length ? Object.keys(notes).map((keyName) => {
            const id = notes[keyName]?.id;
            const isNoteSelected = selectedNoteId === id;
            const parentNodeTitle = notes[keyName]?.note[0]?.title || '';
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
                onClick={addNote}>
            Add Note
        </Button>        
    </>)
};
export default Sidebar;

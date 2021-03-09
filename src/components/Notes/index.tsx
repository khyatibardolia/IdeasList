import {Navigation} from '../common/hoc/Navigation';
import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {useHistory} from "react-router-dom";
import * as routes from "../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import {getAllNotesDocument, getNoteByIdDocument} from '../../service/firebase/firebase';
import {getNoteByIdAction, getNotesAction} from '../../redux/actions/notes';
import {CircularProgress} from "@material-ui/core";
import AddEditNote from "./add-edit-notes/AddEditNote";

const useStyles = makeStyles({
    root: {
        width: '100%',
        margin: 'auto'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 25,
    }
});


const Notes = () => {
    const history = useHistory();
    const classes = useStyles();

    const [loading, setLoader] = useState(false);
    const dispatch = useDispatch();
    const user: any = useSelector((state: any) => {
        return state?.auth?.user?.data
    });
    useEffect(() => {
        setLoader(true);
        const fetchData = async () => {
            const data = await getAllNotesDocument(user?.id);
            dispatch(getNotesAction(data));
            console.log('sdsdsd', data)
            if (data) {
                const note = await getNoteByIdDocument(data && data[0]?.id);
                dispatch(getNoteByIdAction([note]));
            }
            setLoader(false);
        };
        fetchData()
    }, [dispatch, user?.id]);

    const singleNote: any = useSelector((state: any) => {
        return state?.notes?.singleNote
    });
    const hasNotes = singleNote && singleNote?.length;
    return (<>{loading ?
        <div className={'vh-100 d-flex justify-content-center align-items-center'}>
            <CircularProgress color={'primary'} size={20}/></div> :
        hasNotes ?
            <div className={'mt-0'}><AddEditNote/></div> :
            <div className={'container h-100 d-flex justify-content-center'}>
                <Card className={`${classes.root} shadow mx-5 p-5`} variant="outlined">
                    <CardContent className={'text-center'}>
                        <Typography className={classes.title} color="textPrimary" gutterBottom>
                            Turn Your Ideas Into Reality
                        </Typography>
                        <Typography color="textSecondary">
                            Go from big picture thinking to deep focus mode in an instant, Moar’s infinitely nesting
                            structure
                            lets you focus on what’s important to you right now.
                        </Typography>
                    </CardContent>
                    <CardActions className={'d-flex justify-content-center'}>
                        <Button variant="outlined" color="primary" onClick={() =>
                            history.push({pathname: `${routes.ADDNOTE}`})}>
                            Add Notes
                        </Button>
                    </CardActions>
                </Card>
            </div>}</>)
};
export default Navigation(Notes)

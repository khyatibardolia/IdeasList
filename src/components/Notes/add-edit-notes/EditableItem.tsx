import {TextField, Button, makeStyles, Box} from "@material-ui/core";
import {red} from '@material-ui/core/colors';
import clsx from 'clsx';
import * as React from "react";

const useStyles = makeStyles({
    noteBtn: {
        margin: '0px !important',
        padding: '0px !important',
        minWidth: '25px !important'
    },
    deleteNoteBtn: {
        borderColor: red[500],
        color: red[500]
    },
    noteTextField: {
        margin: '0 !important',
        '& > div > input' : {
            padding: '4px !important'
        }
    }
});


const EditableItem = (props: any) => {
    const {title, changeTitle, removeNode, addChild} = props;
    const classes = useStyles();

    return (
        <Box display={'flex'}>
            <Button
                className={classes.noteBtn}
                variant="outlined" color="primary"
                onClick={addChild}>
                +
            </Button>
            <Button
                className={clsx(classes.noteBtn, classes.deleteNoteBtn)}
                variant="outlined" color="secondary"
                onClick={removeNode}>
                x
            </Button>

            <TextField
                variant="outlined"
                margin="normal"
                className={classes.noteTextField}
                onChange={(e) => changeTitle(e.target.value)}
                value={title}
                placeholder="note"
            />

        </Box>
    );
};

export default (EditableItem);

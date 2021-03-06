import {Navigation} from '../../common/hoc/Navigation';
import TreeNode from '../add-edit-notes/TreeNode';
import {getAllNotesDocument} from "../../../service/firebase/firebase";
import {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getNotesAction} from "../../../redux/actions/notes";

const DisplayNote = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllNotesDocument();
            dispatch(getNotesAction(data));
        };

        fetchData()
    }, [dispatch]);
    const notes: any = useSelector((state: any) => {
        return state?.notes?.singleNote
    });
    return (<div>
        <ul className="Nodes d-flex justify-content-center align-items-center">
            {notes && Object.keys(notes).length ? Object.keys(notes).map((keyName) => {
                const children = notes[keyName].note;
                return (
                    <TreeNode
                        key={keyName}
                        children={children}
                    />
                );
            }) : null}
        </ul>
    </div>)
};
export default Navigation(DisplayNote)

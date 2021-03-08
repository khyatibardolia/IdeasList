import {Navigation} from '../../common/hoc/Navigation';
import TreeNode from '../add-edit-notes/TreeNode';
import {useSelector} from "react-redux";
import * as React from "react";
import {useHistory} from "react-router-dom";

const DisplayNote = (props: any) => {
    const {addNew, simplify, nodes} = props;
    const history = useHistory();
    const singleNote: any = useSelector((state: any) => {
        return state?.notes?.singleNote
    });
    console.log('history', history.location.state);
    const data = singleNote && Object.keys(singleNote).length ? singleNote[0]?.note : [];
    return (<>
        <ul className="Nodes d-flex justify-content-center align-items-center flex-column">
            {data?.map((nodeProps: any, index: any) => {
                const {id, ...others} = nodeProps;
                return <TreeNode addNew={addNew}
                                 key={`${id}of${index}`}
                                 id={id} {...others} />
            })}
        </ul>
    </>)
};
export default Navigation(DisplayNote)

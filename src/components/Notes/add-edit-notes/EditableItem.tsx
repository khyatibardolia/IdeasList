const EditableItem = (props: any) => {
    const {title, changeTitle, removeNode, addChild, level} = props;

    console.log('props', props);
    return (
        <div className="EditableItem">
            <button
                className="EditableItem-Button EditableItem-Button_add"
                onClick={addChild}>
                +
            </button>
            <button
                className="EditableItem-Button EditableItem-Button_remove"
                onClick={removeNode}>
                x
            </button>

            <input
                className="EditableItem-Text"
                onChange={(e) => changeTitle(e)}
                value={title}
                placeholder="New Item"
            />

        </div>
    );
};

export default (EditableItem);

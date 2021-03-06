const EditableItem = (props: any) => {
    console.log('editableItem props', props)
    const { title, changeTitle, removeNode, addChild, level } = props;

    console.log('level',level);

    return (
        <div className="EditableItem">
          {level !== 0 &&  <button
                className="EditableItem-Button EditableItem-Button_add"
                onClick={addChild}>
                +
            </button>
}
            <button
                className="EditableItem-Button EditableItem-Button_remove"
                onClick={removeNode}>
                x
            </button>

            <input
                className="EditableItem-Text"
                onChange={(e) => changeTitle(e) }
                value={title}
                placeholder="New Item"
            />

        </div>
    );
};

export default (EditableItem);

const Note = (props) => {
    const {title , noteClicked , active} = props;
    return (
        <li 
        onClick={noteClicked} 
        className={`note-item ${active && 'active'}`}
        >
            {title}
        </li>
    )
}

export default Note;
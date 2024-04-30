import React,{useState , useEffect, useCallback} from 'react';
import './App.css';
import Preview from './component/preview';
import Messages from './component/preview/messages/Messages';
import NotesContainer from './component/Notes/NotesContainer'
import NotesList from './component/Notes/NotesList';
import Note from './component/Notes/Item';
import Alert from './component/Alert';


function App() {
  const [notes , setNotes] = useState([]) ;
  const [title , setTitle] = useState([]) ;
  const [content , setContent] = useState('');
  const [selectedNote , setSelectedNote] = useState(null);
  const [creating , setCreating] = useState(false);
  const [editing , setEditing] = useState (false);
  const [validationError , setValidatuionError] = useState([]);

  useEffect(()=>{
  if(localStorage.getItem("notes")){
    setNotes(JSON.parse(localStorage.getItem("notes")))
  }else{
    localStorage.setItem('notes', JSON.stringify([]))
  }
  },[]);
  
  useEffect(() => {
    setTimeout(()=>{
      setValidatuionError([])
    },3000)
  },[validationError])
  

  console.log(validationError)
  // validation
  const validation = ()=> {
    const valid =[];
    let passed = true;
    if(!title){
      valid.push('يجب إدخال عنوان للملاحظة');
      passed = false;
    };
    if(!content){
      valid.push('لايمكن حفظ ملاحظة فارغة');
      passed = false;
    };
    setValidatuionError(valid);
    return passed ;
  }
  
  // Add Note Title
  const changeTitleHandler = (event) => {
    setTitle(event.target.value)
  };
  // Add Note Content
  const changeContentHandler = (event) => {
    setContent(event.target.value);
  };

  // save note to local storage
  const saveInLocal = (value) => {
    localStorage.setItem("notes",JSON.stringify(value))
  }


  // delete note 
  const deleteNoteHandler = ()=>{
    const updatedNote = [...notes]
    const nIndex = updatedNote.findIndex(note=> note.id === selectedNote);
    updatedNote.splice(nIndex , 1 );
    saveInLocal(updatedNote);
    setNotes(updatedNote);
    saveInLocal(updatedNote);
    setCreating(false);
  }

  // Save Note
  const  saveNoteHandler = () => {
    if(!validation()) return;
    const note = {
      id : new Date(Date.now()).getTime().toString(),
      title: title, 
      content: content
    }
    const updateNotes = [...notes , note];
    saveInLocal(updateNotes)
    setNotes(updateNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle("");
    setContent("");
  }
  // chose note
  const selectNoteHandler = (noteid) =>{
     setSelectedNote(noteid);
     setCreating(false);
   }
   // note edite
   const editeNoteHandler = () => {
      const note = notes.find(note => note.id === selectedNote);
      setTitle(note.title);
      setContent(note.content);
      setEditing(true);
   };

   // updateNote
   const updateNoteHandler = () => {
    if(!validation()) return;
    const upNotes = [...notes];
    const noteIndex = notes.findIndex(note=> note.id===selectedNote);
    upNotes[noteIndex] = {
      id : selectedNote,
      title : title,
      content : content
    };
    saveInLocal(upNotes)
    setNotes(upNotes);
    setEditing(false);
    setTitle("");
    setContent("");
   }
   // الانتقال لواجهة إضافة ملاحظة
  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false)
    setTitle("");
    setContent("");
  }
   

  const getAddNote = () => {
    return (
      <div>
        <h2>إضافة ملاحظة جديدة</h2>
        <div>
          <input
            type="text"
            name="title"
            className="form-input mb-30"
            placeholder="العنوان"
            value={title}
            onChange={changeTitleHandler}
          />

          <textarea
            rows="10"
            name="content"
            className="form-input"
            placeholder='المحتوى'
            value={content}
            onChange={changeContentHandler}
          />

          <a href="#" className="button green" onClick={saveNoteHandler} >
            حفظ
          </a>
        </div>
      </div>
    );
  };

  

  const getPreview = () => {
    if (notes.length == 0){
      return <Messages title='لا توجد ملاحظات لعرضها'/>;
    }
    if (!selectedNote) {
      return <Messages title='الرجاء تحديد ملاحظة' />
    }
    const note = notes.find(note => note.id === selectedNote)
    // display note
    let noteDisplay =(
      <div className="new-note" >
        <h2>{note.title}</h2>
        <p>{note.content} </p>
      </div>
     )
    if(editing){
      noteDisplay = (
        <div>
          <h2>تعديل ملاحظة</h2>
          <form>
          <input
              type="text"
              name="title"
              className="form-input mb-30"
              placeholder="العنوان"
              value={title}
              onChange={changeTitleHandler}
            />

            <textarea
              rows="10"
              name="content"
              className="form-input"
              placeholder='المحتوى'
              value={content}
              onChange={changeContentHandler}
            />
            <a href="#" className="button green" onClick={updateNoteHandler} >
            حفظ التعديلات 
            </a>
          </form>
        </div>
      )
    }

    return (
      <div>
        {!editing && 
          <div className="note-operations">
            <a href="#" onClick={editeNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#">
              <i className="fa fa-trash" onClick={deleteNoteHandler} />
            </a>
          </div>
        }
        {noteDisplay}
      </div>
    );
  };

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map(note => 
          <Note key={note.id} 
          title={note.title}
          noteClicked={()=>selectNoteHandler(note.id)}
          active = {selectedNote ===  note.id}
          />)}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview>
        {creating ? getAddNote(): getPreview()}
      </Preview>
      {validationError.length !==0 && <Alert validationMessages={validationError} />}
    </div>
  );
}

export default App;

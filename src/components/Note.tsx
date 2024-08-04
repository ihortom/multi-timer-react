import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { 
    GoBook as BookIcon,
    GoPencil as EditIcon,
    GoX as XmarkIcon,
    GoTrash as TrashIcon,
} from 'react-icons/go';


type NoteProps = {
    timer: {
        id?: string,
        name: string,
        note: string,
        alarm: boolean,
        dragged: boolean,
        visible: boolean,
    },
    time: string,
    open: boolean,
    readMode: boolean,
    openNote: () => void,
    addNote: (id: string, note: string) => void,
    readNote: () => void,
};


const Note = ({timer, time, open, readMode, openNote, readNote, addNote}: NoteProps) => {
    
    return (
        <Collapse in={open} timeout={0}
            onExit={() => addNote(timer.id, (document.getElementById(`note-text-${timer.id}`) as HTMLInputElement).value)}>
            <div id={`note-${timer.id}`} className="timer-note">
                <h6><span className="time active">{`${time}`}</span>
                    <Button className="close rounded-circle" variant="light"
                        title='Close note'
                        onClick={() => openNote()}><XmarkIcon /></Button>
                    <Button className="book rounded-circle" variant="light"
                        title={readMode ? 'Switch to write mode' : 'Switch to read mode'}
                        onClick={() => readNote()}>
                            {readMode ? <EditIcon /> : <BookIcon />}
                    </Button>
                    <Button className="trash rounded-circle" variant="light"
                        title='Delete note'
                        onClick={() => {
                            (document.getElementById(`note-text-${timer.id}`) as HTMLInputElement).value = '';
                            openNote()}
                        }><TrashIcon /></Button>
                    <span className="name">
                        {
                            timer.name.length == 0 ? "Note" : 
                            timer.name.length > 30 ? timer.name.substring(0,30) + '...' : timer.name
                        }
                    </span>{' '}
                </h6>
                <textarea id={`note-text-${timer.id}`}
                    onChange={() => addNote(timer.id, (document.getElementById(`note-text-${timer.id}`) as HTMLInputElement).value)}
                    style={readMode ? {display: 'none'} : {display: 'box'}}
                    defaultValue={`${timer.note.length > 0 ? timer.note : ""}`}>
                </textarea>
            </div>
        </Collapse>
    );
};

export default Note;

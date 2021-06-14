import React from 'react'
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse'
import {GoX, GoTrashcan} from 'react-icons/go'

const Note = ({timer, time, open, openNote, addNote}) => {

    return (
        <Collapse in={open} timeout={0}
            onExit={() => addNote(timer.id, document.getElementById(`note-text-${timer.id}`).value)}>
            <div id={`note-${timer.id}`} className="timer-note">
                <h6><span className="time active">{`${time}`}</span>
                    <Button className="close rounded-circle" variant="light"
                        onClick={() => openNote()}><GoX /></Button>
                    <Button className="trash rounded-circle" variant="light"
                        onClick={() => {
                            document.getElementById(`note-text-${timer.id}`).value = '';
                            openNote()}
                        }><GoTrashcan /></Button>
                    <span className="name">{`${timer.name.length > 0 ? timer.name.substring(0,23) : "Note"}`}</span>{' '}
                </h6>
                <textarea id={`note-text-${timer.id}`}
                    defaultValue={`${timer.note.length > 0 ? timer.note : ""}`}>
                </textarea>
            </div>
        </Collapse>
    )
}

export default Note

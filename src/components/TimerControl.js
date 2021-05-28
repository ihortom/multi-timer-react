import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { GoHistory, GoStop, GoNote, GoSync, GoX, GoArrowUp, GoArrowDown, GoTrashcan } from 'react-icons/go';

const TimerControl = ({timer, time, reset, makeRecursive, updateName,
                       openNote, open, onDelete, onDown, onUp}) => {

    const [del, pressDel] = useState(false);

    return (
        <div className="timer-control">
            <ButtonToolbar size="sm" aria-label="Timer control pannel">
                <InputGroup size="sm">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="timerName"><GoHistory /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        type="text"
                        placeholder="Name your timer"
                        aria-label="Timer name"
                        aria-describedby="timerName"
                        defaultValue={`${timer.name.length > 0 ? timer.name : ''}`}
                        onChange={(e) => {
                            e.preventDefault();
                            updateName(timer.id, e.target.value)
                        }}
                    />
                </InputGroup>
                <ButtonGroup size="sm" aria-label="First group">
                    <Button className="stop-timer" variant="danger" onClick={() => reset()} title="Reset"><GoStop /></Button>{' '}
                    <Button variant={`${timer.note.length === 0 ? "light" : "warning"}`} title="Note"
                        onClick={() => openNote()}
                        aria-controls={`note-${timer.id}`}
                        aria-expanded={open}
                    ><GoNote /></Button>{' '}
                    <Button variant={`${time.recursive ? "info" : "light"}`} onClick={() => makeRecursive()} title="Recursive"><GoSync /></Button>{' '}
                </ButtonGroup>
                <ButtonGroup size="sm" aria-label="First group">
                    <Button variant="secondary" onClick={() => onUp(timer.id)} title="Move up"><GoArrowUp /></Button>{' '}
                    <Button variant="secondary" onClick={() => onDown(timer.id)} title="Move down"><GoArrowDown /></Button>{' '}
                    <Button variant="danger"
                        onClick={() => {
                            pressDel(!del);
                            if (del) {
                                reset();  // clear badge
                                onDelete(timer.id);
                            }
                        }}
                        onPointerLeave={() => pressDel(false)}
                        title="Delete">{ del ? <GoTrashcan /> : <GoX />}
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>
        </div>
    )
}

export default TimerControl

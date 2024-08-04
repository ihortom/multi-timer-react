import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { 
    GoHistory as ClockRunIcon,
    GoSquareFill as StopIcon,
    GoNote as NoteIcon,
    GoSync as RecursiveIcon,
    GoX as XmarkIcon,
    GoArrowUp as ArrowUpIcon,
    GoArrowDown as ArrowDownIcon,
    GoTrash as TrashIcon,
} from 'react-icons/go';


type TimerControlProps = {
    timer: TimerStateProps,
    time: TimeProps,
    open: boolean,
    reset: () => void,
    makeRecursive: () => void,
    updateName: (id: string, name: string) => void
    openNote: () => void,
    onDelete: (id: string) => void, 
    onDown: (id: string) => void,
    onUp: (id: string) => void, 
};

        
const TimerControl = 
    ({timer, time, open, 
    reset, makeRecursive, updateName, openNote, onDelete, onDown, onUp}: TimerControlProps) => {

    const [del, pressDel] = useState(false);

    return (
        <div className="timer-control">
            <ButtonToolbar aria-label="Timer control pannel">
                <InputGroup size="sm">
                    <InputGroup.Text id="timerName"><ClockRunIcon /></InputGroup.Text>
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
                    <Button className="stop-timer" variant="danger" onClick={() => reset()} title="Reset"><StopIcon /></Button>{' '}
                    <Button variant={`${timer.note.length === 0 ? "light" : "warning"}`} title="Note"
                        onClick={() => openNote()}
                        aria-controls={`note-${timer.id}`}
                        aria-expanded={open}
                    ><NoteIcon /></Button>{' '}
                    <Button variant={`${time.recursive ? "info" : "light"}`} onClick={() => makeRecursive()} title="Recursive"><RecursiveIcon /></Button>{' '}
                </ButtonGroup>
                <ButtonGroup size="sm" aria-label="First group">
                    <Button variant="secondary" onClick={() => onUp(timer.id)} title="Move up"><ArrowUpIcon /></Button>{' '}
                    <Button variant="secondary" onClick={() => onDown(timer.id)} title="Move down"><ArrowDownIcon /></Button>{' '}
                    <Button variant="danger"
                        onClick={() => {
                            pressDel(!del);
                            if (del) {
                                reset();  // clear badge
                                onDelete(timer.id);
                            }
                        }}
                        onPointerLeave={() => pressDel(false)}
                        title={del ? "Confirm deletion" : "Delete"}>{ del ? <TrashIcon /> : <XmarkIcon />}
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>
        </div>
    );
};

export default TimerControl;

import { useState, useEffect, useRef } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import TimeButtons from './TimeButtons';
import TimerControl from './TimerControl';
import Note from './Note';
import Clock from './Clock';
import { FaBell as BellIcon } from 'react-icons/fa6';
import media from '../../assets/default.mp3';


type Preferences = {
    longFormat: boolean,
    duodecimalClock: boolean,
    soundAlarm: boolean,
}

type TimerStateProps = {
    id?: string,
    name: string,
    note: string,
    alarm: boolean,
    dragged: boolean,
    visible: boolean
}

type TimerProps = {
    timer: TimerStateProps,
    events: {
        onDelete: (id: string) => void, 
        onUp: (id: string) => void, 
        onDown: (id: string) => void,
        onDragOver: (id: string, e: React.DragEvent) => void, 
        onDrop: (id: string, e: React.DragEvent) => void, 
        onDragEnd: (id: string, e: React.DragEvent) => void, 
        onDragLeave: (id: string, e: React.DragEvent) => void, 
        onDragStart: (id: string, e: React.DragEvent) => void,
        addNote: (id: string, note: string) => void, 
        updateName: (id: string, name: string) => void, 
    },
    settings: Preferences
}

type TimeProps = {
    timerId: string,
    time: number,
    init: number,
    new: boolean,
    active: boolean,
    recursive: boolean,
}


const Timer = ({timer, events, settings}: TimerProps) => {

    const {
            onDelete, 
            onUp, 
            onDown, 
            onDragOver, 
            onDrop, 
            onDragEnd, 
            onDragLeave, 
            onDragStart, 
            addNote, 
            updateName
    } = events;

    const [time, setTime] = useState<TimeProps>({
        timerId: timer.id,
        time: 0, init: 0,   // seconds (current, initial)
        new: true,          // state
        active: false,      // alarm on
        recursive: false,   // reoccuring countdown
    });

    const [noteOpen, setOpen] = useState(false)

    const openNote = () => {
        setOpen(!noteOpen);
    }

    const [readMode, setReadMode] = useState(false)

    const notebookElement = useRef(null);

    const readNote = () => {

        const thisNote = document.getElementById(`note-text-${timer.id}`) as HTMLElement;

        if (readMode) {
            thisNote.style.display = 'inline-block';
            (thisNote as HTMLTextAreaElement).innerText = timer.note;
            notebookElement.current?.remove();
        }
        else {
            const parser = new DOMParser();
            const noteBits: string[] = timer.note.replace(/\n/g, "<br> ").split(' ');
            const divBits: string[] = [];
            for (const i of noteBits)
                i.startsWith('http') ? 
                divBits.push(`<a href="${i}" target="_blank">${i}</a>`) :
                i.startsWith('www.') ?
                divBits.push(`<a href="http://${i}" target="_blank">${i}</a>`) :
                divBits.push(i);
            const note: string = divBits.join(' ');
            const notebook = parser.parseFromString(note, "text/html").body;
            thisNote.style.display = 'none';
            const thisTimer = document.getElementById(`note-${timer.id}`) as HTMLElement;
            const thisNotebook = document.createElement('div');
            thisNotebook.setAttribute('id', `note-book-${timer.id}`);
            thisNotebook.setAttribute('class', 'notebook');
            notebookElement.current = thisNotebook;
            thisNotebook.innerHTML = notebook.innerHTML;
            thisTimer.appendChild(thisNotebook);
        }
        setReadMode(!readMode);
    }

    // Clock
    const [clockOpen, setClockVisibility] = useState(false);
    const [clock, setClock] = useState<Date>(new Date(0));

    const showClock = () => {
        setClockVisibility(!clockOpen);
    }

    const hoursElement = useRef(null);
    const minutesElement = useRef(null);

    const setHoursElement = (element: HTMLInputElement) => {
        hoursElement.current = element;
    }

    const setMinutesElement = (element: HTMLInputElement) => {
        minutesElement.current = element;
    }

    const resetClock = () => {
        if (hoursElement.current !== null) {
            hoursElement.current.className = "hours form-control";
            hoursElement.current.value = '';
        }
        if (minutesElement.current !== null) {
            minutesElement.current.className = "minutes form-control";
            minutesElement.current.value = '';
        }
    }

    const getTime = (clockTime: Date) => {
        if (!time.time) {
            resetTime();
        }
        const now: Date = new Date();
        if (clockTime > now) {
            setClock(clockTime);
            const diff = Math.floor((clockTime.getTime() - now.getTime()) / 1000);
            setTime({...time, time: diff, init: diff, new: false, active: false});
        }
    }

    const timeOff = (seconds: number) => {
        const now = new Date();
        const then = new Date(now.setSeconds(seconds));
        setClock(then);
    }

    const notifications = useRef([]);

    // Countdown
    const tick = (interval: NodeJS.Timeout) => {
        let t = time.time + 1;

        if (t === 1 && time.recursive) {
            t = time.init;
            const now = new Date();
            timeOff(t + now.getSeconds());
        }
        else {
            // Handle time drift
            const now = Math.floor(Date.now() / 1000);
            const then = Math.floor(clock.getTime() / 1000);
            t = then - now <= 0 ? 0 : then - now
        }

        // Time's up
        if (t === 0) {
            const timerName = timer.name.length > 0 ? timer.name : "Timer";

            if (settings.soundAlarm) {
                const x = window.document.createElement("AUDIO") as HTMLMediaElement;
                x.setAttribute("src", media);
                x.play();
            }

            const notification = new Notification('Multi-Timer', {
                body: timerName
            });
            notifications.current.push(notification);


            if (!time.recursive) {
                window.electron.updateBadge(1);
                clearInterval(interval);
            }
        }

        setTime(() => {
            const active = t === 0 ? true : time.active
            const init = (t === 0 && !time.recursive) ? 0 : time.init
            return {...time, time: t, init: init, active: active}
        });

    }

    useEffect(() => {
        let interval: NodeJS.Timeout = null;
        if (time.time || time.init) {
            interval = setInterval(() => {
                tick(interval);
            }, 1000);
        }
        else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [time]);

    // Wind time up by given seconds
    const windTimeUp = (seconds: number) => {
        if (time.active && !time.new) {
            window.electron.updateBadge(-1);
        }
        setTime({...time, time: time.time + seconds, init: time.time + seconds, new: false});
        const now = new Date();
        timeOff(time.time + seconds + now.getSeconds());
    }

    // Reset Time
    const resetTime = () => {
        if (time.active && !time.new && !time.recursive) {
            window.electron.updateBadge(-1);
        }
        setTime({...time, time: 0, init: 0, new: true, active: false});
        setClock(new Date(0));
        resetClock();   // UI
        notifications.current.forEach((n) => n.close());
    }

    // Silence Alarm
    const silenceAlarm = (element: HTMLElement) => {
        if (time.active && !time.new && !time.recursive) {
            window.electron.updateBadge(-1);
        }
        setTime({...time, active: false});
        notifications.current.forEach((n) => n.close());
        element.className = 'bell';  // clear alarm bell
    }

    // Rewind time again to init time
    const makeRecursive = () => {
        setTime({...time, recursive: !time.recursive})
    }

    // Get bell class status
    const getBell = () => {
        if (!time.new && time.recursive && time.init > 0 && time.active) {
            return " recursive"
        }
        else if (time.time === 0  && !time.new) {
            return " active"
        }
        else return ""
    }

    const getTimeAsString = (seconds: number): string => {
        const h: number = Math.floor(seconds / (60 * 60));
        const m: number = Math.floor((seconds/60 - (h * 60)));
        const s: number = seconds - (h * 60 * 60) - m * 60;
        const t = {
            h: h < 10 ? '0' + h.toString() : h.toString(),
            m: m < 10 ? '0' + m.toString() : m.toString(),
            s: s < 10 ? '0' + s.toString() : s.toString(),
        }

        if (settings.longFormat) {
            return t.h + ':' + t.m + ':' + t.s
        }
        else {
            let shortM;
            let shortH;
            if (s > 0) {
                if (m+1 < 10) {
                    shortM = '0' + (m+1).toString();
                }
                else {
                    shortM = (m+1).toString();
                }
            }
            else if (m > 0 && m < 60) {
                if (m < 10) {
                    shortM = '0' + (m).toString();
                }
                else {
                    shortM = (m).toString();
                }
            }
            else {
                shortM = '00';
            }

            if (shortM === '60') {
                shortH = h + 1 < 10 ? '0' + (h+1).toString() : (h+1).toString();
                shortM = '00'
            }
            else {
                shortH = t.h
            }
            return shortH + ':' + shortM
        }
    }

    return (
        <div draggable
            className={`timer${timer.dragged ? ' dragged' : ''}`}
            onDragStart={(e) => onDragStart(timer.id, e)}
            onDragOver={(e) => onDragOver(timer.id, e)}
            onDrop={(e) => onDrop(timer.id, e)}
            onDragEnd={(e) => onDragEnd(timer.id, e)}
            onDragLeave={(e) => onDragLeave(timer.id, e)}
        >
            <Note 
                open={noteOpen} 
                openNote={openNote} 
                timer={timer} 
                time={getTimeAsString(time.time)} 
                readMode={readMode}
                readNote={readNote}
                addNote={addNote} 
            />
            <div className={`time-pannel${settings.longFormat ? " long" : " short"}`}>
                <Clock open={clockOpen} timerId={timer.id} time={clock} countdown={time.time}
                    duodecimalClock={settings.duodecimalClock} getTime={getTime}
                    setHoursElement={setHoursElement} setMinutesElement={setMinutesElement}
                />
                <div className={`time${time.time > 0 ? " active" : " inactive"}`} id={`time-${timer.id}`}>
                    <span>{`${getTimeAsString(time.time)}`}</span>
                </div>
                <TimeButtons onWind={windTimeUp} showClock={showClock} clockOpen={clockOpen} timerId={timer.id}/>
                <span className={`bell${getBell()}`}>
                    <BellIcon
                        onClick={(e) => silenceAlarm((e.target as Element).closest('span.bell'))} 
                    />
                </span>
            </div>
            <ProgressBar now={time.init > 0 ? time.time/time.init*100: 0} />
            <div className="timer-control-pannel">
                <TimerControl timer={timer} time={time}
                    onDelete={onDelete} onDown={onDown} onUp={onUp}
                    reset={resetTime} makeRecursive={makeRecursive}
                    openNote={openNote} open={noteOpen}
                    updateName={updateName}
                />
            </div>
        </div>
    )
}

export default Timer

import React, { useState, useEffect, useRef } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'
import TimeButtons from './TimeButtons'
import TimerControl from './TimerControl'
import Note from './Note'
import Clock from './Clock'
import { GoBell } from 'react-icons/go';

const Timer = ({timer, onDelete, onUp, onDown,
                onDragOver, onDrop, onDragEnd, onDragLeave, onDragStart,
                addNote, updateName, settings}) => {

    const [time, setTime] = useState({
        timerId: timer.id,
        time: 0, init: 0,   // seconds (current and initial)
        new: true,          // state
        active: false,      // alarm on
        recursive: false,   // reoccuring countdown
    });

    const [noteOpen, setOpen] = useState(false)

    const openNote = () => {
        setOpen(!noteOpen);
    }

    // Clock
    const [clockOpen, setClockVisibility] = useState(false);
    const [clock, setClock] = useState(new Date(0));

    const showClock = () => {
        setClockVisibility(!clockOpen);
    }

    const hoursElement = useRef(null);
    const minutesElement = useRef(null);

    const setHoursElement = (element) => {
        hoursElement.current = element;
    }

    const setMinutesElement = (element) => {
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

    const getTime = (clockTime) => {
        if (!time.time) {
            resetTime();
        }
        const now = new Date();
        if (clockTime > now) {
            setClock(clockTime);
            const diff = parseInt((clockTime - now) / 1000);
            setTime({...time, time: diff, init: diff, new: false, active: false});
        }
    }

    const timeOff = (seconds) => {
        const now = new Date();
        const then = new Date(now.setSeconds(seconds));
        setClock(then);
    }

    const notifications = useRef([]);

    // Countdown
    const tick = (interval) => {
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
                const x = window.document.createElement("AUDIO");
                x.setAttribute("src","assets/default.mp3");
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
        let interval = null;
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
    const windTimeUp = (seconds) => {
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

    const getTimeAsString = (seconds) => {
        const h = parseInt(seconds / (60 * 60));
        const m = parseInt((seconds/60 - (h * 60)));
        const s = seconds - (h * 60 * 60) - m * 60;
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
            <Note open={noteOpen} openNote={openNote} timer={timer} time={getTimeAsString(time.time)} addNote={addNote} />
            <div className={`time-pannel${settings.longFormat ? " long" : " short"}`}>
                <Clock open={clockOpen} timerId={timer.id} time={clock} countdown={time.time}
                    duodecimalClock={settings.duodecimalClock} getTime={getTime}
                    setHoursElement={setHoursElement} setMinutesElement={setMinutesElement}
                />
                <div className={`time${time.time > 0 ? " active" : " inactive"}`} id={`time-${timer.id}`}>
                    <span>{`${getTimeAsString(time.time)}`}</span>
                </div>
                <TimeButtons onWind={windTimeUp} showClock={showClock} clockOpen={clockOpen} timerId={timer.id}/>
                <span className={`bell${getBell()}`}><GoBell /></span>
            </div>
            <ProgressBar now={`${time.init > 0 ? time.time/time.init*100: 0}`} />
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

import React, { useState, useEffect } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'
import TimeButtons from './TimeButtons'
import TimerControl from './TimerControl'
import Note from './Note'
import { GoBell } from 'react-icons/go';

const Timer = ({timer, onDelete, onUp, onDown,
                onDragOver, onDrop, onDragEnd, onDragLeave, onDragStart,
                addNote, updateName, settings}) => {

    const [time, setTime] = useState({
        timerId: timer.id,
        time: 0, init: 0,
        new: true,      // initial state
        active: false,  // alarm on
        recursive: false
    })

    const [noteOpen, setOpen] = useState(false)

    const openNote = () => {
        setOpen(!noteOpen)
    }

    const tick = () => {
        let t;

        if (time.time - 1 === 0 && time.recursive) {
            t = time.init;
        }
        else {
            t = time.time - 1
        }

        if (time.time - 1 === 0) {
            const timerName = timer.name.length > 0 ? timer.name : "Timer";

            if (settings.soundAlarm) {
                const x = window.document.createElement("AUDIO");
                x.setAttribute("src","assets/default.mp3");
                x.play();
            }

            let notification = new Notification('Multi-Timer', {
                body: timerName
            });

            if (!time.recursive) {
                window.electron.updateBadge(1);
            }
        }

        if (time.time > 0) {
            setTime(() => {
                const active = time.time - 1 === 0 ? true : time.active
                return {...time, time: t, active: active}
            })
        }
    }

    useEffect(() => {
        if (time.time > 0) {
            const t = setInterval(() => {
                tick()
            }, 1000);
            return () => clearInterval(t);
        }
    });

    // Wind time up by given minutes
    const windTime = (minutes) => {
        if (time.active && !time.new) {
            window.electron.updateBadge(-1);
        }
        setTime(() => {return {...time, time: time.time + minutes, init: time.time + minutes, new: false}})
    }

    // Reset Time
    const resetTime = () => {
        if (time.active && !time.new && !time.recursive) {
            window.electron.updateBadge(-1);
        }
        setTime(() => {return {...time, time: 0, init: 0, new: true, active: false}});
    }

    // Rewind time again to init time
    const makeRecursive = () => {
        setTime(() => {return {...time, recursive: !time.recursive}})
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
            h: h<=9 ? '0' + h.toString() : h.toString(),
            m: m<=9 ? '0' + m.toString() : m.toString(),
            s: s<=9 ? '0' + s.toString() : s.toString(),
        }

        if (settings.longFormat) {
            return t.h + ':' + t.m + ':' + t.s
        }
        else {
            let shortM;
            let shortH;
            if (s > 0) {
                if (m+1 <= 9) {
                    shortM = '0' + (m+1).toString();
                }
                else {
                    shortM = (m+1).toString();
                }
            }
            else if (m > 0 && m < 60) {
                if (m <= 9) {
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
                shortH = h+1<=9 ? '0' + (h+1).toString() : (h+1).toString();
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
                <div className={`time${time.time > 0 ? " active" : " inactive"}`} id={`time-${timer.id}`}>
                    <span>{`${getTimeAsString(time.time)}`}</span>
                </div>
                <TimeButtons onWind={windTime} />
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

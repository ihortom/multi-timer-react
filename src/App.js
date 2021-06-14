import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Menu from './components/Menu';
import Timers from './components/Timers';
import Alert from 'react-bootstrap/Alert';
import { GoPlus, GoStop, GoX, GoFold, GoTools, GoInfo, GoTrashcan } from 'react-icons/go';

const App = () => {

    // Menu block
    const [menuItems, setMenuItems] = useState([
        {
            id: 1,
            text: <GoPlus />,
            title: "Add timer",
            pressed: false,
            togglable: false,
            disabled: false,
        },
        {
            id: 2,
            text: <GoStop />,
            title: "Reset all timers",
            pressed: false,
            togglable: false,
            disabled: false,
        },
        {
            id: 3,
            text: <GoX />,
            title: "Delete all timers",
            pressed: false,
            togglable: true,
            disabled: false,
        },
        {
            id: 4,
            text: <GoFold />,
            title: "Hide inactive timers",
            pressed: false,
            togglable: true,
            disabled: false,
        },
        {
            id: 5,
            text: <GoTools />,
            title: "Preferences",
            pressed: false,
            togglable: true,
            disabled: false,
        },
        {
            id: 6,
            text: <GoInfo />,
            title: "About",
            pressed: false,
            togglable: true,
            disabled: false,
        },
    ])

    const pushMenuButton = (id) => {

        if (id === 5) { // Settings
            setMenuItems(
                menuItems.map((btn) => {
                    let t = {}
                    if (btn.id === 6) {
                        t = {...btn, disabled: !btn.disabled}
                    }
                    else if (btn.id === 5) {
                        t = {...btn, pressed: !btn.pressed}
                    }
                    else {
                        t = btn
                    }
                    return t
                })
            )
        }
        else if (id === 6) {    // About
            setMenuItems(
                menuItems.map((btn) => {
                    let t = {}
                    if (btn.id === 5) {
                        t = {...btn, disabled: !btn.disabled}
                    }
                    else if (btn.id === 6) {
                        t = {...btn, pressed: !btn.pressed}
                    }
                    else {
                        t = btn
                    }
                    return t
                })
            )
        }
        else if (id === 3 && menuItems[2].pressed) {
            setMenuItems(
                menuItems.map((btn) => btn.id === id ?
                {...btn, pressed: !btn.pressed, text: <GoX />} : btn)
            );
            deleteAllTimers();
        }
        else if (id === 3 && !menuItems[2].pressed) {
            setMenuItems(
                menuItems.map((btn) => btn.id === id ?
                {...btn, pressed: !btn.pressed, text: <GoTrashcan />} : btn)
            )
        }
        else {
            setMenuItems(
                menuItems.map((btn) => btn.id === id ?
                {...btn, pressed: !btn.pressed} : btn))
        }
    }

    const cancelDelete = () => {
        setMenuItems(
            menuItems.map((btn) => btn.id === 3 && btn.pressed ?
            {...btn, pressed: false, text: <GoX />} : btn)
        );
    }

    // App prefernces block
    const [preferences, setPreferences] = useState({
        longFormat: (JSON.parse(window.localStorage.getItem('timeLong')) ||
                                window.localStorage.getItem('timeLong') === null) ?
                                true : // default
                                false,
        duodecimalClock: (JSON.parse(window.localStorage.getItem('duodecimalClock'))) ?
                                true :
                                false, // default
        soundAlarm: (JSON.parse(window.localStorage.getItem('soundAlarm'))) ?
                                true :
                                false, // default
    })

    const updateSettings = (preferences) => {
        setPreferences(preferences);
    }


    // Timers block
    const [timers, setTimers] = useState(
        JSON.parse(window.localStorage.getItem('mtTimers')) ?
        JSON.parse(window.localStorage.getItem('mtTimers')) :
        [{
            id: uuid(),
            name: '',
            note: '',
            alarm: false,
            dragged: false,
            visible: true,
        }]
    )

    const [draggedTimer, setDraggedTimer] = useState({})

    const [targetTimer, setTargetTimer] = useState({})

    const addTimer = (timer) => {
        const id = uuid();
        const newTimer = { id:id, ...timer }
        setTimers([...timers, newTimer])
    }

    const deleteTimer = (id) => {
        setTimers(timers.filter((timer) => timer.id !== id))
    }

    const deleteAllTimers = () => {
        setTimers([])
    }

    const hideInactiveTimers = (ids) => {
        if (ids.length === 0) {
            setTimers(timers.map(timer => {return {...timer, visible: true}}))
        }
        else {
            setTimers(timers.map(timer => ids.includes(timer.id) ? {...timer, visible: !timer.visible} : timer))
        }
    }

    const moveTimerUp = (id) => {
        const indexOfThisTimer = timers.map((timer,index) => timer.id === id ? index : 0)
                                       .find(i=>i)
        if(indexOfThisTimer > 0) {
            const thisTimer = timers[indexOfThisTimer]
            const prevTimer = timers[indexOfThisTimer - 1]
            const a1 = timers.slice(0, indexOfThisTimer - 1)
            const a2 = timers.slice(indexOfThisTimer + 1, timers.length)
            setTimers([...a1, thisTimer, prevTimer, ...a2])
        }
    }

    const moveTimerDown = (id) => {
        const i = timers.map((timer,index) => timer.id === id ? index : 0)
                        .find(i=>i)
        const indexOfThisTimer = i ? i : 0
        if(indexOfThisTimer < timers.length - 1) {
            const thisTimer = timers[indexOfThisTimer]
            const nextTimer = timers[indexOfThisTimer + 1]
            const a1 = timers.slice(0, indexOfThisTimer)
            const a2 = timers.slice(indexOfThisTimer + 2, timers.length)
            setTimers([...a1, nextTimer, thisTimer, ...a2])
        }
    }

    const dragTimerStart = (id, e) => {
        const i = timers.map((timer,index) => timer.id === id ? index : 0)
                        .find(i=>i)
        const indexOfThisTimer = i ? i : 0
        setDraggedTimer({
            timer: timers.find(timer => timer.id === id),
            clientY: e.clientY,
            index: indexOfThisTimer,
            status: 'start'
        })
        setTimers(timers.map(timer => timer.id === id ? {...timer, dragged: true} : timer))
    }

    const dragTimerOver = (id, e) => {
        e.preventDefault();
        const i = timers.map((timer,index) => timer.id === id ? index : 0)
                        .find(i=>i)
        const indexOfThisTimer = i ? i : 0
        // spot to be dropped on
        setTargetTimer({
            timer: timers.find(timer => timer.id === id),
            clientY: e.clientY,
            index: indexOfThisTimer
        })
    }

    const dragTimerEnd = (id, e) => {
        e.preventDefault();
        // if target exist then missed drop
        // restore timers
        setTimers(timers.map(timer => timer.dragged ? {...timer, dragged: false} : timer))
    }

    const dragTimerLeave = (id, e) => {
        e.preventDefault();
        setTargetTimer({})
    }

    const dropTimer = (id, e) => {
        e.preventDefault()
        if (Object.keys(targetTimer).length) {
            if (draggedTimer.index === targetTimer.index) {
                // reset
                setTargetTimer({})
                setDraggedTimer({})
            }
            else if (draggedTimer.clientY < targetTimer.clientY) { // drag down
                const a1 = timers.slice(0, draggedTimer.index)
                const a2 = timers.slice(draggedTimer.index + 1, targetTimer.index + 1)
                const a3 = timers.slice(targetTimer.index + 1, timers.length)
                setTimers([...a1, ...a2, draggedTimer.timer, ...a3])
            }
            else {    // drag up
                const a1 = timers.slice(0, targetTimer.index)
                const a2 = timers.slice(targetTimer.index + 1, draggedTimer.index)
                const a3 = draggedTimer.index < timers.length ?
                    timers.slice(draggedTimer.index + 1, timers.length) : []
                setTimers([...a1, draggedTimer.timer, ...a2, targetTimer.timer, ...a3])
            }
        }
        else {
            setTimers([timers, draggedTimer.timer])
        }
        // reset
        setTargetTimer({})
        setDraggedTimer({})
    }

    const addNote = (id, note) => {
        setTimers(timers.map((timer) => timer.id === id ? {...timer, note: note} : timer))
    }

    const updateName = (id, name) => {
        setTimers(timers.map((timer) => timer.id === id ? {...timer, name: name} : timer))
    }

    useEffect(() => {
        window.localStorage.setItem('timeLong', preferences.longFormat);
        window.localStorage.setItem('duodecimalClock', preferences.duodecimalClock);
        window.localStorage.setItem('soundAlarm', preferences.soundAlarm);
        window.localStorage.setItem('mtTimers', JSON.stringify(timers));
    }, [preferences, timers]);


    // Main
    return (
        <div className="App">
            <Menu menuItems={menuItems}
                  onClick={pushMenuButton}
                  addTimer={addTimer}
                  cancelDelete={cancelDelete}
                  settings={preferences}
                  onSettingsUpdate={updateSettings}
                  onHideInactiveTimers={hideInactiveTimers}
            />
            {
                timers.length > 0 ?
                <Timers timers={timers}
                        onDelete={deleteTimer}
                        onUp={moveTimerUp}
                        onDown={moveTimerDown}
                        onDragStart={dragTimerStart}
                        onDragOver={dragTimerOver}
                        onDrop={dropTimer}
                        onDragEnd={dragTimerEnd}
                        onDragLeave={dragTimerLeave}
                        addNote={addNote}
                        updateName={updateName}
                        settings={preferences}
                /> :
                <Alert variant="info">
                    Hit <GoPlus /> button above to add timer
                </Alert>
            }
        </div>
    );
}

export default App;

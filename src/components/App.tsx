import React, { StrictMode, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Menu from "./Menu";
import Timers from './Timers';
import Alert from 'react-bootstrap/Alert';
import { 
    FaPlus as PlusIcon, 
    FaStop as StopIcon, 
    FaXmark as XmarkIcon, 
    FaEyeLowVision as FoldIcon, 
    FaWrench as SettingsIcon, 
    FaInfo as InfoIcon,
    FaRegTrashCan as TrashIcon,
} from 'react-icons/fa6';
import { MenuItemProps } from './MenuItem';


type DraggableTimerProps = {
    timer: TimerStateProps,
    clientY: number,
    index: number,
    status: string
};

type TargettedTimerProps = {
    timer: TimerStateProps,
    clientY: number,
    index: number
};


const App = () => {

    // Menu block
    const [menuItems, setMenuItems] = useState<MenuItemProps["menuItem"][]>([
        {
            id: 1,
            text: <PlusIcon />,
            title: "Add timer",
            pressed: false,
            togglable: false,
            disabled: false,
        },
        {
            id: 2,
            text: <StopIcon />,
            title: "Reset all timers",
            pressed: false,
            togglable: false,
            disabled: false,
        },
        {
            id: 3,
            text: <XmarkIcon />,
            title: "Delete all timers",
            pressed: false,
            togglable: true,
            disabled: false,
        },
        {
            id: 4,
            text: <FoldIcon />,
            title: "Hide inactive timers",
            pressed: false,
            togglable: true,
            disabled: false,
        },
        {
            id: 5,
            text: <SettingsIcon />,
            title: "Preferences",
            pressed: false,
            togglable: true,
            disabled: false,
        },
        {
            id: 6,
            text: <InfoIcon />,
            title: "About",
            pressed: false,
            togglable: true,
            disabled: false,
        },
    ])

    const pushMenuButton = (id: number) => {

        if (id === 3            // Delete all timers
            && menuItems[2].pressed) {
            setMenuItems(
                menuItems
                    .map((btn) => 
                        btn.id === id ? {...btn, 
                            pressed: !btn.pressed, 
                            title: "Delete all timers", 
                            text: <XmarkIcon />} : btn
                    )
            );
            deleteAllTimers();
        }
        else if (id === 3 && !menuItems[2].pressed) {
            setMenuItems(
                menuItems
                    .map((btn) => 
                        btn.id === id ? {...btn, 
                            pressed: !btn.pressed, 
                            title: "Confirm deletion",
                            text: <TrashIcon />} : btn
                    )
            )
        }
        else if (id === 4) {    // Hide/Show inactive timers
            menuItems[3].pressed ? 
            setMenuItems(
                menuItems
                    .map((btn) => 
                        btn.id === id ? {...btn, 
                            pressed: !btn.pressed, 
                            title: 'Hide inactive timers'} : btn
                    )
            ) :
            setMenuItems(
                menuItems
                    .map((btn) =>
                        btn.id === id ? {...btn, 
                            pressed: !btn.pressed, 
                            title: 'Show hidden timers'} : btn
                    )
            )
        }
        else if (id === 5) {    // Settings
            if (menuItems[4].pressed)
                setMenuItems(
                    menuItems
                        .map((btn) => 
                            btn.id === 5 ? {...btn, pressed: false} :
                            {...btn, disabled: false}
                        )
                );
            else
                setMenuItems(
                    menuItems
                        .map((btn) => 
                            btn.id === 5 ? {...btn, pressed: true} :
                            {...btn, disabled: true}
                        )
                );
        }
        else if (id === 6) {    // About
            if (menuItems[5].pressed)
                setMenuItems(
                    menuItems
                        .map((btn) =>
                            btn.id === 6 ? {...btn, pressed: false} :
                            {...btn, disabled: false}
                        )
                );
            else
                setMenuItems(
                    menuItems
                        .map((btn) =>
                            btn.id === 6 ? {...btn, pressed: true} :
                            {...btn, disabled: true}
                        )
                );
        }
        else {
            setMenuItems(
                menuItems
                    .map((btn) => 
                        btn.id === id ? {...btn, pressed: !btn.pressed} : btn
                    )
            );
        }
    }

    const cancelDelete = () => {
        setMenuItems(
            menuItems.map((btn) => btn.id === 3 && btn.pressed ?
            {...btn, pressed: false, text: <XmarkIcon />} : btn)
        );
    };

    // App preferences block
    const [preferences, setPreferences] = useState<Preferences>(() => {
        const storedMedia = window.localStorage.getItem('soundAlarmMedia');
        const soundAlarm = JSON.parse(window.localStorage.getItem('soundAlarm') ?? 'false');
        const hasValidMedia = storedMedia && storedMedia !== 'null' && storedMedia !== 'undefined';
        return {
            longFormat: JSON.parse(window.localStorage.getItem('timeLong') ?? 'false'),
            duodecimalClock: JSON.parse(window.localStorage.getItem('duodecimalClock') ?? 'false'),
            soundAlarm,
            soundAlarmMedia: hasValidMedia ? storedMedia : (soundAlarm ? 'Default' : null),
            darkMode: JSON.parse(window.localStorage.getItem('darkMode') ?? 'false'),
        };
    });

    const updateSettings = (preferences: Preferences) => {
        setPreferences(preferences);
    };


    // Timers block
    const [timers, setTimers] = useState<TimerStateProps[]>(() => {
        const stored = JSON.parse(window.localStorage.getItem('mtTimers') ?? 'null');
        return stored ?? [{
            id: uuid(),
            name: '',
            note: '',
            alarm: false,
            dragged: false,
            visible: true,
        }];
    });

    const [draggedTimer, setDraggedTimer] = useState<DraggableTimerProps | null>(null);

    const [targetTimer, setTargetTimer] = useState<TargettedTimerProps | null>(null);

    const addTimer = (timer: NewTimerProps) => {
        if (timers.length === 0)
            setMenuItems(
                menuItems.map((btn) => [2,3,4].includes(btn.id) ?
                {...btn, disabled: false} : btn)
            );

        const newTimer: TimerStateProps = { id: uuid(), ...timer };
        setTimers(timers.concat([newTimer]));
    };

    const deleteTimer = (id: string) => {
        if (timers.length === 1)
            setMenuItems(
                menuItems.map((btn) => [2,3,4].includes(btn.id) ?
                {...btn, disabled: true} : btn)
            );

        setTimers(timers.filter((timer) => timer.id !== id));
    };

    const deleteAllTimers = () => {
        setTimers([]);
        window.electron.updateBadge('');

        setMenuItems(
            menuItems.map((btn) => [2,3,4].includes(btn.id) ?
            {...btn, disabled: true} :  // disable stop all, delete all, and hide indective
            btn
        ));
    };

    const hideInactiveTimers = (ids: string[]) => {
        // show all timers
        if (ids.length === 0) {
            setTimers(timers.map(timer => {return {...timer, visible: true}}));

            setMenuItems(
                menuItems.map((btn) => btn.id === 3 ?
                {...btn, disabled: false} :     // enable delete all
                btn
            ));
        }
        // hide inactive timers
        else {
            setTimers(timers.map(timer => ids.includes(timer.id) ? 
            {...timer, visible: !timer.visible} : timer));

            setMenuItems(
                menuItems.map((btn) => btn.id === 3 ?
                {...btn, disabled: true} :      // disable delete all
                btn
            ));
        }
    };

    const moveTimerUp = (id: string) => {
        const indexOfThisTimer = timers.findIndex(timer => timer.id === id);
        if (indexOfThisTimer > 0) {
            const thisTimer = timers[indexOfThisTimer];
            const prevTimer = timers[indexOfThisTimer - 1];
            const a1 = timers.slice(0, indexOfThisTimer - 1);
            const a2 = timers.slice(indexOfThisTimer + 1, timers.length);
            setTimers([...a1, thisTimer, prevTimer, ...a2]);
        }
    };

    const moveTimerDown = (id: string) => {
        const indexOfThisTimer = timers.findIndex(timer => timer.id === id);
        if (indexOfThisTimer >= 0 && indexOfThisTimer < timers.length - 1) {
            const thisTimer = timers[indexOfThisTimer];
            const nextTimer = timers[indexOfThisTimer + 1];
            const a1 = timers.slice(0, indexOfThisTimer);
            const a2 = timers.slice(indexOfThisTimer + 2, timers.length);
            setTimers([...a1, nextTimer, thisTimer, ...a2]);
        }
    };

    const dragTimerStart = (id: string, e: React.DragEvent) => {
        const indexOfThisTimer = timers.findIndex(timer => timer.id === id);
        const timer = timers[indexOfThisTimer];
        if (!timer) return;
        
        // hide the native drag ghost so the drag feels constrained to the vertical axis;
        const emptyImg = new Image();
        emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
        e.dataTransfer.setDragImage(emptyImg, 0, 0);
        e.dataTransfer.effectAllowed = 'move';
        setDraggedTimer({
            timer,
            clientY: e.clientY,
            index: indexOfThisTimer,
            status: 'start'
        });
        setTimers(timers.map(t => t.id === id ? {...t, dragged: true} : t));
    };

    const dragTimerOver = (id: string, e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const indexOfThisTimer = timers.findIndex(timer => timer.id === id);
        const timer = timers[indexOfThisTimer];
        if (!timer) return;
        // spot to be dropped on
        setTargetTimer({
            timer,
            clientY: e.clientY,
            index: indexOfThisTimer
        });
    };

    const dragTimerEnd = (id: string, e: React.DragEvent) => {
        e.preventDefault();
        // if target exists then drop is missed
        // restore timers
        setTimers(timers.map(timer => timer.dragged ? {...timer, dragged: false} : timer));
    };

    const dragTimerLeave = (id: string, e: React.DragEvent) => {
        e.preventDefault();
        setTargetTimer(null);
    };

    const dropTimer = (id: string, e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedTimer) return;

        if (targetTimer) {
            if (draggedTimer.index !== targetTimer.index) {
                if (draggedTimer.clientY < targetTimer.clientY) { // drag down
                    const a1 = timers.slice(0, draggedTimer.index);
                    const a2 = timers.slice(draggedTimer.index + 1, targetTimer.index + 1);
                    const a3 = timers.slice(targetTimer.index + 1, timers.length);
                    setTimers([...a1, ...a2, draggedTimer.timer, ...a3]);
                }
                else {    // drag up
                    const a1 = timers.slice(0, targetTimer.index);
                    const a2 = timers.slice(targetTimer.index + 1, draggedTimer.index);
                    const a3 = draggedTimer.index < timers.length ?
                        timers.slice(draggedTimer.index + 1, timers.length) : [];
                    setTimers([...a1, draggedTimer.timer, ...a2, targetTimer.timer, ...a3]);
                }
            }
        }
        else {
            setTimers(timers.concat(draggedTimer.timer));
        }
        // reset
        setTargetTimer(null);
        setDraggedTimer(null);
    };

    const addNote = (id: string, note: string) => {
        setTimers(timers.map((timer) => timer.id === id ? {...timer, note: note} : timer));
    };

    const updateName = (id: string, name: string) => {
        setTimers(timers.map((timer) => timer.id === id ? {...timer, name: name} : timer));
    };

    useEffect(() => {
        window.localStorage.setItem('timeLong', preferences.longFormat.toString());
        window.localStorage.setItem('duodecimalClock', preferences.duodecimalClock.toString());
        window.localStorage.setItem('soundAlarm', preferences.soundAlarm.toString());
        window.localStorage.setItem('soundAlarmMedia', (new String(preferences.soundAlarmMedia)).toString());
        window.localStorage.setItem('darkMode', preferences.darkMode.toString());
        window.localStorage.setItem('mtTimers', JSON.stringify(timers));
        document.documentElement.setAttribute('data-bs-theme', preferences.darkMode ? 'dark' : 'light');
    }, [preferences, timers]);

    const timerEvents = {
        onDelete: deleteTimer,
        onUp: moveTimerUp,
        onDown: moveTimerDown,
        onDragStart: dragTimerStart,
        onDragOver: dragTimerOver,
        onDrop: dropTimer,
        onDragEnd: dragTimerEnd,
        onDragLeave: dragTimerLeave,
        addNote: addNote,
        updateName: updateName,
    };

    const menuEvents = {
        onClick: pushMenuButton,
        addTimer: addTimer,
        cancelDelete: cancelDelete,
        onSettingsUpdate: updateSettings,
        onHideInactiveTimers: hideInactiveTimers,
    };

    return (
        <StrictMode>
            <div className='App'>
                <Menu 
                    menuItems={menuItems}
                    events={menuEvents}
                    settings={preferences}
                />
            </div>
            {
                timers.length > 0 ?
                <>
                    {
                        (() => {
                            const hiddenTimersCount = timers.filter(timer => !timer.visible).length;
                            if (menuItems[3].pressed && hiddenTimersCount)
                                return (
                                    <Alert variant="info" id="alert" className="text-center">
                                        {
                                            hiddenTimersCount == 1 ?  "1 timer is hidden" : 
                                            `${hiddenTimersCount} timers are hidden`
                                        }
                                    </Alert>
                                )
                        })()
                    } 
                    <Timers 
                        timers={timers}
                        events={timerEvents}
                        settings={preferences}
                    /> 
                </> :
                <Alert variant="info" id="alert" className="text-center">
                    Hit <PlusIcon /> button above to add timer
                </Alert>
            }
        </StrictMode>
    );
};

export default App;

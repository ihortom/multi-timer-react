import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'


type Preferences = {
    longFormat: boolean,
    duodecimalClock: boolean,
    soundAlarm: boolean,
}

type MenuItemProps = {
    menuItem: {
        id: number,
        text: JSX.Element,
        title: string,
        pressed: boolean,
        togglable: boolean,
        disabled: boolean,
    },
    events: {
        onClick: (id: number) => void,
        addTimer: (timer: TimerStateProps) => void,
        cancelDelete: () => void,
        onSettingsUpdate: (preferences: Preferences) => void,
        onHideInactiveTimers: (ids: string[]) => void,
    }
}

type TimerStateProps = {
    id?: string,
    name: string,
    note: string,
    alarm: boolean,
    dragged: boolean,
    visible: boolean
}


const MenuItem = ({menuItem, events}: MenuItemProps) => {

    const [hide, pressHide] = useState(false);

    useEffect(() => {
        if (hide) {
            const inactiveTimers = document.getElementsByClassName("time inactive")
            const inactiveTimersIDs = [];
            for (let i=0; i < inactiveTimers.length; i++) {
                inactiveTimersIDs.push(inactiveTimers[i].id.substring(5));
            }
            events.onHideInactiveTimers(inactiveTimersIDs);
            window.electron.updateBadge('');
        }
        else {
            events.onHideInactiveTimers([]);
        }
    }, [hide]);

    return (
        <Button size="lg" disabled={menuItem.disabled} title={menuItem.title}
            variant={`${menuItem.pressed && menuItem.togglable ? 'info' : 'light' }`}
            onClick={() => {
                events.onClick(menuItem.id);
                if (menuItem.id === 1) {    // add timer
                    const timer: TimerStateProps = {
                        name: '',
                        note: '',
                        alarm: false,
                        dragged: false,
                        visible: true,
                    };
                    events.addTimer(timer);
                }
                if (menuItem.id === 2) {   // stop all timers
                    const stopButtons = document.getElementsByClassName("stop-timer");
                    for (let i=0; i < stopButtons.length; i++) {
                        const stopButton = stopButtons[i] as HTMLElement;
                        stopButton.click();
                    }
                }
                if (menuItem.id === 4) {   // hide inactive timers
                    pressHide(!hide);
                }
            }}
            onPointerLeave={() => {
                if (menuItem.id === 3) {
                    events.cancelDelete();
                }
            }}
            aria-controls={menuItem.id === 4 ? "about" : "settings"}
            aria-expanded={`${[5,6].includes(menuItem.id) && menuItem.pressed}`}
        >
            {menuItem.text}
        </Button>
    )
}

export default MenuItem

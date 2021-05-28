import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'

const MenuItem = ({menuItem, onClick, addTimer, cancelDelete, onHideInactiveTimers}) => {

    const [hide, pressHide] = useState(false);

    useEffect(() => {
        if (hide) {
            const inactiveTimers = document.getElementsByClassName("time inactive")
            const inactiveTimersIDs = Array();
            for (var i=0; i < inactiveTimers.length; i++) {
                inactiveTimersIDs.push(inactiveTimers[i].id.substring(5));
            }
            onHideInactiveTimers(inactiveTimersIDs);
        }
        else {
            onHideInactiveTimers([]);
        }
    }, [hide]);

    return (
        <Button size="lg" disabled={menuItem.disabled} title={menuItem.title}
            variant={`${menuItem.pressed && menuItem.togglable ? 'info' : 'light' }`}
            onClick={() => {
                onClick(menuItem.id);
                if (menuItem.id === 1) {    // add timer
                    addTimer({
                        name: '',
                        note: '',
                        alarm: false,
                        dragged: false,
                        visible: true,
                    });
                }
                if (menuItem.id === 2) {   // stop all timers
                    const stopButtons = document.getElementsByClassName("stop-timer");
                    for (var i=0; i < stopButtons.length; i++) {
                        stopButtons[i].click();
                    }
                }
                if (menuItem.id === 4) {   // hide inactive timers
                    pressHide(!hide);
                }
            }}
            onPointerLeave={() => {
                if (menuItem.id === 3) {
                    cancelDelete();
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

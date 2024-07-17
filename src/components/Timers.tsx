import React from 'react';
import Timer from './Timer';
import { Stack } from 'react-bootstrap';


type Preferences = {
    longFormat: boolean,
    duodecimalClock: boolean,
    soundAlarm: boolean
}

type TimerStateProps = {
    id?: string,
    name: string,
    note: string,
    alarm: boolean,
    dragged: boolean,
    visible: boolean
}

type TimersProps = {
    timers: TimerStateProps[],
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
        updateName: (id: string, name: string) => void
    },
    settings: Preferences
}


const Timers = (props: TimersProps) => {
    
    return (
        <section id="timers">
            <Stack direction="vertical" gap={1}>
                {props.timers.map((timer: TimerStateProps) => {
                    if (timer.visible) {
                        return (
                            <Timer  
                                key={timer.id}
                                timer={timer}
                                events={props.events}
                                settings={props.settings}
                            />
                        )
                    }
                })}
            </Stack>
        </section>
    )
}

export default Timers

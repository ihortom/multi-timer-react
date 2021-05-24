import React from 'react';
import Timer from './Timer'

const Timers = ({timers, onDelete, onUp, onDown,
                 onDragOver, onDrop, onDragEnd, onDragLeave, onDragStart,
                 addNote, updateName, settings}) => {

    return (
        <section className="timers">
            {timers.map((timer) => {
                if (timer.visible) {
                    return (<Timer key={timer.id}
                                timer={timer}
                                onDelete={onDelete}
                                onUp={onUp}
                                onDown={onDown}
                                onDragStart={onDragStart}
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                onDragEnd={onDragEnd}
                                onDragLeave={onDragLeave}
                                addNote={addNote}
                                updateName={updateName}
                                settings={settings}
                            />)
                }
            })}
        </section>
    )
}

export default Timers

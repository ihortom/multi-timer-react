// By default, TypeScript won't allow to import an audio file, 
// so it needs to be declared as a module
declare module '*.mp3';

type Preferences = {
    longFormat: boolean,
    duodecimalClock: boolean,
    soundAlarm: boolean,
    soundAlarmMedia?: string | null,
};

type TimerStateProps = {
    id?: string,
    name: string,
    note: string,
    alarm: boolean,
    dragged: boolean,
    visible: boolean
};

type TimeProps = {
    timerId: string,
    time: number,
    init: number,
    new: boolean,
    active: boolean,
    recursive: boolean,
};
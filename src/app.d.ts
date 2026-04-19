declare module '*.mp3';
declare module '*.scss';
declare module '*.css';

type Preferences = {
    longFormat: boolean,
    duodecimalClock: boolean,
    soundAlarm: boolean,
    soundAlarmMedia?: string | null,
    darkMode: boolean,
};

type TimerStateProps = {
    id: string,
    name: string,
    note: string,
    alarm: boolean,
    dragged: boolean,
    visible: boolean
};

type NewTimerProps = Omit<TimerStateProps, 'id'>;

type TimeProps = {
    timerId: string,
    time: number,
    init: number,
    new: boolean,
    active: boolean,
    recursive: boolean,
};
import React from "react";


type ToggleSwitchProps = {
    id: string,
    checked: boolean,
    onSettingsUpdate: (preferences: Preferences) => void,
}


const ToggleSwitch = ({id, checked, onSettingsUpdate}: ToggleSwitchProps) => {

    return (
        <div className="toggle-switch">
            <input type="checkbox" className="toggle-switch-checkbox" 
                id={id} 
                checked={checked}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onSettingsUpdate(
                        {
                            longFormat:    
                                id == 'time-format' ? 
                                e.currentTarget.checked : 
                                (document.getElementById('time-format') as HTMLInputElement).checked,
                            duodecimalClock: 
                                id == 'clock-format' ? 
                                e.currentTarget.checked : 
                                (document.getElementById('clock-format') as HTMLInputElement).checked,
                            soundAlarm:      
                                id == 'sound-alarm' ? 
                                e.currentTarget.checked : 
                                (document.getElementById('sound-alarm') as HTMLInputElement).checked,
                            soundAlarmMedia:
                                id == 'sound-alarm' && e.currentTarget.checked ?
                                (window.localStorage.getItem('soundAlarmMedia') &&
                                window.localStorage.getItem('soundAlarmMedia') !== 'null' && 
                                window.localStorage.getItem('soundAlarmMedia') !== 'undefined' ?
                                window.localStorage.getItem('soundAlarmMedia') :
                                'defaultAlarm') : null,
                        }
                    )
                }}
            />
            <label className="toggle-switch-label" htmlFor={id}>
                <span className="toggle-switch-inner" />
                <span className="toggle-switch-switch" />
            </label>
        </div>
    )
}

export default ToggleSwitch;
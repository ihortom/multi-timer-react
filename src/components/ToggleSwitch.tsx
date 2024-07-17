import React from "react";


type Preferences = {
    longFormat: boolean,
    duodecimalClock: boolean,
    soundAlarm: boolean,
}

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
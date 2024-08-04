import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { renderToString } from 'react-dom/server';
import { FaBell } from 'react-icons/fa6';


type AudioListItemProps = {
    settings: Preferences,
    onSettingsUpdate: (preferences: Preferences) => void,
    audioItem: any,
    title: string
}

const audio = new Audio();
const bellIcon = renderToString(<FaBell />);


const AudioListItem = 
    ({settings, onSettingsUpdate, audioItem, title}: AudioListItemProps) => {
    
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    
    const playAudio = async (path: string) => {
        if (!isAudioPlaying) {
            try {
                audio.setAttribute('src', path);
                setIsAudioPlaying(true);
                await audio.play();
            } catch {
                // Ignore when playing fails
            } 
        }
    };

    const stopAudio = () => {
        if (isAudioPlaying) {
            try {
                audio?.pause();
                setIsAudioPlaying(false);
            } catch {
                // Ignore when pausing fails
            }
        }
    };

    useEffect(() => {
        if (audio.ended || audio.paused) {
            setIsAudioPlaying(false);
        }
    }, [audio]);

    return (
        <Dropdown.Item as="button"
            onClick={(e) => {
                settings.soundAlarmMedia = title;
                window.localStorage.setItem('soundAlarmMedia', title);
                onSettingsUpdate(settings);
                document.getElementById('sound-alarm-media').innerText = title;
                (e.target as HTMLElement).setAttribute('active', 'true')
            }}
            onMouseOver={(e) => {
                try {
                    playAudio(audioItem);
                    (e.target as HTMLElement).innerHTML = title + ' ' + bellIcon;
                } catch {
                    console.log('Over issue')
                }
            }}
            onMouseLeave={(e) => {
                stopAudio();
                (e.target as HTMLElement).innerHTML = title;
            }}
        >{title}</Dropdown.Item>
    );
};

export default AudioListItem;
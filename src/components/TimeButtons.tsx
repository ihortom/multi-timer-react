import Button from 'react-bootstrap/Button';
import { FaRegClock as ClockIcon } from 'react-icons/fa6';


type TimeButtonsProps = {
    onWind: (time: number) => void,
    showClock: () => void,
    clockOpen: boolean,
    timerId: string,
};


const TimeButtons = ({onWind, showClock, clockOpen, timerId}: TimeButtonsProps) => {

    return (
        <div className="time-buttons">
            <Button className="rounded-circle" variant={`${clockOpen ? "primary" : "outline-primary"}`}
                id={`clock-button-${timerId}`}
                aria-controls={`clock-${timerId}`}
                aria-expanded={clockOpen}
                onClick={() => showClock()}><ClockIcon /></Button>
            <Button className="rounded-circle" variant={`${clockOpen ? "outline-primary" : "primary"}`}
                disabled={clockOpen} onClick={() => onWind(1*60)}>1</Button>
            <Button className="rounded-circle" variant={`${clockOpen ? "outline-primary" : "primary"}`}
                disabled={clockOpen} onClick={() => onWind(2*60)}>2</Button>
            <Button className="rounded-circle" variant={`${clockOpen ? "outline-primary" : "primary"}`}
                disabled={clockOpen} onClick={() => onWind(5*60)}>5</Button>
            <Button className="rounded-circle" variant={`${clockOpen ? "outline-primary" : "primary"}`}
                disabled={clockOpen} onClick={() => onWind(10*60)}>10</Button>
            <Button className="rounded-circle" variant={`${clockOpen ? "outline-primary" : "primary"}`}
                disabled={clockOpen} onClick={() => onWind(20*60)}>20</Button>
            <Button className="rounded-circle" variant={`${clockOpen ? "outline-primary" : "primary"}`}
                disabled={clockOpen} onClick={() => onWind(30*60)}>30</Button>
            <Button className="rounded-circle" variant={`${clockOpen ? "outline-primary" : "primary"}`}
                disabled={clockOpen} onClick={() => onWind(60*60)}>60</Button>
        </div>
    );
};

export default TimeButtons;

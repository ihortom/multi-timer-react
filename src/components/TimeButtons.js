import React from 'react';
import Button from 'react-bootstrap/Button';

const TimeButtons = ({onWind}) => {

    return (
        <div className="time-buttons">
            <Button className="rounded-circle" variant="primary"
                onClick={() => onWind(1*60)}>1</Button>
            <Button className="rounded-circle" variant="primary"
                onClick={() => onWind(2*60)}>2</Button>
            <Button className="rounded-circle" variant="primary"
                onClick={() => onWind(5*60)}>5</Button>
            <Button className="rounded-circle" variant="primary"
                onClick={() => onWind(10*60)}>10</Button>
            <Button className="rounded-circle" variant="primary"
                onClick={() => onWind(20*60)}>20</Button>
            <Button className="rounded-circle" variant="primary"
                onClick={() => onWind(30*60)}>30</Button>
            <Button className="rounded-circle" variant="primary"
                onClick={() => onWind(60*60)}>60</Button>
        </div>
    )
}

export default TimeButtons

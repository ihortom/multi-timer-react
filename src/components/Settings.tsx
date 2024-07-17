import { useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleSwitch from './ToggleSwitch';


type Preferences = {
    longFormat: boolean,
    duodecimalClock: boolean,
    soundAlarm: boolean,
}

type SettingsProps = {
    open: boolean,
    settings: {
        longFormat: boolean,
        duodecimalClock: boolean,
        soundAlarm: boolean,
    },
    onSettingsUpdate: (preferences: Preferences) => void,
}


const Settings = ({open, settings, onSettingsUpdate}: SettingsProps) => {

    useEffect(() => {
        const timersBlock = document.getElementById("timers");
        if (timersBlock !== null)
            open ? timersBlock.style.display = "none" : timersBlock.style.display = "block";

        const alertBlock = document.getElementById("alert");
        if (alertBlock !== null)
            open ? alertBlock.style.display = "none" : alertBlock.style.display = "block";
        }, [open]
    )

    return (
        <Collapse in={open}>
            <section id="settings" className="info">
                <h3 className="lead">Preferences</h3>
                <Card>
                    <Card.Header as="h6">Time format</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            <Row>
                                <Col className='left-value'>HH:MM</Col>
                                <Col xs={2}>
                                    <ToggleSwitch 
                                        id="time-format"
                                        checked={settings.longFormat}
                                        onSettingsUpdate={onSettingsUpdate}
                                    />       
                                </Col>
                                <Col className='right-value'>HH:MM:SS</Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header as="h6">Clock format</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            <Row>
                                <Col className='left-value'>24H</Col>
                                <Col xs={2}>
                                    <ToggleSwitch 
                                        id="clock-format"
                                        checked={settings.duodecimalClock}
                                        onSettingsUpdate={onSettingsUpdate}
                                    />
                                </Col>
                                <Col className='right-value'>12H</Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header as="h6">Sound alarm</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            <Row>
                                <Col className='left-value'>OFF</Col>
                                <Col xs={2}>
                                    <ToggleSwitch 
                                        id="sound-alarm"
                                        checked={settings.soundAlarm}
                                        onSettingsUpdate={onSettingsUpdate}
                                    />  
                                </Col>
                                <Col className='right-value'>ON</Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            </section>
        </Collapse>
    )
}

export default Settings

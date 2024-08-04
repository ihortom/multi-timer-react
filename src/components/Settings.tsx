import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ToggleSwitch from './ToggleSwitch';
import AudioListItem from './AudioListItem';

import defaultAlarm from '../../assets/default.mp3';
import bonusAlarm from '../../assets/bonus.mp3';
import facilityAlarm from '../../assets/facility.mp3';
import futuristicAlarm from '../../assets/futuristic.mp3';
import treasureAlarm from '../../assets/treasure.mp3';
import unlockAlarm from '../../assets/unlock.mp3';
import winningAlarm from '../../assets/winning.mp3';


type SettingsProps = {
    open: boolean,
    settings: Preferences,
    onSettingsUpdate: (preferences: Preferences) => void,
};


const Settings = ({open, settings, onSettingsUpdate}: SettingsProps) => {

    const audioList = new Map([
        ['Default', defaultAlarm],
        ['Bonus', bonusAlarm],
        ['Facility', facilityAlarm],
        ['Futuristic', futuristicAlarm],
        ['Treasure', treasureAlarm],
        ['Unlock', unlockAlarm],
        ['Winning', winningAlarm]       
    ]);

    return (
        <Collapse
            in={open}
            onEnter={() => {
                const timersBlock = document.getElementById("timers");
                if (timersBlock !== null && open)
                    timersBlock.style.display = "none";

                const alertBlock = document.getElementById("alert");
                if (alertBlock !== null && open)
                    alertBlock.style.display = "none";
            }}
            onExited={() => {
                const timersBlock = document.getElementById("timers");
                if (timersBlock !== null && !open)
                    timersBlock.style.display = "block";

                const alertBlock = document.getElementById("alert");
                if (alertBlock !== null && !open)
                    alertBlock.style.display = "block";
            }}
        >
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
                            {
                                settings.soundAlarm &&
                                <>
                                <Row className='filler'></Row>
                                <Row>
                                    <Col>
                                        <DropdownButton 
                                            id="sound-alarm-media"
                                            variant="info"
                                            title={
                                                Array.from(audioList.keys()).includes(settings.soundAlarmMedia) ? 
                                                settings.soundAlarmMedia : 'Default'
                                            }
                                        >
                                            <Dropdown.Header>Select alarm sound</Dropdown.Header>
                                            {
                                                Array.from(audioList.entries()).map((audioItem) => {
                                                    return (
                                                        <AudioListItem
                                                            key={audioItem[0]}
                                                            settings={settings}
                                                            onSettingsUpdate={onSettingsUpdate}
                                                            audioItem={audioItem[1]}
                                                            title={audioItem[0]}
                                                        />
                                                    )
                                                })
                                            }
                                        </DropdownButton>
                                    </Col>
                                </Row>
                                </>
                            }
                        </Container>
                    </Card.Body>
                </Card>
            </section>
        </Collapse>
    );
};

export default Settings;

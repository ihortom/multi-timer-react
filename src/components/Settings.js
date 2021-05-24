import React from 'react'
import Collapse from 'react-bootstrap/Collapse'
import Card from 'react-bootstrap/Card'



const Settings = ({open, settings, onSettingsUpdate}) => {

  return (
    <Collapse in={open}>
      <section id="settings" className="info">
        <h3 className="lead">Preferences</h3>
        <Card>
          <Card.Header as="h6">Time format</Card.Header>
          <Card.Body>
            <span className="label">&nbsp;&nbsp;&nbsp;HH:MM</span>
            <label className="switch">
              <input type="checkbox" id="time-format" checked={settings.longFormat}
                onChange={(e) => onSettingsUpdate({
                  longFormat: e.currentTarget.checked,
                  soundAlarm: document.getElementById('sound-alarm').checked
                  })}
              ></input>
              <span className="slider round"></span>
            </label>
            <span className="label">HH:MM:SS</span>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header as="h6">Sound alarm</Card.Header>
          <Card.Body>
            <span className="label">OFF</span>
            <label className="switch">
              <input type="checkbox" id="sound-alarm" checked={settings.soundAlarm}
                onChange={(e) => onSettingsUpdate({
                  longFormat: document.getElementById('time-format').checked,
                  soundAlarm: e.currentTarget.checked
                  })}
              ></input>
              <span className="slider round"></span>
            </label>
            <span className="label">ON&nbsp;</span>
          </Card.Body>
        </Card>
        <hr />
      </section>
    </Collapse>
  )
}

export default Settings

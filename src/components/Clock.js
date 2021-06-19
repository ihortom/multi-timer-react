import React, { useState, useEffect } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import { GoClock } from 'react-icons/go'

const Clock = ({open, timerId, time, getTime, duodecimalClock, setHoursElement, setMinutesElement}) => {

    const active = time.getTime() > 0 ? true : false;

    const [clockFormat, setFormat] = useState(() => {
        const current = new Date();
        const duoType = current.getHours() > 12 ? 'PM' : 'AM';
        return duodecimalClock ? duoType : '24H';
    });

    useEffect(() => {
        const current = new Date();
        const duoType = current.getHours() > 12 ? 'PM' : 'AM';
        setFormat(duodecimalClock ? duoType : '24H');
    }, [duodecimalClock]);

    const [clockTime, setTime] = useState(time);

    const handleSelect = (e) => {
        setFormat(e);
    }

    useEffect(() => {
        const hrs = document.querySelector(`#clock-${timerId} .hours`);
        validateHours(hrs);
    }, [clockFormat]);

    const validateHours = (element) => {
        const now = new Date();
        if (element.value == '') {
            element.className = "hours form-control";
        }
        else {
            const hours = parseInt(element.value);

            if (clockFormat === '24H') {
                if (hours < 0 || hours > 23 || isNaN(hours)) {
                    setTime(new Date(0));
                    element.className = "hours form-control warning";
                }
                else {
                    now.setHours(hours)
                    now.setMinutes(clockTime.getMinutes())
                    now.setSeconds(clockTime.getSeconds())
                    setTime(now)
                    element.className = "hours form-control";
                }
            }
            else {
                if (hours < 0 || hours > 12 || isNaN(hours)) {
                    setTime(new Date(0));
                    element.className = "hours form-control warning";
                }
                else {
                    if (clockFormat === 'AM') {
                        now.setHours(hours)
                        now.setMinutes(clockTime.getMinutes())
                        now.setSeconds(clockTime.getSeconds())
                        setTime(now)
                    }
                    else {
                        now.setHours(hours + 12)
                        now.setMinutes(clockTime.getMinutes())
                        now.setSeconds(clockTime.getSeconds())
                        setTime(now)
                    }
                    element.className = "hours form-control";
                }
            }
        }
    }

    const validateMinutes = (element) => {
        const now = new Date();
        if (element.value == '') {
            element.className = "hours form-control";
        }
        else {
            const minutes = parseInt(element.value);
            if (minutes < 0 || minutes > 59 || isNaN(minutes)) {
                setTime(new Date(0));
                element.className = "minutes form-control warning";
            }
            else {
                const hours = clockTime.getTime() ? clockTime.getHours() : 0;
                now.setHours(hours);
                now.setMinutes(minutes);
                now.setSeconds(clockTime.getSeconds());
                setTime(now);
                element.className = "minutes form-control";
            }
        }
    }

    const pretify = (element) => {
        const value = parseInt(element.value);
        if (!isNaN(value)) {
            element.value = value < 10 ? '0' + value : value;
        }
    }

    useEffect(() => {
        const hrs = document.querySelector(`#clock-${timerId} .hours`);
        const min = document.querySelector(`#clock-${timerId} .minutes`);

        if (open) {   // clock opens
            setTime(time);

            if (time.toString() === new Date(0).toString()) {
                hrs.value = '';
                min.value = '';
            }
            else {
                const hours = time.getHours();
                const minutes = time.getMinutes();

                hrs.value = hours < 10 ? '0' + hours : hours;
                min.value = minutes < 10 ? '0' + minutes : minutes;
            }
        }
        else {      // clock closes
            if ((hrs.value === '' && min.value === '') || clockTime.toString() === new Date(0).toString()) {
                hrs.value = ''; hrs.className = "hours form-control";
                min.value = ''; min.className = "minutes form-control";
                getTime(new Date(0));
            }
            else if (clockTime > new Date() && !active) {
                getTime(clockTime);
            }
            else if (!active) {
                getTime(new Date(clockTime.setHours(clockTime.getHours() + 24)));
            }
        }
    }, [open]);

    return (
        <Collapse in={open} dimension="width" timeout={100}
            onEntered={() => {
                const hoursElement = document.querySelector('#' + `clock-${timerId}` + ' .hours');
                const minutesElement = document.querySelector('#' + `clock-${timerId}` + ' .minutes');
                hoursElement.focus();
                setHoursElement(hoursElement);
                setMinutesElement(minutesElement);
            }}
        >
            <InputGroup className="clock" size="sm" id={`clock-${timerId}`}>
                <InputGroup.Prepend>
                    <InputGroup.Text><GoClock /></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="hours" placeholder="H" disabled={active}
                    type="text"
                    onChange={(e) => {
                            e.preventDefault();
                            validateHours(e.target);
                            setHoursElement(e.target);
                            setMinutesElement(e.target.nextElementSibling);
                    }}
                    onBlur={(e) => {
                        pretify(e.target);
                    }}
                />
                <FormControl className="minutes" placeholder="M" disabled={active}
                    type="text"
                    onChange={(e) => {
                            e.preventDefault();
                            validateMinutes(e.target);
                            setMinutesElement(e.target);
                            setHoursElement(e.target.previousElementSibling);
                    }}
                    onBlur={(e) => {
                        pretify(e.target);
                    }}
                />
                <InputGroup className="legend">
                    <DropdownButton
                        title={clockFormat}
                        onSelect={handleSelect}
                    >
                        <Dropdown.Item eventKey="AM">AM</Dropdown.Item>
                        <Dropdown.Item eventKey="PM">PM</Dropdown.Item>
                        <Dropdown.Item eventKey="24H">24H</Dropdown.Item>
                    </DropdownButton>
                </InputGroup>
            </InputGroup>
        </Collapse>
    )
}

export default Clock

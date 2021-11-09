import React, { useState, useEffect } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import { GoClock } from 'react-icons/go'

const Clock = ({open, timerId, time, countdown, duodecimalClock,
                getTime, setHoursElement, setMinutesElement}) => {

    const active = countdown > 0 ? true : false;

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
            return true
        }
        else {
            const hours = /^(\d+)$/.test(element.value) ? parseInt(element.value) : -1
            const minutes = /^(\d+)$/.test(element.nextElementSibling.value) ? parseInt(element.nextElementSibling.value) : 0

            if (clockFormat === '24H') {
                if (hours < 0 || hours > 23 || isNaN(hours)) {
                    setTime(new Date(0));
                    element.className = "hours form-control warning";
                    return false
                }
                else {
                    now.setHours(hours)
                    now.setMinutes(minutes)
                    now.setSeconds(0)
                    setTime(now)
                    element.className = "hours form-control";
                    if (hours > 9 || element.value.length >= 2) {
                        element.nextElementSibling.focus();
                    }
                    return true
                }
            }
            else {  // '12H: AM/PM'
                if (hours < 0 || hours > 12 || isNaN(hours)) {
                    setTime(new Date(0));
                    element.className = "hours form-control warning";
                    return false
                }
                else {
                    if (clockFormat === 'AM') {
                        now.setHours(hours)
                        now.setMinutes(minutes)
                        now.setSeconds(0)
                        setTime(now)
                    }
                    else {
                        now.setHours(hours + 12)
                        now.setMinutes(minutes)
                        now.setSeconds(0)
                        setTime(now)
                    }
                    element.className = "hours form-control";
                    if (hours > 9 || element.value.length >= 2) {
                        element.nextElementSibling.focus();
                    }
                    return true
                }
            }
        }
    }

    const validateMinutes = (element) => {
        const now = new Date();
        if (element.value == '') {
            now.setHours(clockTime.getHours());
            now.setMinutes(0);
            now.setSeconds(0);
            setTime(now);
            element.className = "hours form-control";
            return true
        }
        else {
            const minutes = /^(\d+)$/.test(element.value) ? parseInt(element.value) : -1
            if (minutes < 0 || minutes > 59 || isNaN(minutes)) {
                setTime(new Date(0));
                element.className = "minutes form-control warning";
                return false
            }
            else {
                const hours = /^(\d+)$/.test(element.previousElementSibling.value) ? parseInt(element.previousElementSibling.value) : 0
                now.setHours(hours);
                now.setMinutes(minutes);
                now.setSeconds(0);
                setTime(now);
                element.className = "minutes form-control";
                return true
            }
        }
    }

    const pretify = (element) => {
        const value = /^(\d+)$/.test(element.value) ? parseInt(element.value) : -1
        if (!isNaN(value)) {
            element.value = value >= 10 ? value.toString() :
                              value < 0 ? '00' : '0' + value;
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
                let hours = time.getHours();
                let minutes = time.getMinutes();
                if (clockFormat !== '24H') {
                    if (hours > 12) {
                        hours = time.getHours() - 12;
                        setFormat('PM');
                    }
                    else {
                        setFormat('AM');
                    }
                }

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
            else if (clockTime > new Date() && !active) {   // clock set today ahead of current time
                getTime(clockTime);
            }
            else if (!active) {     // clock set previous days or time is ealier than current time
                const d = new Date();
                const clockTimeStr = clockTime.toTimeString().substr(0,8);
                const curentTimeStr = d.toTimeString().substr(0,8);
                if (clockTimeStr > curentTimeStr) {
                    getTime(new Date(clockTime.setDate(d.getDate())));
                }
                else {
                    getTime(new Date(clockTime.setDate(d.getDate() + 1)));
                }
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
                            setHoursElement(e.target);
                            setMinutesElement(e.target.nextElementSibling);
                    }}
                    onBlur={(e) => {
                        pretify(e.target);
                        pretify(e.target.nextElementSibling);
                        e.target.nextElementSibling.select();
                    }}
                    onKeyUp={(e) => {
                        if (validateHours(e.target) && e.keyCode === 13) {
                            const clockBtn = document.querySelector(`#clock-button-${timerId}`);
                            clockBtn.click();
                        }
                    }}
                />
                <FormControl className="minutes" placeholder="M" disabled={active}
                    type="text"
                    onChange={(e) => {
                            e.preventDefault();
                            setMinutesElement(e.target);
                            setHoursElement(e.target.previousElementSibling);
                    }}
                    onBlur={(e) => {
                        pretify(e.target);
                        pretify(e.target.previousElementSibling);
                    }}
                    onKeyUp={(e) => {
                        if (validateMinutes(e.target) && e.keyCode === 13) {
                            const clockBtn = document.querySelector(`#clock-button-${timerId}`);
                            clockBtn.click();
                        }
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

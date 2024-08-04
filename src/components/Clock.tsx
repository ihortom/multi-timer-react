import { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { GoClock as ClockIcon } from 'react-icons/go';


type ClockProps = {
    open: boolean,
    timerId: string,
    time: Date,
    countdown: number,
    duodecimalClock: boolean,
    getTime: (time: Date) => void,
    setHoursElement: (element: HTMLInputElement) => void,
    setMinutesElement: (element: HTMLInputElement) => void,
};


const Clock = ({open, timerId, time, countdown, duodecimalClock,
                getTime, setHoursElement, setMinutesElement}: ClockProps) => {

    const active = countdown > 0 ? true : false;

    const [clockFormat, setClockFormat] = useState(() => {
        const current = new Date();
        const duoType = current.getHours() > 12 ? 'PM' : 'AM';
        return duodecimalClock ? duoType : '24H';
    });

    useEffect(() => {
        const current = new Date();
        const duoType = current.getHours() > 12 ? 'PM' : 'AM';
        setClockFormat(duodecimalClock ? duoType : '24H');
    }, [duodecimalClock]);

    const [clockTime, setTime] = useState(time);

    const handleSelect = (e: string) => {
        setClockFormat(e);
    };

    useEffect(() => {
        const hrs = document.querySelector(`#clock-${timerId} .hours`) as HTMLInputElement;
        validateHours(hrs);
    }, [clockFormat]);

    const validateHours = (element: HTMLInputElement) => {
        const now = new Date();
        if (element.value == '') {
            element.className = "hours form-control";
            return true;
        }
        else {
            const hours = /^(\d+)$/.test(element.value) ? parseInt(element.value) : -1;
            const minutes = /^(\d+)$/
                .test((element.nextElementSibling as HTMLInputElement).value) ? 
                parseInt((element.nextElementSibling as HTMLInputElement).value) : 0;

            if (clockFormat === '24H') {
                if (hours < 0 || hours > 23 || isNaN(hours)) {
                    setTime(new Date(0));
                    element.className = "hours form-control warning";
                    return false;
                }
                else {
                    now.setHours(hours);
                    now.setMinutes(minutes);
                    now.setSeconds(0);
                    setTime(now);
                    element.className = "hours form-control";
                    if (hours > 9 || element.value.length >= 2) {
                        (element.nextElementSibling as HTMLInputElement).focus();
                    }
                    return true;
                }
            }
            else {  // '12H: AM/PM'
                if (hours < 0 || hours > 12 || isNaN(hours)) {
                    setTime(new Date(0));
                    element.className = "hours form-control warning";
                    return false;
                }
                else {
                    if (clockFormat === 'AM') {
                        now.setHours(hours);
                        now.setMinutes(minutes);
                        now.setSeconds(0);
                        setTime(now);
                    }
                    else {
                        now.setHours(hours + 12);
                        now.setMinutes(minutes);
                        now.setSeconds(0);
                        setTime(now);
                    }
                    element.className = "hours form-control";
                    if (hours > 9 || element.value.length >= 2) {
                        (element.nextElementSibling as HTMLInputElement).focus();
                    }
                    return true;
                }
            }
        }
    };

    const validateMinutes = (element: HTMLInputElement) => {
        const now = new Date();
        if (element.value == '') {
            now.setHours(clockTime.getHours());
            now.setMinutes(0);
            now.setSeconds(0);
            setTime(now);
            element.className = "hours form-control";
            return true;
        }
        else {
            const minutes = /^(\d+)$/.test(element.value) ? parseInt(element.value) : -1
            if (minutes < 0 || minutes > 59 || isNaN(minutes)) {
                setTime(new Date(0));
                element.className = "minutes form-control warning";
                return false;
            }
            else {
                const hours = /^(\d+)$/
                    .test((element.previousElementSibling as HTMLInputElement).value) ? 
                    parseInt((element.previousElementSibling as HTMLInputElement).value) : 0
                clockFormat === '24H' || clockFormat == 'AM' ? now.setHours(hours) : now.setHours(hours + 12)
                now.setMinutes(minutes);
                now.setSeconds(0);
                setTime(now);
                element.className = "minutes form-control";
                return true;
            }
        }
    };

    const pretify = (element: HTMLInputElement) => {
        const value = /^(\d+)$/.test(element.value) ? parseInt(element.value) : -1
        if (!isNaN(value)) {
            element.value = value >= 10 ? value.toString() :
                              value < 0 ? '00' : '0' + value;
        }
    };

    useEffect(() => {
        const hrs = document.querySelector(`#clock-${timerId} .hours`) as HTMLInputElement;
        const min = document.querySelector(`#clock-${timerId} .minutes`) as HTMLInputElement;

        if (open) {   // clock opens
            setTime(time);

            if (time.toString() === new Date(0).toString()) {
                hrs.value = '';
                min.value = '';
            }
            else {
                let hours = time.getHours();
                const minutes = time.getMinutes();
                if (clockFormat !== '24H') {
                    if (hours > 12) {
                        hours = time.getHours() - 12;
                        setClockFormat('PM');
                    }
                    else {
                        setClockFormat('AM');
                    }
                }

                hrs.value = hours < 10 ? '0' + hours : hours.toString();
                min.value = minutes < 10 ? '0' + minutes : minutes.toString();
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
                const clockTimeStr = clockTime.toTimeString().slice(0,8);
                const curentTimeStr = d.toTimeString().slice(0,8);
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
        <Collapse in={open} dimension="width" timeout={0}
            onEntered={() => {
                const hoursElement = document.querySelector('#' + `clock-${timerId}` + ' .hours') as HTMLInputElement;
                const minutesElement = document.querySelector('#' + `clock-${timerId}` + ' .minutes') as HTMLInputElement;
                (hoursElement as HTMLInputElement).focus();
                setHoursElement(hoursElement);
                setMinutesElement(minutesElement);
            }}
        >
            <InputGroup className="clock" size="sm" id={`clock-${timerId}`}>
                <InputGroup.Text><ClockIcon /></InputGroup.Text>
                <FormControl className="hours" placeholder="H" disabled={active}
                    type="text"
                    onChange={(e) => {
                            e.preventDefault();
                            setHoursElement(e.target as HTMLInputElement);
                            setMinutesElement(e.target.nextElementSibling as HTMLInputElement);
                    }}
                    onBlur={(e) => {
                        pretify(e.target as HTMLInputElement);
                        pretify(e.target.nextElementSibling as HTMLInputElement);
                        (e.target.nextElementSibling as HTMLInputElement).select();
                    }}
                    onKeyUp={(e) => {
                        if (validateHours(e.target as HTMLInputElement) && e.key === 'Enter') {
                            const clockBtn = document.querySelector(`#clock-button-${timerId}`) as HTMLElement;
                            clockBtn.click();
                        }
                    }}
                />
                <FormControl className="minutes" placeholder="M" disabled={active}
                    type="text"
                    onChange={(e) => {
                            e.preventDefault();
                            setMinutesElement(e.target as HTMLInputElement);
                            setHoursElement(e.target.previousElementSibling as HTMLInputElement);
                    }}
                    onBlur={(e) => {
                        pretify(e.target as HTMLInputElement);
                        pretify(e.target.previousElementSibling as HTMLInputElement);
                    }}
                    onKeyUp={(e) => {
                        if (validateMinutes(e.target as HTMLInputElement) && e.key === 'Enter') {
                            const clockBtn = document.querySelector(`#clock-button-${timerId}`);
                            (clockBtn as HTMLElement).click();
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
    );
};

export default Clock;

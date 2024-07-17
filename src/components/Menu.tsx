import ButtonGroup from 'react-bootstrap/ButtonGroup';
import MenuItem from './MenuItem';
import About from './About'
import Settings from './Settings'


type Preferences = {
    longFormat: boolean,
    duodecimalClock: boolean,
    soundAlarm: boolean,
}

type MenuItemProps = {
    id: number,
    text: JSX.Element,
    title: string,
    pressed: boolean,
    togglable: boolean,
    disabled: boolean,
}

type TimerStateProps = {
    id?: string,
    name: string,
    note: string,
    alarm: boolean,
    dragged: boolean,
    visible: boolean,
}

type MenuItemsProps = {
    menuItems: MenuItemProps[],
    events: {
        onClick: (id: number) => void,
        addTimer: (timer: TimerStateProps) => void,
        cancelDelete: () => void,
        onSettingsUpdate: (preferences: Preferences) => void,
        onHideInactiveTimers: (ids: string[]) => void,
    },
    settings: Preferences,
}


const Menu = (props: MenuItemsProps) => {

    const menuItems = props.menuItems;

    return (
        <header className="menu text-center">
            <ButtonGroup aria-label="Menu">
                {
                    menuItems
                        .map((menuItem) => { 
                            return(
                                <MenuItem
                                    key={menuItem.id}
                                    menuItem={menuItem}
                                    events={props.events}
                                />
                            )}
                        )
                }
            </ButtonGroup>
            <Settings
                open={menuItems[4].pressed}
                settings={props.settings}
                onSettingsUpdate={props.events.onSettingsUpdate}
            />
            <About open={menuItems[5].pressed} />
        </header>
    )
}

export default Menu

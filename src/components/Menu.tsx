import ButtonGroup from 'react-bootstrap/ButtonGroup';
import MenuItem from './MenuItem';
import About from './About';
import Settings from './Settings';
import { MenuItemProps } from './MenuItem';


type MenuItemsProps = {
    menuItems: MenuItemProps["menuItem"][],
    events: {
        onClick: (id: number) => void,
        addTimer: (timer: TimerStateProps) => void,
        cancelDelete: () => void,
        onSettingsUpdate: (preferences: Preferences) => void,
        onHideInactiveTimers: (ids: string[]) => void,
    },
    settings: Preferences,
};


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
    );
};

export default Menu;

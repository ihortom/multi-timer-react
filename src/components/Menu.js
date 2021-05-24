import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import MenuItem from "./MenuItem"
import About from './About'
import Settings from './Settings'

const Menu = ({menuItems, onClick, addTimer, cancelDelete, settings, onSettingsUpdate, onHideInactiveTimers}) => {

    return (
        <header className="menu">
            <ButtonGroup aria-label="Menu">
                {menuItems.map((menuItem) => { return(
                    <MenuItem
                        key={menuItem.id}
                        menuItem={menuItem}
                        onClick={onClick}
                        addTimer={addTimer}
                        cancelDelete={cancelDelete}
                        onHideInactiveTimers={onHideInactiveTimers}
                    />
                )})}
            </ButtonGroup>
            <Settings
                open={menuItems[4].pressed}
                settings={settings}
                onSettingsUpdate={onSettingsUpdate}
            />
            <About open={menuItems[5].pressed}/>
        </header>
    )
}

export default Menu

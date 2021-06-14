import React from 'react'
import Collapse from 'react-bootstrap/Collapse'
import Card from 'react-bootstrap/Card'


const About = ({open}) => {

    const app = {
        name: "Multi-Timer",
        version: "1.1.0",
        node: "12.16.2",
        electron: "10.4.3",
        react: "16.13.1",
        bootstrap: "4.6.0",
    }

    return (
        <Collapse in={open}>
            <section id="about" className="info">
                <Card>
                    <Card.Header as="h3">
                        {app.name}
                        <br /><sup className="small">Version {app.version}</sup>
                    </Card.Header>
                    <Card.Body>
                    <p>Built with Electron framework and powered by React and Bootstrap.</p>
                    <p>
                        Used modules are node {app.node},<br />
                        Electron {app.electron},<br />
                        React {app.react},<br />
                        and Bootstrap {app.bootstrap}.
                    </p>
                    </Card.Body>
                    <Card.Footer className="text-muted smaller">Copyright &copy; 2021 Ihor Tomilenko</Card.Footer>
                </Card>
                <hr />
            </section>
        </Collapse>
    )
}

export default About

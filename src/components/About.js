import React, { useState, useEffect, useRef } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import { GoCheck } from 'react-icons/go'

const About = ({open}) => {

    const app = {
        name: "Multi-Timer",
        version: "1.2.1",
        node: "12.16.2",
        electron: "10.4.7",
        react: "16.13.1",
        bootstrap: "4.6.0",
    }

    const [isLastVersion, setIsLastVersion] = useState(null);

    const lastVersion = useRef(null);

    const fetchReleases = async () => {
        try {
            const res = await fetch('https://tomilenko.tk/download/releases.json');

            if (res.ok) {
                return await res.json();
            }
            else {
                return null;
            }
        }
        catch (err) {
            return null;
        }
    }

    useEffect(() => {
        const versionStatus = document.getElementById('version-check');

        if (isLastVersion) {
            versionStatus.innerText = "You've got the latest version";
        }
        else {
            if (lastVersion.current !== null) {
                versionStatus.innerHTML = 'Version ' + lastVersion.current.version + 
                    ' is availble. <a target="_blank" class="open-externally" href="' + 
                    lastVersion.current.url + '">Download</a>';
            }
            window.electron.configureExternalLinks();
        }
    }, [isLastVersion, lastVersion]);

    return (
        <Collapse in={open}
            onEntered={async () => {
                const data =  await fetchReleases();

                if (data !== null) {
                    const releases = Object.keys(data.releases);
                    const relHashes = releases.map(i => 
                        [i, parseInt(i.split('.')[0])*10000 + parseInt(i.split('.')[1])*100 + parseInt(i.split('.')[2]), data.releases[i]])

                    const maxHash = Math.max(...relHashes.map(i => i[1]))
                    const latestRelease = relHashes.filter(i => i[1] === maxHash)[0]

                    lastVersion.current = {
                        "version": latestRelease[0], 
                        "url": latestRelease[2]
                    };

                    const curVerString = app.version.split('.');
                    const currentHash = parseInt(curVerString[0])*10000 + parseInt(curVerString[1])*100 + parseInt(curVerString[2]);

                    if (currentHash >= latestRelease[1]) {
                        setIsLastVersion(true);
                    }
                    else {
                        setIsLastVersion(false);
                    }
                }
                else {
                    const verCheckHeader = document.getElementById('version-check-header');
                    verCheckHeader.hidden = true;
                }
            }}
        >
            <section id="about" className="info">
                <Card>
                    <Card.Header as="h4">
                        {app.name}
                        <br /><sup className="small">Version {app.version}</sup>
                    </Card.Header>
                    <Card.Header id="version-check-header">
                        <Spinner animation="border" variant="dark" size="sm" 
                            className={`${isLastVersion === null ? "" : "hidden"}`}
                        />{' '}
                        <GoCheck
                            className={`text-success ${isLastVersion ? "visible" : "hidden"}`}
                        />{' '}
                        <span id="version-check">Checking for updates...</span>
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


import { useState, version as reactVersion } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { FaCheck as CheckIcon } from 'react-icons/fa6';
import appPackage from '../../package.json';
import bootstrapPackage from 'bootstrap/package.json';


type AboutProps = {
    open: boolean,
};


const stripRange = (v: string) => v.replace(/^[\^~]/, '');


const About = ({open}: AboutProps) => {

    const app = {
        name: appPackage.productName,
        version: appPackage.version,
        node: window.electron.versions.node,
        electron: window.electron.versions.electron,
        react: reactVersion,
        typescript: stripRange(appPackage.devDependencies.typescript),
        bootstrap: bootstrapPackage.version,
        year: new Date().getFullYear(),
    }

    const [isLastVersion, setIsLastVersion] = useState<boolean | null>(null);

    const [lastVersion, setLastVersion] = useState<{ version: string; url: string } | null>(null);

    const fetchReleases = async () => {
        try {
            const res = await fetch('https://ihortom.github.io/download/releases.json', {
                cache: 'no-store',
            });

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
            onEntered={async () => {
                const data =  await fetchReleases();

                if (data !== null) {
                    const releases = Object.keys(data.releases);
                    const relHashes = releases.map(i =>
                        [i, parseInt(i.split('.')[0])*10000 + parseInt(i.split('.')[1])*100 + parseInt(i.split('.')[2]), data.releases[i]]);

                    const maxHash = Math.max(...relHashes.map(i => i[1]));
                    const latestRelease = relHashes.filter(i => i[1] === maxHash)[0];

                    const entry = latestRelease[2];
                    const arch = window.electron.arch;
                    const url = typeof entry === 'string'
                        ? entry
                        : (entry[arch] ?? entry.x64 ?? entry.arm64);

                    setLastVersion({
                        version: latestRelease[0],
                        url: url
                    });

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
                    if (verCheckHeader) verCheckHeader.hidden = true;
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
                            className={`${isLastVersion === null ? "" : "d-none"}`}
                        />{' '}
                        <CheckIcon
                            className={`text-success ${isLastVersion ? "visible" : "hidden"}`}
                        />{' '}
                        <span id="version-check">
                            {isLastVersion === null && "Checking for updates..."}
                            {isLastVersion === true && "You've got the latest version"}
                            {isLastVersion === false && lastVersion && (
                                <>
                                    Version {lastVersion.version} is available.{' '}
                                    <a
                                        href={lastVersion.url}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.electron.openExternal(lastVersion.url);
                                        }}
                                    >
                                        Download
                                    </a>
                                </>
                            )}
                        </span>
                    </Card.Header>
                    <Card.Body>
                    <p>Built with Electron framework and powered by React, TypeScript, and Bootstrap.</p>
                    <p>
                        Used modules are Node {app.node},<br />
                        Electron {app.electron},<br />
                        React {app.react},<br />
                        TypeScript {app.typescript},<br />
                        and Bootstrap {app.bootstrap}.
                    </p>
                    </Card.Body>
                    <Card.Footer className="text-muted smaller">
                        Copyright &copy; {app.year} Ihor Tomilenko
                    </Card.Footer>
                </Card>
            </section>
        </Collapse>
    );
};

export default About;

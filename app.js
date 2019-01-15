const http = require('http');
const {LokaliseAPI} = require('node-lokalise-api');

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const server = http.createServer(() => {
    async function lokaliseDash() {
        try {
            const api = new LokaliseAPI({token: '620b7094823c3e398233a6a368847f39dc38c417'});
            const {projects} = await api
                .projects
                .list({page: 1, limit: 100});
            try {
                contributorsList, translations_list = [];
                for (const project of projects) {
                    if (project.project_id) {

                        const translations = await api.translations.list(project.project_id, {page: 1, limit: 100});
                            translations_list = [...translations_list,...translations];

                        const {contributors} = await api.contributors.list(project.project_id, {page: 1,limit: 1000});
                        if (contributorsList.length > 0) {
                            const contributorsNew = contributors.reduce((accumulator, newCon) => {
                                const exist = contributorsList.find((oldCon) => (oldCon.user_id === newCon.user_id) && oldCon)
                                if (!exist) {
                                    accumulator.push(newCon);
                                }
                                return accumulator;
                            }, []);
                            contributorsList = [...contributorsList,...contributorsNew];
                        } else {
                            contributorsList = [...contributorsList,...contributors];
                        }
                    }
                }

                console.log(contributorsList);
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }
    lokaliseDash();
});

server.listen(port, () => {
    console.log(`The Port is open on ${port} head to localhost:${port} to access the site`);
});

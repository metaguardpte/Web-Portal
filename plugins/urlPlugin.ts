const { BASE_URL } = process.env;
const fs = require('fs');
const path = require('path');

export default (api: any) => {
    function createDir() {
        const dir = path.join(__dirname, '../src/.hub');
        fs.mkdir(dir, { recursive: true }, (err: any) => {
            if (err) {
                throw err;
            }
        });
        return dir;
    }

    function createFile(filePath, text) {
        fs.writeFile(filePath, text, (err: string) => {
            if (err) {
                throw console.error(err);
            }
        });
    }
    api.onStart(() => {
        const dir = createDir();

        let configPath = dir + '/config.ts';
        let text = `export const baseUrl = "${BASE_URL}"\n`;
        createFile(configPath, text);
    });
};

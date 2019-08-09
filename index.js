const https = require('https');
const fs = require('fs')

let data = fs.readFileSync('./config.json');
const {username, port, secret} = JSON.parse(data);

function execute(command) {
    const exec = require('child_process').exec
  
    exec(command, (err, stdout, stderr) => {
      process.stdout.write(stdout)
      console.log(err)
    })
  }

https.get('https://core.telegram.org/getProxySecret', res => {
    let datas = '';
    res.on('data', data => {
        datas += data;
    })

    res.on('end', () => {
            fs.writeFile('proxy-secret', datas, err => {
                // console.log(err)
            });
      });
})

https.get('https://core.telegram.org/getProxyConfig', res => {
    let datas = '';
    res.on('data', data => {
        datas += data;
    })

    res.on('end', () => {
            fs.writeFile('proxy-multi.conf', datas, err => {
                // console.log(err)
            });
      });
})

setInterval(() => {
    console.log('new config')
    https.get('https://core.telegram.org/getProxyConfig', res => {
    let datas = '';
    res.on('data', data => {
        datas += data;
    })

    res.on('end', () => {
            fs.writeFile('proxy-multi.conf', datas, err => {
                console.log(err)
            });
      });
})
}, 24 * 60 * 60 * 1000);



execute(`./mtproto-proxy -u ${username} -p 8888 -H ${port} -S ${secret} --aes-pwd proxy-secret proxy-multi.conf -M 1`)



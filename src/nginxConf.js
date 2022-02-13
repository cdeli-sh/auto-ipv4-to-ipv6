const { render } = require('template-file');
const fs = require('fs');
const dig = require('dns').lookup;
const path = require('path');
const { exec } = require('child_process');

const template = fs.readFileSync(path.resolve(__dirname, 'ipv6host.conf.template'), 'utf8');

const renderConfig = (hostname, ipv6) => {
  // Replace variables in template
  const renderedConf = render(template, { hostname, ipv6 });

  // Write rendered config to file
  fs.writeFileSync(`${process.env.NGINX_CONFIG_DIR}/${hostname}.conf`, renderedConf);

  // Reload Nginx
  exec(process.env.NGINX_RESTART_COMMAND);
};

const generateConfig = (req) => {
  // Check if config file has not already been generated
  if (!fs.existsSync(`${process.env.NGINX_CONFIG_DIR}/${req.hostname}.conf`)) {
    // Get IPv6 address from DNS
    dig(req.hostname, 6, (err, address, family) => {
      if (err) {
        console.log(err);
      } else {
        // Render the config file
        renderConfig(req.hostname, address);
      }
    });
  }
};

module.exports = generateConfig;

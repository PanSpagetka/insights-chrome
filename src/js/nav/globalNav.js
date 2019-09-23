export let getNavFromConfig = (masterConfig) => {
    let globalNav = {};
    // Get the top-level apps from the master config
    Object.keys(masterConfig).filter(appid => masterConfig[appid].top_level).forEach((appid) => {
        globalNav[appid] = getAppData(appid, 'routes', masterConfig);
    });
    return globalNav;
};

// Returns a list of routes/subItems owned by an app
function getRoutesForApp(app, masterConfig) {
    if (app.hasOwnProperty('frontend') && app.frontend.hasOwnProperty('sub_apps')) {
        let routes = [];
        app.frontend.sub_apps.forEach((subItem => {
            let subAppData;
            if (subItem.title) {
                subAppData = {
                    id: subItem.id || '',
                    title: subItem.title
                };
            } else {
                subAppData = getAppData(subItem.id || subItem, 'subItems', masterConfig);
            }

            if (subItem.default) {subAppData.default = subItem.default;}

            if (subItem.group) {subAppData.group = subItem.group;}

            if (!(subAppData.disabled_on_prod && window.location.hostname === 'cloud.redhat.com')) {
                routes.push(subAppData);
            }
        }));
        return routes;
    }
}

// Gets the app's data from the master config, if it exists
function getAppData(appId, propName, masterConfig) {
    const app = masterConfig[appId];
    if (app && app.hasOwnProperty('frontend')) {
        const routes = getRoutesForApp(app, masterConfig);
        let appData = {
            title: app.frontend.title || app.title
        };
        if (!app.frontend.suppress_id) {appData.id = appId;}

        if (app.frontend.reload) {appData.reload = app.frontend.reload;}

        if (app.disabled_on_prod) {
            appData.disabled_on_prod = app.disabled_on_prod; // eslint-disable-line camelcase
        }

        if (routes) {appData[propName] = routes;}

        return appData;
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

export let DotNet = {}; // DotNet can be thought of as the exported API

function configLoaded(config) {
    const onConfigLoadedCallback = DotNet['onConfigLoaded'];
    const onMonoRuntimeInitializedCallback = DotNet['onMonoRuntimeInitialized'];
    const onInitError = DotNet['onInitError'];
    // Note: onRuntimeInitialized is called by emsdk in another location

    config.loaded_cb = function () {
        // sends callback so that user knows that mono is loaded
        onMonoRuntimeInitializedCallback();
    };
    config.fetch_file_cb = function (asset) {
        return fetch (asset, { credentials: 'same-origin' });
    }
    
    // sends callback so that user can modify the config as needed before sending it to mono but this is optional
    // for user to handle
    if (!config.error) {
        config = onConfigLoadedCallback(config) ?? config;
    } else {
        // send error callback with the error message
        onInitError(config.error);
        return; // no point in continuing loading mono as config is incorrect
    }

    try
    {
        MONO.mono_load_runtime_and_bcl_args (config);
    } catch (error) {
        onInitError(error);
    }
}



// MOSTLY COPIED FROM PR#53606 WHICH HAS NOT BEEN MERGED YET /////////////////////////////////////////////////////////

// Loads the config file located in the root of the project
// Not meant to be used outside of this class (TODO make private to this file when project converted to TS)
function load_config() {
    // since this file loads before emsdk we don't have environment vars yet, so we define them locally
    const ENVIRONMENT_IS_NODE = typeof process === "object";
    const ENVIRONMENT_IS_WEB = typeof window === "object";

    if (ENVIRONMENT_IS_NODE){
        try {
            const config = JSON.parse(require("./mono-config.json"));
            configLoaded(config);
        } catch(e) {
            configLoaded({error: "Error loading mono-config.json file from current directory"});
        }
    } else if (ENVIRONMENT_IS_WEB){
        const xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open("GET", "./mono-config.json", true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == XMLHttpRequest.DONE) {
                if (xobj.status === 0 || (xobj.status >= 200 && xobj.status < 400)) {
                    const config = JSON.parse(xobj.responseText);
                    configLoaded(config);
                } else {
                    // error if the request to load the file was successful but loading failed
                    configLoaded({error: "Error loading mono-config.json file from current directory"});
                }
            }
        };
        xobj.onerror = function() {
            // error if the request failed
            configLoaded({error: "Error loading mono-config.json file from current directory"});
        }

        try {
            xobj.send();
        } catch(e) {
            // other kinds of errors
            configLoaded({error: "Error loading mono-config.json file from current directory"});
        }
    } else { // shell or worker
        try {
            const config = JSON.parse(read("./mono-config.json")); // read is a v8 debugger command
            configLoaded(config);
        } catch(e) {
            configLoaded({error: "Error loading mono-config.json file from current directory"});
        }
    }
}
load_config();

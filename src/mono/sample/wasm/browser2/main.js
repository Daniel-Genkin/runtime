// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

"use strict"; // I am working on this in a separate PR but am including it here as well

import DotNet from "./dotnet.js"; // User can import DotNet so that there can even potentially be multiple instances in 1 app

// Called when the mono-config.js (soon to be mono-config.json via PR#53606) is loaded
function onConfigLoaded (config) {
    // we can do some modification to config at runtime here
    // then return it
    // i.e. config.newProp = "test new prop";

    return config;
}

// Called when Emscripten runtime is loaded
function onRuntimeInitialized () {
}

// Called when MONO runtime is loaded and ready successfully
function onMonoRuntimeInitialized () {
    SampleApp.init()
}

// Called when MONO runtime or the config file didn't load correctly
function onInitError(error) {
   test_exit(1); // test runner related
   throw(error);
}

DotNet.onConfigLoaded = onConfigLoaded; // optional
DotNet.onRuntimeInitialized = onRuntimeInitialized; // optional
DotNet.onMonoRuntimeInitialized = onMonoRuntimeInitialized; // required as it acts like the entry point into the program
DotNet.onInitError = onInitError; // required as it acts like the entry point into the program if loading the runtime fails
// They are called in the following order: onConfigLoaded, onRuntimeInitialized, onMonoRuntimeInitialized




// FROM HTML SCRIPT TAG (all js code should be in js files) ////////////////////////////////////////////////////////////////////////////
// Only modification was to use newer syntax.

let is_testing = false;
function onLoad () {
    const url = new URL(decodeURI(window.location));
    let args = url.searchParams.getAll('arg');
    is_testing = args !== undefined && (args.find(arg => arg == '--testing') !== undefined);
};
onLoad();

function test_exit (exit_code) {
    if (!is_testing) {
        console.log(`test_exit: ${exit_code}`);
        return;
    }

    /* Set result in a tests_done element, to be read by xharness */
    let tests_done_elem = document.createElement("label");
    tests_done_elem.id = "tests_done";
    tests_done_elem.innerHTML = exit_code.toString();
    document.body.appendChild(tests_done_elem);

    console.log(`WASM EXIT ${exit_code}`);
};

const SampleApp = {
    init: function () {
        const ret = BINDING.call_static_method("[Wasm.Browser.Sample] Sample.Test:TestMeaning", []);
        document.getElementById("out").innerHTML = ret;

        if (is_testing)
        {
            console.debug(`ret: ${ret}`);
            let exit_code = ret == 42 ? 0 : 1;
            test_exit(exit_code);
        }
    },
};

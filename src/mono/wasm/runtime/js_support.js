// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

// NOTE THAT THIS FILE IS A PRE-JS SO IT IS PREPENDED TO DOTNET.JS AND RUNS BEFORE ALMOST ALL OTHER THINGS

// Since we load the mono config in preInit but don't want to force the user to
// need to use Module, we do it here. Note that the user will 
var DotNet = {
    // loads the config file
    preInit: async function() {
        const config = await MONO.mono_wasm_load_config("./mono-config.json");
        this.onConfigLoaded(config);
    },

    // sends various callbacks at different times to notify user code
    onConfigLoaded(config) {
		const onConfigLoadedCallback = DotNet['onConfigLoaded'] ?? (() => {});
		const onRuntimeStarted = DotNet['onRuntimeStarted'] ?? (() => {});
		const onInitError = DotNet['onInitError'] ?? (() => {});
		// Note: onRuntimeInitialized is called by emsdk in another location
	
		config.loaded_cb = function () {
			// sends callback so that user knows that mono is loaded
			onRuntimeStarted();
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
	},
}; 
